import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {insolation} from "../../providers/dto/insolation";
import {MeasurementService} from "../../providers/measurement-service";
import {Utils} from "../../utils/Utils";

/*
  Generated class for the InsolationChart page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-insolation-chart',
  templateUrl: 'insolation-chart.html'
})
export class InsolationChartPage {

  currDate = new Date();

  public start = {
    date: null
  };

  private insolationMeasurements : insolation[] = [];
  private lastInsolation;
  public mainChartColor:string =  '#ffcc00';
  public mainChartDataIndoor:Array<number> = [];
  public mainChartDataOutdoor:Array<number> = [];
  public mainChartData:Array<any> = [
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
    {
      backgroundColor: this.mainChartColor,
      borderColor: this.mainChartColor,
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

  public getInsolation(hiveId : number, _startDate : Date) {
    let startTimestamp =  _startDate.valueOf();
    let endTimestamp = Date.now();

    console.log('Getting temperature from: ' + startTimestamp + ' to:' + endTimestamp);
    this.measurements.showLoading();
    this.measurements.getInsolationMeasurements(hiveId, startTimestamp, endTimestamp)
      .subscribe(
        data => this.insolationMeasurements = data,
        error => console.error(error),
        () =>   {
          this.measurements.dismissLoading();
          this.updateChart();
          console.log('Getting humidity done!');
        }
      );
  }

  private updateChart() {
    let _mainChartDataTemp:Array<any>;
    let _data:Array<number> = new Array<number>(this.insolationMeasurements.length);
    let _chartLabels:Array<any> = new Array<any>(this.insolationMeasurements.length);

    // copy values from service data
    for (var i = 0; i < this.insolationMeasurements.length; i++) {
      _data[i] = this.insolationMeasurements[i].insolationValue;
      _chartLabels[i] = new Date(this.insolationMeasurements[i].measuredTimestamp).toLocaleString('pl-PL', {year:'numeric', day:'2-digit', month:'2-digit', hour: '2-digit', minute:'2-digit'});
    }

    _mainChartDataTemp = [
      {
        data: _data,
        label: 'Insolation'
      }
    ];

    // Update objects
    this.mainChartLabels = _chartLabels;
    this.mainChartData = _mainChartDataTemp;
    this.lastInsolation = _data[this.insolationMeasurements.length - 1];
  }

  ionViewDidLoad() {
    let startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    this.getInsolation(this.navParams.get('item'), this.currDate);
  }

  onChange() {
    var date = new Date(Date.parse(this.start.date));
    console.log(date);
    this.getInsolation(this.navParams.get('item'), date);
  }
}
