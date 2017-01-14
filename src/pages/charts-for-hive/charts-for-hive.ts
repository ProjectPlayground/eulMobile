import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import {TemperatureChartPage} from "../temperature-chart/temperature-chart";
import {HumidityChartPage} from "../humidity-chart/humidity-chart";
import {InsolationChartPage} from "../insolation-chart/insolation-chart";
import {RainfallChartPage} from "../rainfall-chart/rainfall-chart";


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
      name : 'Humidity',
      component : HumidityChartPage
    },
    {
      name : 'Insolation',
      component : InsolationChartPage
    },
    {
      name : 'Rainfall',
      component : RainfallChartPage
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
