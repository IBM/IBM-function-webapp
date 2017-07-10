import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import * as providers from '../assets/providers.json';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Component({
  selector: 'app-root',
  templateUrl: './home.component.html'
})

export class HomeComponent {

  private initialized: boolean = false;
  private redirectUrl: string;
  private authorizationUrl: string;
  private clientId: string;
  private protectedUrl: string;

  private accessToken: string;
  private refreshToken: string;
  private expiresIn: string;
  private userName: string;

  private resultOfProtectedAPI;

  onButtonLoginClicked(): void {
    if (this.initialized == true) {
      let url = this.authorizationUrl + "?scope=email";
      url = url + "&response_type=" + "code";
      url = url + "&client_id=" + this.clientId;
      url = url + "&access_type=" + "offline";
      url = url + "&redirect_uri=" + this.redirectUrl;
      window.location.href = url;
    }
  }

  /*
  curl --request GET \
  --url https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/a172f687d4c7fac2da3546903009090a18a9643313d2d6e47ff43dd8ede5fa3a/niklas/action \
  --header 'accept: application/json' \
  --header 'authorization: Bearer REPLACE_BEARER_TOKEN'
  */

  onButtonInvokeActionClicked(): void {
    
    let headers = new Headers({
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + this.accessToken
    });
    let options = new RequestOptions({ headers: headers });

    this.http.get(this.protectedUrl, options)
      .map(res => res.json())
      .subscribe(
      result => {
        console.log(result)
        this.resultOfProtectedAPI = JSON.stringify(result, null, 2);
      },
      err => {
        console.error(err);
        this.resultOfProtectedAPI = JSON.stringify(err._body, null, 2);
      });
  }

  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {
    let googleProvider = providers['google'];
    if (googleProvider) {
      this.redirectUrl = googleProvider['redirectUrl'];
      this.authorizationUrl = googleProvider['authorizationUrl'];
      this.clientId = googleProvider['clientId'];
      this.protectedUrl = googleProvider['protectedUrl'];
      if (this.redirectUrl && this.clientId && this.authorizationUrl && this.protectedUrl) {
        this.initialized = true;
      }
    }

    this.accessToken = this.route.snapshot.queryParams["access_token"];
    if (this.accessToken) console.log(this.accessToken)
    this.refreshToken = this.route.snapshot.queryParams["refresh_token"];
    if (this.refreshToken) console.log(this.refreshToken)
    this.expiresIn = this.route.snapshot.queryParams["expires_in"];
    if (this.expiresIn) console.log(this.expiresIn)
    this.userName = this.route.snapshot.queryParams["user_name"];
    if (this.userName) console.log(this.userName)
  }

}

