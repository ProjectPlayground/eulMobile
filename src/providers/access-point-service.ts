import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs";
import {AccessPoint} from "./dto/AccessPoint";
import {ServiceHandler} from "./service-handler";

/*
  Generated class for the AccessPointService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AccessPointService extends ServiceHandler{

  private accessPointURILocal = 'http://localhost:8081/ap/';
  private accessPointURIRemote = 'http://raspeul.hopto.org:8080/eul/ap/';

  constructor(public http: Http) {
    super();
  }

  getAccessPoints() : Observable<AccessPoint[]> {
    let currUser =  JSON.parse(localStorage.getItem('currentUser'));
    let token = currUser && currUser.token;
    let headers = new Headers({ 'Content-Type': 'application/json',
      'Authorization': token });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this.accessPointURIRemote, options)
      .map(this.extractBasicData)
      .catch(this.handleError);
  }

  updateAccessPoints(body : AccessPoint) {
    console.log(body);
    let currUser =  JSON.parse(localStorage.getItem('currentUser'));
    let token = currUser && currUser.token;
    let bodyString = JSON.stringify(body);
    let headers = new Headers({ 'Content-Type': 'application/json',
      'Authorization': token });
    let options = new RequestOptions({ headers: headers });

    return this.http.put(this.accessPointURIRemote, bodyString, options)
  }

}
