import { Component, OnInit, OnChanges, Input, SimpleChanges  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  selector: 'app-output-graph',
  templateUrl: './output-graph.component.html',
  styleUrls: ['./output-graph.component.scss']
})
export class OutputGraphComponent implements OnInit, OnChanges {
	@Input() title:string;
	@Input() data:number[];
	@Input() labels:string[];
  	public options: any = {
	    chart: {
	        type: 'spline',

	    },
	    colors: ['#D12B34','#00B9EE'],
	    title: {
	        text: null
	    },
	    subtitle: {
	        text: null
	    },
	    xAxis: {
	        categories: [],
	        startOnTick: true,
    		endOnTick: true,
	    },
	   	yAxis: [{ // left y axis
	        title: {
	            text: null
	        },
	        // tickInterval: 5,
	        labels: {
	            format: '{value:.,0f}'
	        },
	        showFirstLabel: false
	    }, { // right y axis
	    	opposite: true,
	    	tickInterval: 5,
	        labels: {
	            format: '{value:.,0f}'
	        },
	        showFirstLabel: false
	    }],
	    plotOptions: {
	        line: {
	            dataLabels: {
	                enabled: true
	            },
	            enableMouseTracking: true,
	        }
	    },
	    series: [],
	    tooltip: {
	        shared: true,
	        crosshairs: true
	    },
	}
  	constructor(private http: HttpClient) { }


	ngOnInit() {
	}
	ngOnChanges(changes: SimpleChanges) {
		console.log("changes:",changes)
		let options=this.options;
		options.series=changes.data?changes.data.currentValue:options.series;
		options.xAxis.categories=changes.labels?changes.labels.currentValue:options.xAxis.categories;
		options.title.text=changes.title?changes.title.currentValue:options.title.text;
		options.subtitle.text=changes.title?changes.title.currentValue:options.subtitle.text;
		setTimeout(function(){ Highcharts.chart('chart-container', options); }, 20000);
	}
}
