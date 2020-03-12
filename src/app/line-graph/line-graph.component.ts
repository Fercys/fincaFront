import { Component, OnInit, OnChanges, Input, SimpleChanges  } from '@angular/core';
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
  selector: 'app-line-graph',
  templateUrl: './line-graph.component.html',
  styleUrls: ['./line-graph.component.scss']
})
export class LineGraphComponent implements OnInit, OnChanges {
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
  	constructor() { }


	ngOnInit() {
	}
	ngOnChanges(changes: SimpleChanges) {
		let options=this.options;
		this.options.series=changes.data?changes.data.currentValue:this.options.series;
		this.options.xAxis.categories=changes.labels?changes.labels.currentValue:this.options.xAxis.categories;
		this.options.title.text=changes.title?changes.title.currentValue:this.options.title.text;
		this.options.subtitle.text=changes.title?changes.title.currentValue:this.options.subtitle.text;
		if(this.options.xAxis.categories.length>0){
			Highcharts.chart('line-chart', this.options);
		}
	}
}
