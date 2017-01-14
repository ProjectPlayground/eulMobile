import { Component } from '@angular/core';
import {NavController, NavParams, Loading, AlertController, LoadingController} from 'ionic-angular';
import {AuthService} from "../../providers/auth-service";
import { DashboardPage } from "../dashboard/dashboard";

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  loading: Loading;
  registerCredentials = {login: '', password: ''};

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private auth: AuthService,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController) {}

  ionViewDidLoad() {
    if (localStorage.getItem('currentUser')) {
      this.navCtrl.setRoot(DashboardPage);
    }
  }

  public login() {
    this.showLoading()
    this.auth.login(this.registerCredentials.login, this.registerCredentials.password).subscribe(allowed => {
        if (allowed) {
          setTimeout(() => {
            this.loading.dismiss();
            this.navCtrl.setRoot(DashboardPage)
          });
        } else {
          this.showError("Access Denied");
        }
      },
      error => {
        this.showError(error);
      });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  showError(text) {
    setTimeout(() => {
      this.loading.dismiss();
    });

    let alert = this.alertCtrl.create({
      title: 'Failed :(',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }
}
