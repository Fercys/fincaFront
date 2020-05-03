import { Component, OnInit, OnChanges, SimpleChanges, SimpleChange, ViewChild, ElementRef, Input } from '@angular/core';
import { NgbModal, NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import * as moment from "moment";

//services
import { WiseconnService } from 'app/services/wiseconn.service';
//graficas
// tslint:disable-next-line:no-var-requires
const Highcharts = require('highcharts/highstock');
// tslint:disable-next-line:no-var-requires
require('highcharts/highmaps');
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);
require('highcharts/highcharts-more')(Highcharts);

@Component({
	selector: 'app-chart',
	templateUrl: './chart.component.html',
	styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit,OnChanges {
	@Input() weatherStation:any;
	@Input() title:string;
	@Input() type:string;
	@Input() firstSensorType:string='';
	@Input() secondSensorType:string='';
	public firstId: number = null;
	public secondId: number = null;
	public loading:boolean=false;
	//graficas
	//rango de fechas para graficas
	@Input() fromDate:any;
	@Input() toDate:any;
	public dateRange: any = null;
	public dateRangeHistory:any[]=[];
	public selectedValue: any = '1S';
	public requestChartBtn: boolean =true;
	//chart
	@ViewChild('chart', { static: true }) public chartElement: ElementRef;
	private chart;
	public chartData:any[]=[[],[]];
	public chartLabels:any={
		values:[],
		labels:[]
	};
	public chartOptions:any = {
		chart: {
			type: null,
		},
		colors: ['#D12B34','#00B9EE'],
		title: {
			text: ''
		},
		subtitle: {
			text: null
		},
		xAxis: [{
			categories: [],
			startOnTick: true,
			endOnTick: true,
		}],
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
			title: {
				text: null
			},
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
					enabled: false
				},
				enableMouseTracking: true,
			}
		},
		series: [],
		tooltip: {
			shared: true,
			crosshairs: true
		},
	};
	public renderchartFlag: boolean = false;
	constructor(
		private calendar: NgbCalendar,
		private wiseconnService: WiseconnService, 
		) { }

	ngOnInit(){      
		this.chartOptions.title.text=this.title;
		this.chartOptions.chart.type=this.type;
		switch (this.title) {
			case "TEMPERATURA/HUMEDAD":
				this.chartOptions.series=[{ 
					data: [], 
					name: 'Temperatura',
					type: 'line',
					//yAxis: 0 
				},{ 
					data: [], 
					name: 'Humedad',
					type: 'line', 
					yAxis: 1 
				}]
				break;
			case "PRECIPITACIÓN/ET0":
				this.chartOptions.series=[{
					type: undefined,
					name: 'Precipitación (mm)', 
					data: [] 
				},{
					type: undefined,
					name: 'Et0 (mm)', 
					data: [] 
				}]
				break;
			case "PORCIONES FRIOS/PORCIONES FRIOS":
				this.chartOptions.series=[{
					type: undefined,
					name: 'PORCIONES FRIOS', 
					data: [] 
				},{
					type: undefined,
					name: 'PORCIONES FRIOS', 
					data: [] 
				}]
				break;
			case "RADIACIÓN/VIENTO":
				this.chartOptions.series=[{
					type: undefined,
					name: 'RADIACIÓN', 
					data: [] 
				},{
					type: undefined,
					name: 'VIENTO', 
					data: [] 
				}]
				break;
			default:
			// code...
			break;
		}
		this.highchartsShow();
	}
	ngOnChanges(changes: SimpleChanges) {
		if(changes.weatherStation!=undefined){
			const weatherStationCurrentValue: SimpleChange = changes.weatherStation.currentValue;
			this.weatherStation=weatherStationCurrentValue;
		}
		if(changes.fromDate!=undefined&&changes.toDate!=undefined){
			const fromDateCurrentValue: SimpleChange = changes.fromDate.currentValue;
			const toDateCurrentValue: SimpleChange = changes.toDate.currentValue;
			this.fromDate = fromDateCurrentValue;
			this.toDate = toDateCurrentValue;
		}
		if(this.weatherStation&&this.fromDate&&this.toDate){
			this.getChartInformation(false);			
		}
	}
	highchartsShow(){
		this.chartOptions.chart['renderTo'] = this.chartElement.nativeElement;
		this.chart = Highcharts.chart(this.chartOptions);
	}
	renderCharts() {
		this.chart.series[0].setData(this.chartData[0]);
		this.chart.series[1].setData(this.chartData[1]);
		this.chart.xAxis[0].setCategories(this.chartLabels.labels, true);
		this.renderchartFlag=true;
	}
	resetChartsValues(){
		this.firstId=null;
		this.secondId=null;
		if(this.chart!=undefined){
			this.chart.series[0].setData([]);
			this.chart.series[1].setData([]);
			this.chart.xAxis[0].setCategories([]);        
		}
		this.chartLabels.values=[];
		this.chartLabels.labels=[];
		for (var i = 0; i < 2; i++) {
			this.chartData[i]=[];
		}
	}
	momentFormat(value:string,chart:string){
		switch (chart) {
			case "label":
			return moment.utc(value).format('DD') +" "+ moment.utc(value).format('MMM');
			break;
			case "value":
			return moment.utc(value).format("YYYY-MM-DD HH:mm:ss");
			break;
			default:
			return value;
			break;
		}      
	}
	getChartInformation(goBackFlag:boolean=false){
		this.resetChartsValues();
		if(this.fromDate!=undefined&&this.toDate!=undefined){
			this.dateRange = {
				initTime: moment(this.fromDate.year + "-" + this.fromDate.month + "-" + this.fromDate.day).format("YYYY-MM-DD"),
				endTime: moment(this.toDate.year + "-" + this.toDate.month + "-" + this.toDate.day).format("YYYY-MM-DD")
			};
			if(!goBackFlag){          
				this.dateRangeHistory.push({
					fromDate:this.fromDate,
					toDate:this.toDate,
					selectedValue:this.selectedValue
				});
			}
			this.loading=true;
			this.wiseconnService.getMeasuresOfZones(this.weatherStation.id).subscribe((response) => {
				this.loading=false;
				let data=response.data?response.data:response;
				if(data.length>0){
					let chartFlag=false;
					let j=0;
					let htmlErrors=null;
					while (!chartFlag && j < data.length) {
						if (data[j].sensorType === this.firstSensorType||data[j].name==this.firstSensorType) {
							this.firstId = data[j].id;
						}
						if (data[j].sensorType === this.secondSensorType||data[j].name==this.secondSensorType) {
							this.secondId = data[j].id;
						}
						if(this.firstId&&this.secondId){
							chartFlag=true;
							this.loading = true;
							this.wiseconnService.getDataByMeasure(this.firstId,this.dateRange).subscribe((response) => {
								let firstChartData=response.data?response.data:response;
								this.wiseconnService.getDataByMeasure(this.secondId,this.dateRange).subscribe((response) => {
									this.loading = false;
									let secondChartData=response.data?response.data:response;
									// this.loading = false;
									firstChartData=firstChartData.map((element)=>{
										element.chart=this.firstSensorType.toLowerCase();
										return element
									})
									secondChartData=secondChartData.map((element)=>{
										element.chart=this.secondSensorType.toLowerCase();
										return element
									})
									let chartData=firstChartData.concat(secondChartData);
									chartData.sort(function (a, b) {
										if (moment(a.time).isAfter(b.time)) {
											return 1;
										}
										if (!moment(a.time).isAfter(b.time)) {
											return -1;
										}
										// a must be equal to b
										return 0;
									});
									chartData = chartData.filter((element) => {
										let hour=moment(element.time).hours();
										let minutes=moment(element.time).minutes();
										if(hour==4 || hour==8 || hour==12 || hour==16 || hour==20 || hour==0 && minutes==0)
											return element;
									});
									for (var i = 0; i < chartData.length ; i++) {
										if(this.chartLabels.values.find((element) => {return this.momentFormat(element,"value") === this.momentFormat(chartData[i].time,"value");}) === undefined) {
											this.chartLabels.values.push(this.momentFormat(chartData[i].time,"value"));
											this.chartLabels.labels.push(this.momentFormat(chartData[i].time,"label"));
										}
										if((chartData[i].chart===this.firstSensorType.toLowerCase())&&this.chartLabels.values[this.chartLabels.values.length-1]==this.momentFormat(chartData[i].time,"value"))
											this.chartData[0].push(chartData[i].value);
										if((chartData[i].chart===this.secondSensorType.toLowerCase())&&this.chartLabels.values[this.chartLabels.values.length-1]==this.momentFormat(chartData[i].time,"value"))
											this.chartData[1].push(chartData[i].value);
									}
									if(this.chartData[0].length>this.chartData[1].length){
										this.chartData[0]= this.chartData[0].slice(0, this.chartData[1].length);
									}else{
										this.chartData[1]= this.chartData[1].slice(0, this.chartData[0].length);
									}
									this.renderCharts();
								},
								error=>{
									this.loading = false;
									console.log("error:",error)
								});
							},
							error=>{
								this.loading = false;
								console.log("error:",error)
							});
						}
						j++;
					}
				}
			},
			error=>{
				this.loading=false;
				console.log("error:",error);
			});
		}
	}

}
