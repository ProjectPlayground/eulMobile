import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {ServiceHandler} from "./service-handler";
import {Observable} from "rxjs";
import {hive} from "./dto/hive";
import {AccessPoint} from "./dto/AccessPoint";

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

  getHivesPublic() : Observable<hive[]> {
    let currUser =  JSON.parse(localStorage.getItem('currentUser'));
    let token = currUser && currUser.token;
    let headers = new Headers({ 'Content-Type': 'application/json',
      'Authorization': token });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this.hiveURLRemote + 'public', options)
      .map(this.extractBasicData)
      .catch(this.handleError);
  }

  getHivesFullConfig() : Observable<hive[]> {
    let currUser =  JSON.parse(localStorage.getItem('currentUser'));
    let token = currUser && currUser.token;
    let headers = new Headers({ 'Content-Type': 'application/json',
      'Authorization': token });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this.hiveURLRemote + 'internal', options)
      .map(this.extractBasicData)
      .catch(this.handleError);
  }

  addHive(body : hive): Observable<hive> {
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


  updateHive(body : hive) {
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
