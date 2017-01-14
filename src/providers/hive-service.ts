import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {ServiceHandler} from "./service-handler";
import {Observable} from "rxjs";

export class Hive{

  constructor(
    public name: string,
    public location: string,
    public id?: number
  ) {}
}
/*
  Generated class for the HiveService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class HiveService extends ServiceHandler {

  private hiveURLLocal : string = 'http://localhost:8081/hives/';
  private hiveURLRemote : string = 'http://raspeul.hopto.org:8080/eul/hives/';

  constructor(public http: Http) {
    super();
  }

  getHives() : Observable<Hive[]> {
    let currUser =  JSON.parse(localStorage.getItem('currentUser'));
    let token = currUser && currUser.token;
    let headers = new Headers({ 'Content-Type': 'application/json',
      'Authorization': token });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this.hiveURLRemote, options)
      .map(this.extractBasicData)
      .catch(this.handleError);
  }

  addHive(body : Hive): Observable<Hive> {
    let currUser =  JSON.parse(localStorage.getItem('currentUser'));
    let token = currUser && currUser.token;
    let bodyString = JSON.stringify(body);
    let headers = new Headers({ 'Content-Type': 'application/json',
      'Authorization': token });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.hiveURLRemote, bodyString, options)
      .map(this.extractBasicData)
      .catch(this.handleError);
  }

  deleteHive(id : number) {
    let currUser =  JSON.parse(localStorage.getItem('currentUser'));
    let token = currUser && currUser.token;
    let headers = new Headers({ 'Content-Type': 'application/json',
      'Authorization': token });
    let options = new RequestOptions({ headers: headers });

    return this.http.delete(this.hiveURLRemote + id, options);
  }

  updateHive(body : Hive) {

    console.log(body);
    let currUser =  JSON.parse(localStorage.getItem('currentUser'));
    let token = currUser && currUser.token;
    let bodyString = JSON.stringify(body);
    let headers = new Headers({ 'Content-Type': 'application/json',
      'Authorization': token });
    let options = new RequestOptions({ headers: headers });

    return this.http.put(this.hiveURLRemote, bodyString, options)
  }

}
