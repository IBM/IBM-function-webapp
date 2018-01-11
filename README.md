Use IBM function to create an OAuth app with Angular
================================================================================

This code pattern shows how to write Angular web applications which use IBM function actions to implement backend logic. Users need to log in with their Google accounts via OAuth. After this users can access IBM function actions that have been protected via IBM function API management. 

## Pre-requistite
**[Register](https://console.bluemix.net/registration/) an IBM Cloud account.**        
**[Download](https://console.bluemix.net/openwhisk/learn/cli) the IBM function CLI.**      
**Install Angular. Run:**       
` npm install -g @angular/cli`    
` npm install `


Steps
================================================================================

**1. Create protected API**

* Run `wsk bluemix login` or `wsk bluemix login --sso` if you have sso enabled. This command will make you pick a openwisk namespace, like this:
```
Select a namespace:
1. andy.shi_dev
2. Developer Advocacy_dev
3. Developer Advocacy_Watson Developer Advocacy
4. Developer Advocacy_Cloud Developer Advocacy
namespace>1
ok: User 'Andy.Shi@ibm.com' logged into Bluemix
```
Choose a namespace from the list and remember it.

* Modify openwhisk-protected/my-api-swagger.json. Replace all the occurances of my namespace `andy.shi_dev` with your picked namespace. Here are the fields:
```
"x-openwhisk": {
					"namespace": "andy.shi_dev",
					...
					"url": "https://openwhisk.ng.bluemix.net/api/v1/web/andy.shi_dev/default/protected-action.json"
				},
...

"x-ibm-configuration": {
		"assembly": {
			"execute": [{
				"operation-switch": {
					"case": [{
						"operations": ["getAction"],
						"execute": [{
							"invoke": {
								"target-url": "https://openwhisk.ng.bluemix.net/api/v1/web/andy.shi_dev/default/protected-action.json",
```  

* Run:
```
cd openwhisk-protected
/init.sh
```


**2. Deploy OpenWhisk OAuth Actions**

* Run 'openwhisk-oauth/init.sh'
* Get the URL of the oauth-login-and-redirect action from the dashboard

**3. Create Google Application**

* Open the [Google Developers API Console](https://console.developers.google.com/apis)
* Define the URL of the oauth-login-and-redirect action as callback
* Get the client id and secret

**4. Deploy OpenWhisk OAuth Actions again**

* Create a file 'openwhisk-oauth/providers.json' (based on providers-template.json)
* Define client id, secret and redirect URL
* Run 'openwhisk-oauth/init.sh'

**5. Configure and run the Angular App**

* Create a file 'angular/src/assets/providers.json' (based on providers-template.json)
* Define client id, protected Url, redirect URL and protectedUrl
* From the /angular folder run 'ng serve' and open localhost:4200
* Click on login to invoke the oauth dance and then on invoke action


Credit and Next Steps
================================================================================

Thank you to Nick Mitchell and Lionel Villard for their work on the open source project [openwhisk-oauth](https://github.com/starpit/openwhisk-oauth), especially for the OAuth login functionality.
