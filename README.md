IB-serverless-webapp
================================================================================

This code pattern shows how to write Angular web applications which use OpenWhisk actions to implement backend logic. Users need to log in with their Google accounts via OAuth. After this users can access IBM function actions that have been protected via IBM function API management. 

Pre-requistite
Have IBM cloud account.    
[Download](https://console.bluemix.net/openwhisk/learn/cli) the IBM function CLI.


Setup
================================================================================

**Create protected API**

* Run 'wsk bluemix login'
* Define in openwhisk-protected/my-api-swagger.json 1. x-openwhisk.namespace, 2. x-openwhisk.url and 3. target-url
* Run 'openwhisk-protected/init.sh'

Alternatively you can do this manually:

* Create a simple action and configure API management (see screenshots)
* Select user authentication via Google logins and CORS
* Share the API and get the URL

**Deploy OpenWhisk OAuth Actions**

* Run 'openwhisk-oauth/init.sh'
* Get the URL of the oauth-login-and-redirect action from the dashboard

**Create Google Application**

* Open the [Google Developers API Console](https://console.developers.google.com/apis)
* Define the URL of the oauth-login-and-redirect action as callback
* Get the client id and secret

**Deploy OpenWhisk OAuth Actions again**

* Create a file 'openwhisk-oauth/providers.json' (based on providers-template.json)
* Define client id, secret and redirect URL
* Run 'openwhisk-oauth/init.sh'

**Configure and run the Angular App**

* Create a file 'angular/src/assets/providers.json' (based on providers-template.json)
* Define client id, protected Url, redirect URL and protectedUrl
* From the /angular folder run 'ng serve' and open localhost:4200
* Click on login to invoke the oauth dance and then on invoke action


Credit and Next Steps
================================================================================

Thank you to Nick Mitchell and Lionel Villard for their work on the open source project [openwhisk-oauth](https://github.com/starpit/openwhisk-oauth), especially for the OAuth login functionality.

Next I'd like to add two features:

* Renew access tokens before they expire
* Document how to deploy the static Angular files (in dist directory after 'ng build -prod') to Object Storage, Surge, etc.
* Convert sh scripts in Node code to support multiple platforms
