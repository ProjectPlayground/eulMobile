import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { temperature} from "../../providers/dto/temperature";
import {MeasurementService} from "../../providers/measurement-service";
import {Utils} from "../../utils/Utils";
import {Platform} from 'ionic-angular';

/*
  Generated class for the TemperatureChart page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-temperature-chart',
  templateUrl: 'temperature-chart.html'
})
export class TemperatureChartPage {

  currDate = new Date();

  public start = {
    date: null
  };

  private temperatureMeasurements : temperature[] = [];
  private lastTemperature;
  public green:string =  '#4dbd74';
  public blue:string =   '#63c2de';
  public mainChartDataIndoor:Array<number> = [];
  public mainChartDataOutdoor:Array<number> = [];
  public mainChartData:Array<any> = [
    {
      data: this.mainChartDataIndoor,
      label: 'Indoor'
    },
    {
      data: this.mainChartDataOutdoor,
      label: 'Outdoor'
    }
  ];
  public mainChartLabels:Array<any> = [];
  public mainChartOptions:any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          drawOnChartArea: true,
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
          minRotation: 0,
          maxRotation: 90,
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 5,
          stepSize: Math.ceil(100 / 10),
        }
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: true
    }
  };
  public mainChartColours:Array<any> = [
    { //brandInfo
      backgroundColor: Utils.convertHex(this.green,10),
      borderColor: this.green,
      pointHoverBackgroundColor: '#fff'
    },
    { //brandSuccess
      backgroundColor: 'transparent',
      borderColor: this.blue,
      pointHoverBackgroundColor: '#fff'
    }
  ];
  public mainChartLegend:boolean = true;
  public mainChartType:string = 'line';

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private measurements : MeasurementService) {

    this.currDate.setMonth(this.currDate.getMonth() - 1);
    this.start.date = this.currDate.toISOString();
  }

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
  public chartHovered(e:any):void {
    console.log(e);
  }

  public getTemperature(hiveId : number, _startDate : Date) {
    let startTimestamp = _startDate.valueOf();
    let endTimestamp = Date.now();

    console.log('Getting temperature from: ' + startTimestamp + ' to:' + endTimestamp);
    this.measurements.showLoading();
    this.measurements.getTemperatureMeasurements(hiveId, startTimestamp, endTimestamp)
      .subscribe(
        data => this.temperatureMeasurements = data,
        error => console.error(error),
        () => {
          this.measurements.dismissLoading();
          this.updateChart();
          console.log('Getting humidity done!');
        }
      );
  }
  private updateChart() {
    let _mainChartDataTemp:Array<any>;
    let _dataIndoor:Array<number> = new Array<number>(this.temperatureMeasurements.length);
    let _dataOutdoor:Array<number> = new Array<number>(this.temperatureMeasurements.length);
    let _chartLabels:Array<any> = new Array<any>(this.temperatureMeasurements.length);

    // copy values from service data
    for (var i = 0; i < this.temperatureMeasurements.length; i++) {
      _dataIndoor[i] = this.temperatureMeasurements[i].valueIndoor;
      _dataOutdoor[i] = this.temperatureMeasurements[i].valueOutdoor;
      _chartLabels[i] = new Date(this.temperatureMeasurements[i].measuredTimestamp).toLocaleString('pl-PL', {year:'2-digit', day:'2-digit', month:'2-digit', hour: '2-digit', minute:'2-digit'});
    }

    _mainChartDataTemp = [
      {
        data: _dataIndoor,
        label: 'Indoor'
      },
      {
        data: _dataOutdoor,
        label: 'Outdoor'
      }
    ];

    // Update objects
    this.mainChartLabels = _chartLabels;
    this.mainChartData = _mainChartDataTemp;
    this.lastTemperature = _dataOutdoor[this.temperatureMeasurements.length - 1];
  }
  ionViewDidLoad() {
    let startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    this.getTemperature(this.navParams.get('item'), this.currDate);
  }
  onChange() {
    var date = new Date(Date.parse(this.start.date));
    console.log(date);
    this.getTemperature(this.navParams.get('item'), date);
  }

}
