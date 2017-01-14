import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { HiveChartPage} from '../charts-for-hive/charts-for-hive';
import {Hive, HiveService} from "../../providers/hive-service";


@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  hives: Hive[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private hiveService : HiveService) {
    this.updateHiveList();
  }

  itemTapped(event, hiveID) {
    this.navCtrl.push(HiveChartPage, {
      item: hiveID
    });
  }

  private updateHiveList() {
    this.hiveService.getHives()
      .subscribe(
        data => { console.log(data); this.hives = data},
        error => console.error(error),
        () => console.log('Getting hives info done! ' + this.hives[0])
      );
  }
}
