import { Component } from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {weight} from "../../providers/dto/weight";
import {Hive, HiveService} from "../../providers/hive-service";
import {MeasurementService} from "../../providers/measurement-service";
import {
  Push,
  PushToken
} from '@ionic/cloud-angular';
import {UserService} from "../../providers/user-service";
import {notification} from "../../providers/dto/notification";

/*
  Generated class for the Harvest page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-harvest',
  templateUrl: 'harvest.html'
})
export class HarvestPage {

  private hives: Hive[] = [];
  private notificationModelRemote;
  private thresholdWeightSlider;
  private thresholdWeightRemote;

  // barChart
  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero:true
        }
      }]
    }
  };
  public barChartLabels:Array<any> = [];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
  public barChartData:Array<any> = [
    {data: [], label:''},
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private measurements : MeasurementService,
              private hiveService : HiveService,
              private userService: UserService,
              public push: Push,
              public toastCtrl : ToastController
              ) {

    this.getNotificationSetup();
    this.getHivesAndUpdateBarChart();
  }


  private getNotificationSetup() {
    let notificationSetup : notification;
    this.userService.getNotificationSetup()
      .subscribe(
        data => notificationSetup = data,
        error => console.error(error),
        () => {
          this.notificationModelRemote = notificationSetup
          this.thresholdWeightRemote = notificationSetup.weightThreshold;
          this.thresholdWeightSlider = notificationSetup.weightThreshold;
        }
      );
  }

  private updateNotificationSetup() {
    let notificationModel = this.notificationModelRemote;
    notificationModel.weightThreshold = this.thresholdWeightSlider
    this.userService.setNotifications(notificationModel)
      .subscribe(
        error => this.presentToast('Error :('),
        () => {
          this.presentToast('Threshold updated!');
          this.thresholdWeightRemote = this.thresholdWeightSlider;
        }
      );
  }

  private getHivesAndUpdateBarChart() {
    this.measurements.showLoading();
    this.hiveService.getHives()
      .subscribe(
        data => this.hives = data,
        error => console.error(error),
        () => {
          this.measurements.dismissLoading();
          this.getLatestWeightsForAllHives();
        }
      );
  }

  private getLatestWeightsForAllHives() {
    let latestWeights;

    this.measurements.getLatestWeights(this.hives)
      .subscribe(
        data => latestWeights = data,
        error => { console.error(error); },
        () =>   {
          this.updateBarChart(latestWeights);
        }
      );
  }

  private updateBarChart(newValues : Array<weight>) {
    let _barChartDataTemp:Array<any>;
    let _barChartLabels:Array<string> = new Array<string>(this.hives.length);
    let _lastWeight:Array<number> = new Array<number>(this.hives.length);


    for (var i = 0; i < this.hives.length; i++) {
      _lastWeight[i] = newValues[i].weight;
      _barChartLabels[i] = this.hives[i].name;
    }

    _barChartDataTemp = [
      {
        data: _lastWeight,
        label: 'Weight'
      }
    ];

    // Update objects
    this.barChartLabels = _barChartLabels;
    this.barChartData = _barChartDataTemp;
  }

  doRefresh(refresher) {
    this.getNotificationSetup();
    this.getHivesAndUpdateBarChart();
    refresher.complete();
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
