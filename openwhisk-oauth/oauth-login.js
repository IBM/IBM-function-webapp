//------------------------------------------------------------------------------
// Copyright IBM Corp. 2017
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Original author: Nick Mitchell https://github.com/starpit/openwhisk-oauth/blob/master/actions/login/login.js
//------------------------------------------------------------------------------

var request = require('request');

/**
 * Listen for requests for oauth logins from the clients
 *
 * the client is giving has an oauth code; we want to exchange
 * this for an access_token, and, from there, for some identifying
 * information from the user's profile. first thing's first...
 *
 */
function main(params) {

	return new Promise((resolve, reject) => {
		// here are the provider secrets
		const providers = params.providers;

		// here is the oauth code the client gave us
		const code = params.code;

		var providerName = params.provider || params.providerName;
		var provider = providers[providerName];

		//
		// this is the body of our access_token request
		//
		var form = {
			client_id: provider.credentials.client_id,
			client_secret: provider.credentials.client_secret,
			code: code
		};
		const params_token_endpoint_form = params.token_endpoint_form || {};
		if (provider.token_endpoint_form) {
			for (var x in provider.token_endpoint_form) {
				form[x] = params_token_endpoint_form[x] || provider.token_endpoint_form[x];
			}
		}

		//
		// form the request options for the access_token
		//
		var options = {
			url: provider.endpoints.token,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		};
		if (provider.token_endpoint_form_is_json) {
			options.headers['Accept'] = 'application/json';
			options.body = form;
			options.json = true;
		} else {
			options.form = form;
		}

		if (provider.token_endpoint_needs_auth) {
			options.auth = {
				user: form.client_id,
				pass: form.client_secret
			}
		}

		//
		// ok, here we go, exchanging the oauth code for an access_token
		//
		request(options, function (err, response, body) {

			if (err || response.statusCode >= 400) {
				const errorMessage = err || { statusCode: response.statusCode, body: body }
				console.error(JSON.stringify(errorMessage));
				reject(errorMessage);

			} else {
				//
				// all right, we now have an access_token
				//
				if (typeof body == 'string') {
					body = JSON.parse(body);
				}

				// console.log("TOKEN RESPONSE", body)

				//
				// now we request the user's profile, so that we have some
				// persistent identifying information; e.g. email address
				// for account handle
				//
				request({
					url: provider.endpoints.userinfo + (provider.token_as_query ? `?${provider.token_as_query}=${body.access_token}` : ''),
					method: 'GET',
					headers: {
						'Accept': 'application/json',
						'Authorization': (provider.authorization_type || 'token') + ' ' + body.access_token,
						'User-Agent': 'OpenWhisk'
					}
				}, function (err2, response2, body2) {
					console.log(body2)
					if (err2 || response2.statusCode >= 400) {
						const errorMessage = err2 || { statusCode: response2.statusCode, body: body2 }
						console.error(JSON.stringify(errorMessage));
						reject(errorMessage);

					} else {
						//
						// great, now we have the profile!
						//
						if (typeof body2 == 'string') {
							body2 = JSON.parse(body2);
						}

						resolve({
							provider: providerName,
							access_token: body.access_token,
							refresh_token: body.refresh_token,
							id: body2[provider.userinfo_identifier],
							idRecord: provider.userinfo_identifier_full_record && body2,
							access_token_body: body,
							name: body2.name,
							given_name: body2.given_name,
							family_name: body2.given_name
						});
					}
				});
			}
		});
	});
}

