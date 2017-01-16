import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {MeasurementService} from "../../providers/measurement-service";
import {weight} from "../../providers/dto/weight";
import {Utils} from "../../utils/Utils";

/*
  Generated class for the WeightChart page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-weight-chart',
  templateUrl: 'weight-chart.html'
})
export class WeightChartPage {

  currDate = new Date();

  public start = {
    date: null
  };

  private weightMeasurements: weight[] = [];
  private lastWeight;
  public mainChartColor: string = '#3f0c49';
  public mainChartWeight: Array<number> = [];
  public mainChartData: Array<any> = [
    {
      data: this.mainChartWeight,
      label: 'Weight'
    }
  ];
  public mainChartLabels: Array<any> = [];
  public mainChartOptions: any = {
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
  public mainChartColours: Array<any> = [
    {
      backgroundColor: Utils.convertHex(this.mainChartColor, 10),
      borderColor: this.mainChartColor,
      pointHoverBackgroundColor: '#fff'
    }
  ];
  public mainChartLegend: boolean = true;
  public mainChartType: string = 'line';

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private measurements: MeasurementService) {

    this.currDate.setMonth(this.currDate.getMonth() - 1);
    this.start.date = this.currDate.toISOString();

    this.getWeight(this.navParams.get('item'), this.currDate);
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }
  public chartHovered(e: any): void {
    console.log(e);
  }

  private getWeight(hiveId: number, _startDate: Date) {
    let startTimestamp = _startDate.valueOf();
    let endTimestamp = Date.now();
    this.measurements.showLoading();
    this.measurements.getWeightMeasurements(hiveId, startTimestamp, endTimestamp)
      .subscribe(
        data => this.weightMeasurements = data,
        error => console.error(error),
        () => {
          this.measurements.dismissLoading();
          this.updateChart();
          console.log('Getting weight done!');
        }
      );
  }
  private updateChart() {
    let mainChartDataTemp: Array<any>;
    let data: Array<number> = new Array<number>(this.weightMeasurements.length);
    let chartLabels: Array<any> = new Array<any>(this.weightMeasurements.length);

    // copy values from service data
    for (var i = 0; i < this.weightMeasurements.length; i++) {
      data[i] = this.weightMeasurements[i].weight;
      chartLabels[i] = new Date(this.weightMeasurements[i].measuredTimestamp).toLocaleString('pl-PL', {
        year: 'numeric',
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    mainChartDataTemp = [
      {
        data: data,
        label: 'Weight'
      }
    ];

    // Update objects
    this.mainChartLabels = chartLabels;
    this.mainChartData = mainChartDataTemp;
    this.lastWeight = data[this.weightMeasurements.length - 1];
  }

  onChange() {
    var date = new Date(Date.parse(this.start.date));
    this.getWeight(this.navParams.get('item'), date);
  }
  doRefresh(refresher) {
    var date = new Date(Date.parse(this.start.date));
    this.getWeight(this.navParams.get('item'), date);
    refresher.complete();
  }
}