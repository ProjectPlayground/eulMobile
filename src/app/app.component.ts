import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import { StatusBar, Splashscreen } from 'ionic-native';

import { DashboardPage } from '../pages/dashboard/dashboard';
import { ListPage } from '../pages/list/list';
import { LoginPage } from "../pages/login/login";
import {ManagerPage} from "../pages/manager/manager";
import {HarvestPage} from "../pages/harvest/harvest";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any = LoginPage;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Dashboard', component: DashboardPage },
      { title: 'Manager', component: ManagerPage},
      { title: 'Measurements', component: ListPage },
      { title: 'Logout', component: LoginPage},
      { title: 'Harvest', component: HarvestPage}
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {

      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {

    if(page.component == LoginPage) {
      localStorage.removeItem('currentUser');
      console.log(localStorage.getItem('currentUser'));
    }

    this.menu.close();
    this.nav.setRoot(page.component);
  }
}
