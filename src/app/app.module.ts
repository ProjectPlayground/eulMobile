import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { HiveChartPage } from '../pages/charts-for-hive/charts-for-hive';
import { ListPage } from '../pages/list/list';
import {LoginPage} from "../pages/login/login";
import {AuthService} from "../providers/auth-service";
import {HiveService} from "../providers/hive-service";
import {UserService} from "../providers/user-service";
import {ManagerPage, ModalContentPage} from "../pages/manager/manager";
import {ChartsModule} from "ng2-charts";
import {TemperatureChartPage} from "../pages/temperature-chart/temperature-chart";
import {MeasurementService} from "../providers/measurement-service";
import {HumidityChartPage} from "../pages/humidity-chart/humidity-chart";
import {InsolationChartPage} from "../pages/insolation-chart/insolation-chart";
import {RainfallChartPage} from "../pages/rainfall-chart/rainfall-chart";
import {HarvestPage} from "../pages/harvest/harvest";
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import {WeightChartPage} from "../pages/weight-chart/weight-chart";
import {AccessPointService} from "../providers/access-point-service";


const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'c4f412ee'
  },
  'push': {
    'sender_id': '1013021222331',
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'iconColor': '#343434'
      }
    }
  }
};

@NgModule({
  declarations: [
    MyApp,
    DashboardPage,
    HiveChartPage,
    ManagerPage,
    ModalContentPage,
    LoginPage,
    ListPage,
    TemperatureChartPage,
    HumidityChartPage,
    InsolationChartPage,
    RainfallChartPage,
    WeightChartPage,
    HarvestPage,
  ],
  imports: [
    ChartsModule,
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    DashboardPage,
    HiveChartPage,
    ManagerPage,
    ModalContentPage,
    LoginPage,
    ListPage,
    TemperatureChartPage,
    HumidityChartPage,
    InsolationChartPage,
    RainfallChartPage,
    WeightChartPage,
    HarvestPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},
              AuthService,
              HiveService,
              UserService,
              AccessPointService,
              MeasurementService
  ]
})
export class AppModule {}
