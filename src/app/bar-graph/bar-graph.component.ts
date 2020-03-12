import { Component, OnInit, OnChanges, Input, SimpleChanges   } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);
HC_exporting(Highcharts);

@Component({
  selector: 'app-bar-graph',
  templateUrl: './bar-graph.component.html',
  styleUrls: ['./bar-graph.component.scss']
})
export class BarGraphComponent implements OnInit, OnChanges {
	@Input() title:string;
	@Input() data:number[];
	@Input() labels:string[];
	public options: any = {
    chart: {
        type: 'column'
    },
    title: {
        text: null
    },
    subtitle: {
        text: null
    },
    xAxis: {
        categories: [],
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text:null
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: []
}
  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
  		console.log("changes:",changes)
		let options=this.options;
    	options.series=changes.data?changes.data.currentValue:this.options.series;
		options.xAxis.categories=changes.labels?changes.labels.currentValue:this.options.xAxis.categories;
		options.yAxis.title.text=changes.title?changes.title.currentValue:this.options.title.text;
		options.title.text=changes.title?changes.title.currentValue:this.options.title.text;
		options.subtitle.text=changes.title?changes.title.currentValue:this.options.subtitle.text;
		setTimeout(function(){ Highcharts.chart('bar-chart', options); }, 20000);
		// if(this.options.xAxis.categories.length>0){
		// 	Highcharts.chart('bar-chart', this.options);
		// }
	}

}
