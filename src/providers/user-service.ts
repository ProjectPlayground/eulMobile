import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {ServiceHandler} from "./service-handler";
import {Observable} from "rxjs";

/*
  Generated class for the UserService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

export class Notification {
  constructor(
    public webNotification : boolean,
    public smsNotification : boolean,
    public weightThreshold : number,
    public deviceId : string,
    public userId? : string,
    public id? : number) {}
}

export class User {
  constructor(public id : number,
              public username : string,
              public firstname: string,
              public lastname : string,
              public email : string) {}
}

@Injectable()
export class UserService extends ServiceHandler{

  private userInfoURLLocal : string = 'http://localhost:8081/userinfo/';
  private userInfoURLRemote : string = 'http://raspeul.hopto.org:8080/eul/userinfo/';

  constructor(public http: Http) {
    super();
  }

  public getUserInfo(): Observable<User> {
    let currUser =  JSON.parse(localStorage.getItem('currentUser'));
    let token = currUser && currUser.token;
    let username = currUser && currUser.username;
    let headers = new Headers({ 'Content-Type': 'application/json',
      'Authorization': token });
    let options = new RequestOptions({ headers: headers });
    console.log('username for userinfo: ' + username);

    return this.http.get(this.userInfoURLRemote + username, options)
      .map(this.extractBasicData)
      .catch(this.handleError);
  }

  public setNotifications(notification : Notification): Observable<Notification> {
    let currUser =  JSON.parse(localStorage.getItem('currentUser'));
    let token = currUser && currUser.token;
    let headers = new Headers({ 'Content-Type': 'application/json',
                                'Authorization': token });
    let options = new RequestOptions({ headers: headers });
    let bodyString = JSON.stringify(notification);

    return this.http.post(this.userInfoURLRemote + 'notification/', bodyString, options)
      .map(this.extractBasicData)
  }

  public getNotificationSetup(): Observable<Notification> {
    let currUser =  JSON.parse(localStorage.getItem('currentUser'));
    let token = currUser && currUser.token;
    let headers = new Headers({ 'Content-Type': 'application/json',
      'Authorization': token });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this.userInfoURLRemote + 'notification/', options)
      .map(this.extractBasicData)
      .catch(this.handleError);
  }

  public deleteNotificationSetup() {
    let currUser =  JSON.parse(localStorage.getItem('currentUser'));
    let token = currUser && currUser.token;
    let headers = new Headers({ 'Content-Type': 'application/json',
      'Authorization': token });
    let options = new RequestOptions({ headers: headers });

    return this.http.delete(this.userInfoURLRemote + 'notification/', options)
      .map(this.extractBasicData)
  }

}
