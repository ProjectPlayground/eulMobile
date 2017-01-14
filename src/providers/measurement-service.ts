import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {ServiceHandler} from "./service-handler";
import {Observable} from "rxjs";
import {Temperature} from "./dto/temperature";

/*
  Generated class for the MeasurementService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class MeasurementService extends ServiceHandler{

  private hiveURLRemote : string = 'http://raspeul.hopto.org:8080/eul/measurements/';
  private hiveURLLocal : string = 'http://localhost:8081/measurements/';

  constructor(public http: Http) {
    super();
  }

  getTemperatureMeasurements(hive_id : number, from_timestamp : number, to_timestamp : number) : Observable<Temperature[]> {
    let currUser =  JSON.parse(localStorage.getItem('currentUser'));
    let token = currUser && currUser.token;
    let headers = new Headers({ 'Content-Type': 'application/json',
                                'Authorization': token });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this.hiveURLRemote + 'temperature/' + hive_id + '/' + from_timestamp + '/' + to_timestamp, options)
      .map(this.extractBasicData)
      .catch(this.handleError);
  }


}
