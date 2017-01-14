import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {rainfall} from "../../providers/dto/rainfall";
import {MeasurementService} from "../../providers/measurement-service";

/*
  Generated class for the RainfallChart page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-rainfall-chart',
  templateUrl: 'rainfall-chart.html'
})
export class RainfallChartPage {
  currDate = new Date();

  public start = {
    date: null
  };

  private rainfallMeasurements : rainfall[] = [];
  private lastRainfall;
  public mainChartColor:string =  '#1a53ff';
  public mainChartDataIndoor:Array<number> = [];
  public mainChartDataOutdoor:Array<number> = [];
  public mainChartData:Array<any> = [
    {
      data: this.mainChartDataOutdoor,
      label: 'Rainfall'
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

  public getRainfall(hiveId : number, _startDate : Date) {
    let startTimestamp =  _startDate.valueOf();
    let endTimestamp = Date.now();

    console.log('Getting temperature from: ' + startTimestamp + ' to:' + endTimestamp);
    this.measurements.showLoading();
    this.measurements.getRainfallMeasurements(hiveId, startTimestamp, endTimestamp)
      .subscribe(
        data => this.rainfallMeasurements = data,
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
    let _data:Array<number> = new Array<number>(this.rainfallMeasurements.length);
    let _chartLabels:Array<any> = new Array<any>(this.rainfallMeasurements.length);

    // copy values from service data
    for (var i = 0; i < this.rainfallMeasurements.length; i++) {
      _data[i] = this.rainfallMeasurements[i].rainfallValue;
      _chartLabels[i] = new Date(this.rainfallMeasurements[i].measuredTimestamp).toLocaleString('pl-PL', {year:'numeric', day:'2-digit', month:'2-digit', hour: '2-digit', minute:'2-digit'});
    }

    _mainChartDataTemp = [
      {
        data: _data,
        label: 'Rainfall'
      }
    ];

    // Update objects
    this.mainChartLabels = _chartLabels;
    this.mainChartData = _mainChartDataTemp;
    this.lastRainfall = _data[this.rainfallMeasurements.length - 1];
  }

  ionViewDidLoad() {
    this.getRainfall(this.navParams.get('item'), this.currDate);
  }

  onChange() {
    var date = new Date(Date.parse(this.start.date));
    this.getRainfall(this.navParams.get('item'), date);
  }
}
