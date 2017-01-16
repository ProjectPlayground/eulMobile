import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {ServiceHandler} from "./service-handler";
import {Observable} from "rxjs";
import {temperature} from "./dto/temperature";
import {humidity} from "./dto/humidity";
import {insolation} from "./dto/insolation";
import {rainfall} from "./dto/rainfall";
import {Loading, LoadingController} from "ionic-angular";
import {weight} from "./dto/weight";

/*
  Generated class for the MeasurementService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class MeasurementService extends ServiceHandler{

  public loading : Loading;

  private hiveURLRemote : string = 'http://raspeul.hopto.org:8080/eul/measurements/';
  private hiveURLLocal : string = 'http://localhost:8081/measurements/';

  constructor(public http: Http,
              public loadingCtrl: LoadingController) {
    super();
  }

  public showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Getting data...'
    });
    this.loading.present();
  }

  public dismissLoading() {
    this.loading.dismiss();
  }

  getTemperatureMeasurements(hive_id : number, from_timestamp : number, to_timestamp : number) : Observable<temperature[]> {
    let currUser =  JSON.parse(localStorage.getItem('currentUser'));
    let token = currUser && currUser.token;
    let headers = new Headers({ 'Content-Type': 'application/json',
                                'Authorization': token });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this.hiveURLRemote + 'temperature/' + hive_id + '/' + from_timestamp + '/' + to_timestamp, options)
      .map(this.extractBasicData)
      .catch(this.handleError);
  }

  getHumidityMeasurements(hive_id : number, from_timestamp : number, to_timestamp : number) : Observable<humidity[]> {
    let currUser =  JSON.parse(localStorage.getItem('currentUser'));
    let token = currUser && currUser.token;
    let headers = new Headers({ 'Content-Type': 'application/json',
                                'Authorization': token });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this.hiveURLRemote + 'humidity/' + hive_id + '/' + from_timestamp + '/' + to_timestamp, options)
      .map(this.extractBasicData)
      .catch(this.handleError);
  }

  getInsolationMeasurements(hive_id : number, from_timestamp : number, to_timestamp : number) : Observable<insolation[]> {
    let currUser =  JSON.parse(localStorage.getItem('currentUser'));
    let token = currUser && currUser.token;
    let headers = new Headers({ 'Content-Type': 'application/json',
      'Authorization': token });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this.hiveURLRemote + 'insolation/' + hive_id + '/' + from_timestamp + '/' + to_timestamp, options)
      .map(this.extractBasicData)
      .catch(this.handleError);
  }

  getRainfallMeasurements(hive_id : number, from_timestamp : number, to_timestamp : number) : Observable<rainfall[]> {
    let currUser =  JSON.parse(localStorage.getItem('currentUser'));
    let token = currUser && currUser.token;
    let headers = new Headers({ 'Content-Type': 'application/json',
      'Authorization': token });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this.hiveURLRemote + 'rainfall/' + hive_id + '/' + from_timestamp + '/' + to_timestamp, options)
      .map(this.extractBasicData)
      .catch(this.handleError);
  }

  getWeightMeasurements(hive_id : number, from_timestamp : number, to_timestamp : number) : Observable<weight[]> {
    let currUser =  JSON.parse(localStorage.getItem('currentUser'));
    let token = currUser && currUser.token;
    let headers = new Headers({ 'Content-Type': 'application/json',
      'Authorization': token });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this.hiveURLRemote + 'weight/' + hive_id + '/' + from_timestamp + '/' + to_timestamp, options)
      .map(this.extractBasicData)
      .catch(this.handleError);
  }

  getLatestWeights(inputObject) {
    let currUser =  JSON.parse(localStorage.getItem('currentUser'));
    let token = currUser && currUser.token;
    let headers = new Headers({ 'Content-Type': 'application/json',
      'Authorization': token });
    let options = new RequestOptions({ headers: headers });

    let observableBatch = [];

    inputObject.forEach(( componentarray ) => {
      observableBatch.push( this.http.get(this.hiveURLRemote + 'weight/' + componentarray.id + '/latest', options).map((res: Response) => res.json()) );
    });

    return Observable.forkJoin(observableBatch);
  }


}
