import { Component } from '@angular/core';

import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import {HiveService, Hive} from "../../providers/hive-service";
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';


@Component({
  templateUrl: 'manager.html'
})
export class ManagerPage {

  private hives: Hive[] = [];

  constructor(public modalCtrl: ModalController,
              private hiveService: HiveService,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController) {
    this.updateHiveList();
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
            var hive : Hive = new Hive(data.name, data.location);
            this.hiveService.addHive(hive)
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
    this.hiveService.getHives()
      .subscribe(
        data => { console.log(data); this.hives = data},
        error => console.error(error),
        () => console.log('Getting hives info done! ' + this.hives[0])
      );
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

  dismiss() {
    this.viewCtrl.dismiss();
  }

  private updateHiveName() {
    var jsonResponse;

    let prompt = this.alertCtrl.create({
      title: 'New name',
      message: "Enter new name for this hive",
      inputs: [
        {
          name: 'name',
          placeholder: 'New hive name'
        },
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
            var hive : Hive = new Hive(data.name, this.hive.location, this.hive.id);
            this.hiveService.updateHive(hive)
              .subscribe(
                data => jsonResponse = JSON.stringify(data),
                error => this.presentToast('Error, something went wrong :('),
                () => {
                  this.hive.name = data.name;
                  this.presentToast('Name updated successfully!');
                }
              );
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }
  private updateHiveLocation() {
    var jsonResponse;

    let prompt = this.alertCtrl.create({
      title: 'New location',
      message: "Enter new location for this hive",
      inputs: [
        {
          name: 'location',
          placeholder: 'New hive location'
        },
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
            var hive : Hive = new Hive(this.hive.name, data.location, this.hive.id);
            this.hiveService.updateHive(hive)
              .subscribe(
                data => jsonResponse = JSON.stringify(data),
                error => this.presentToast('Error, something went wrong :('),
                () => {
                  this.hive.location = data.location;
                  this.presentToast('Location updated successfully!');
                }
              );
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
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
