import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs";

/*
  Generated class for the AuthService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthService {

  private loginUrlLocal: string = 'http://localhost:8081/auth';
  private loginUrlRemote: string = 'http://raspeul.hopto.org:8080/eul/auth';

  constructor(public http: Http) {}

  public login(username: string, password: string): Observable<boolean> {

    let bodyString = JSON.stringify({ username: username, password: password });
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.loginUrlRemote, bodyString, options)
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        let token = response.json() && response.json().token;
        if (token) {
          localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));
          return true;
        } else {
          console.log('Error with token');
          return false;
        }
      })
      .catch(this.handleError);
  }

  public logout(): void {
    console.log('logging out...');
    localStorage.removeItem('currentUser');
  }


  private handleError (error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
