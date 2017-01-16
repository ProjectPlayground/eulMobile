import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import { StatusBar, Splashscreen } from 'ionic-native';

import { DashboardPage } from '../pages/dashboard/dashboard';
import { ListPage } from '../pages/list/list';
import { LoginPage } from "../pages/login/login";
import {ManagerPage} from "../pages/manager/manager";
import {HarvestPage} from "../pages/harvest/harvest";
import {
  Push,
  PushToken
} from '@ionic/cloud-angular';
import {notification} from "../providers/dto/notification";
import {UserService} from "../providers/user-service";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public userService: UserService,
    public push: Push
  ) {
    if(localStorage.getItem('currentUser')) {
      this.rootPage = DashboardPage;
    } else {
      this.rootPage = LoginPage;
    }
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Dashboard', component: DashboardPage },
      { title: 'Manager', component: ManagerPage},
      { title: 'Measurements', component: ListPage },
      { title: 'Harvest', component: HarvestPage},
      { title: 'Logout', component: LoginPage}
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {

      StatusBar.styleDefault();
      Splashscreen.hide();
    });

    this.push.register().then((t: PushToken) => {
      return this.push.saveToken(t);
    }).then((t: PushToken) => {
      console.log('Token saved:', t.token);
      localStorage.setItem('firebaseToken', t.token);
      this.postNotificationsSetup(new notification(false, true, 80, ''));
    });

    this.push.rx.notification()
      .subscribe((msg) => {
        alert(msg.title + ': ' + msg.text);
      });
  }

  openPage(page) {
    if(page.component == LoginPage) {
      localStorage.removeItem('currentUser');
    }

    this.menu.close();
    this.nav.setRoot(page.component);
  }

  private postNotificationsSetup(notification : notification) {
    notification.deviceId = localStorage.getItem('firebaseToken');
    this.userService.setNotifications(notification)
      .subscribe(
        error => console.error(error),
        () => {
          console.log('Posting notifications done!');
        }
      );
  }
}
