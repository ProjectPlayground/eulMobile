import { Component } from '@angular/core';

import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import {HiveService} from "../../providers/hive-service";
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import {hive} from "../../providers/dto/hive";
import {AccessPoint} from "../../providers/dto/AccessPoint";
import {AccessPointService} from "../../providers/access-point-service";


@Component({
  templateUrl: 'manager.html'
})
export class ManagerPage {

  private hives: hive[] = [];
  private accessPoints: AccessPoint[] = [];
  private interval : number = 0;
  private accessPointID : number;

  constructor(public modalCtrl: ModalController,
              private hiveService: HiveService,
              private accessPointService: AccessPointService,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController) {
    this.updateHiveList();
    this.getAccessPoints();
  }

  private openModal(hive) {
    let modal = this.modalCtrl.create(ModalContentPage, hive);
    modal.present();
    this.updateHiveList();
  }

  private addHive() {
    var jsonResponse;

    let prompt = this.alertCtrl.create({
      title: 'New hive',
      message: "Enter name and location for new hive",
      inputs: [
        {
          name: 'name',
          placeholder: 'Hive name'
        },
        {
          name: 'location',
          placeholder: 'Location'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            var hiveEntry : hive = new hive(data.name, data.location, false, "");
            hiveEntry.accessPoint = new AccessPoint();
            hiveEntry.accessPoint.accessPointID = 1;

            this.hiveService.addHive(hiveEntry)
              .subscribe(
                data => jsonResponse = JSON.stringify(data),
                error => this.presentToast('Error, something went wrong :('),
                () => {
                  this.presentToast('Hive created');
                  this.updateHiveList();
                }
              );
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }
  private updateHiveList() {
    this.hiveService.getHivesFullConfig()
      .subscribe(
        data => this.hives = data,
        error => console.error(error),
      );
  }
  private getAccessPoints() {
    this.accessPointService.getAccessPoints()
      .subscribe(
        data => { this.accessPoints = data },
        error => console.error(error),
        () => {
          this.interval = this.accessPoints[0].commInterval;
        }
      );
  }

  private onIntervalChange(data) {
      this.accessPoints[0].commInterval = data;
      console.log(this.accessPoints[0]);
      this.accessPointService.updateAccessPoints(this.accessPoints[0])
        .subscribe(
          data => console.log(data),
          error => console.log(error),
          () =>  { this.presentToast('Interval updated!'); }
        )
  }

  private presentToast(message : string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
  private doRefresh(refresher) {
    this.getAccessPoints();
    this.hiveService.getHivesFullConfig()
      .subscribe(
        data => { console.log(data); this.hives = data},
        error => console.error(error),
        () => refresher.complete()
      );
  }
}

@Component({ templateUrl: 'modal-content.html'})
export class ModalContentPage {
  private hive;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    private hiveService: HiveService,
    public toastCtrl: ToastController
  ) {
    this.hive = this.params.data;
  }

  private dismiss() {
    this.viewCtrl.dismiss();
  }

  private updateHive() {
    var jsonResponse;

    this.hiveService.updateHive(this.hive)
      .subscribe(
        data => jsonResponse = JSON.stringify(data),
        error => {
          this.presentToast('Fail. Cannot update: ' + error);
          this.dismiss();
        },
        () => {
          this.presentToast('Hive updated!');
          this.dismiss();
        }
      );
  }
  private deleteHive() {
    var jsonResponse;

    let confirm = this.alertCtrl.create({
      title: 'Delete hive?',
      message: 'Are you sure? All measurements will be lost.',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            this.hiveService.deleteHive(this.hive.id)
              .subscribe(
                data => jsonResponse = JSON.stringify(data),
                error => console.error(error),
                () => {
                  this.presentToast('Hive deleted!');
                  this.dismiss();
                }
              );
          }
        }
      ]
    });
    confirm.present();
  }

  private presentToast(message : string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
}
