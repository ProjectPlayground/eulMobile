import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import {TemperatureChartPage} from "../temperature-chart/temperature-chart";


@Component({
  selector: 'charts-for-hives-details',
  templateUrl: 'charts-for-hive.html'
})
export class HiveChartPage {
  selectedHiveID: number;

  charts = [
    {
      name : 'Temperature',
      component : TemperatureChartPage
    },
    {
      name : 'Humidity'
    },
    {
      name : 'Insolation'
    },
    {
      name : 'Rainfall'
    }
  ];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedHiveID = navParams.get('item');
  }

  chartSelected(item) {
    this.navCtrl.push(item.component, {
      item : this.selectedHiveID
    });
  }


}
