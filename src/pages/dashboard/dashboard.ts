import { Component } from '@angular/core';
import { HiveService} from "../../providers/hive-service";
import {UserService, User} from "../../providers/user-service";
import {Observable} from "rxjs";
import { hive } from "../../providers/dto/hive";


@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  private hives: hive[] = [];
  private userInfo : User;
  private currDate;

  constructor(private hiveService : HiveService,
              private userService : UserService) {

    this.userService.getUserInfo()
      .subscribe(
        data => this.userInfo = data ,
        error => console.error(error),
        () => console.log('Getting user info done!')
      );

    this.hiveService.getHivesPublic()
      .subscribe(
        data => { this.hives = data},
        error => console.error(error),
        () => console.log('Getting hives info done!')
      );
  }

  ionViewDidLoad() {
    this.currDate = Observable.interval(1000).map(x => new Date()).share();
  }
  doRefresh(refresher) {
    this.hiveService.getHivesPublic()
      .subscribe(
        data => { this.hives = data},
        error => console.error(error),
        () => {
          refresher.complete();
          console.log('Getting hives info done!')
        }
      );
  }

}
