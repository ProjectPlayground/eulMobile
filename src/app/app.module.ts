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
  ],
  imports: [
    ChartsModule,
    IonicModule.forRoot(MyApp),
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
    TemperatureChartPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},
              AuthService,
              HiveService,
              UserService,
              MeasurementService
  ]
})
export class AppModule {}
