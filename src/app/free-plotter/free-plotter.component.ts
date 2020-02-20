import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal,ModalDismissReasons , NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';

import { WiseconnService } from 'app/services/wiseconn.service';

//graficas
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

import * as moment from "moment";

@Component({
	selector: 'app-free-plotter',
	templateUrl: './free-plotter.component.html',
	styleUrls: ['./free-plotter.component.scss']
})
export class FreePlotterComponent implements OnInit {
	loading:boolean=false;
	farms:any[]=[];
	weatherZones:any[]=[];
	farmSelected:any=null;
	zoneSelected:any=null;
	//rango de fechas para graficas
	fromDate: NgbDate;
	toDate: NgbDate;
	dateRange: any = null;
	dateRangeHistory:any[]=[]
	selectedValue: any = '1S';
	hoveredDate: NgbDate;
	requestChartBtn: boolean =true;
	//graficas
	//line chart
	@ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
	lineChartData: ChartDataSets[] = [
	{ data: [], label: 'Temperatura' },
	{ data: [], label: 'Humedad', yAxisID: 'y-axis-1' },
	];
	lineChartLabels: Label[] = [];
	lineChartOptions: (ChartOptions & { annotation: any }) = {
		responsive: false,
		scales: {
			// We use this empty structure as a placeholder for dynamic theming.
			xAxes: [{}],
			yAxes: [
			{
				id: 'y-axis-0',
				position: 'left',
			},
			{
				id: 'y-axis-1',
				position: 'right',
				gridLines: {
					color: 'rgba(255,0,0,0.3)',
				},
				ticks: {
					fontColor: 'red',
				}
			}
			]
		},
		annotation: {
			annotations: [{}],
		},
		elements: {
			point: {
				radius: 0
			}
		}
	};
	lineChartColors: Color[] = [
	{ // red
		backgroundColor:'rgba(255, 255, 255, 0.1)',
		borderColor:'rgba(255, 0, 0,1)',
		pointBackgroundColor:'rgba(255, 0, 0,1)',
		pointBorderColor:'#fff',
		pointHoverBackgroundColor:'#fff',
		pointHoverBorderColor: 'rgba(255, 0, 0,0.8)'
	},
	{ // blue
		backgroundColor:'rgba(255, 255, 255, 0.1)',
		borderColor:'rgba(2,87,154,1)',
		pointBackgroundColor:'rgba(2, 87, 154,1)',
		pointBorderColor:'#fff',
		pointHoverBackgroundColor:'#fff',
		pointHoverBorderColor:'rgba(2,87,154,0.8)'
	}
	];
	lineChartLegend = true;
	lineChartType = 'line';
	lineChartPlugins = [pluginAnnotations];
	temperatureId: number = null;
	humidityId: number = null;
	renderLineChartFlag: boolean = false;

	//bar chart
	barChartOptions: ChartOptions = {
		responsive: false,
		// We use these empty structures as placeholders for dynamic theming.
		scales: { xAxes: [{}], yAxes: [{}] },
		plugins: {
			datalabels: {
				anchor: 'end',
				align: 'end',
			}
		}
	};
	barChartLabels: Label[] = [];
	barChartType: ChartType = 'bar';
	barChartLegend = true;
	barChartPlugins = [];

	barChartData: ChartDataSets[] = [
	{ data: [], label: 'Rainfall (mm)' },
	{ data: [], label: 'Et0 (mm)' }
	];
	rainId: number = null;
	et0Id: number = null;
	renderBarChartFlag: boolean = false;

	times =[
	{ value: '1D' , active: false},
	{ value: '1S' , active: true},
	{ value: '2S' , active: false},
	{ value: '1M' , active: false},
	{ value: '3M' , active: false},
	{ value: '6M' , active: false},
	]
	constructor(
		public wiseconnService: WiseconnService,
		public router: Router,
		public calendar: NgbCalendar, 
		public formatter: NgbDateParserFormatter) { }

	ngOnInit() {//rango de fechas para graficas
		this.dateRangeByDefault();
		this.getFarms();
	}
	getFarms() {
		this.loading=true;
		this.wiseconnService.getFarms().subscribe((data: any) => {			
			this.loading=false;
			this.farms = data;
			switch (localStorage.getItem("username").toLowerCase()) {
				case "agrifut":
				this.farms = this.farms.filter((element) => {
					return element.id == 185 || element.id == 2110 || element.id == 1378 || element.id == 520
				})
				break;
				case "santajuana":
				this.farms = this.farms.filter((element) => {
					return element.id == 719
				})
				break;

				default:
				// code...
				break;
			}
		})
	}
	getZones(id:number=0) {
		this.loading = true;
		this.wiseconnService.getZones(id).subscribe((data: any) => {
			this.weatherZones = data.filter((element)=>{
				if(element.type.find((element) => {
					return element === 'Weather';
				}) != undefined){
					return element
				}
			});
			this.loading = false;
		});
	}
	renderCharts(chart:string) {
		switch (chart) {
			case "line":
				this.renderLineChartFlag=true;
				break;
			case "bar":
				this.renderBarChartFlag=true;
				break;
			default:
				// code...
				break;
		}
	}
	onSelect(select: string, id: number) {
		switch (select) {
			case "farm":
			this.farmSelected=this.farms.filter((element)=>{
				return element.id == id
			})[0];
			this.getZones(id);
			break;
			case "zone":
			this.zoneSelected = this.weatherZones.filter((element)=>{
				return element.id == id
			})[0];
			break;
			default:
			// code...
			break;
		}
	}
	//datepicker
	onDateSelection(date: NgbDate,element:string) {
		switch (element) {
			case "from":
			this.fromDate = date;
			break;
			case "to":
			this.toDate = date;
			break;
			default:
			// code...
			break;
		}
		this.requestChartBtn=(this.fromDate && this.toDate && this.toDate.after(this.fromDate))?false:true;
	}
	selectTime(event){
		this.selectedValue = event.value;
		this.dateRangeByDefault();
	} 
	dateRangeByDefault(){
		this.times.map((element)=>{
			element.active=(element.value===this.selectedValue)?true:false;
			return element;
		});
		switch (this.selectedValue) {
			case "1D":
			this.fromDate = this.calendar.getNext(this.calendar.getToday(), 'd', -1);
			break;
			case "1S":
			this.fromDate = this.calendar.getNext(this.calendar.getToday(), 'd', -7);
			break;
			case "2S":
			this.fromDate = this.calendar.getNext(this.calendar.getToday(), 'd', -14);
			break;
			case "1M":
			this.fromDate = this.calendar.getNext(this.calendar.getToday(), 'd', -30);
			break;
			case "3M":
			this.fromDate = this.calendar.getNext(this.calendar.getToday(), 'd', -90);
			break;
			case "6M":
			this.fromDate = this.calendar.getNext(this.calendar.getToday(), 'd', -180);
			break;
			default:
			// code...
			break;
		}
		this.toDate = this.calendar.getToday();
		this.requestChartBtn=(this.fromDate && this.toDate && this.toDate.after(this.fromDate))?false:true;
	}
	goBack(){
		let lastElement=this.dateRangeHistory.pop();
		this.fromDate=lastElement.fromDate;
		this.toDate=lastElement.toDate;
		this.selectedValue=lastElement.selectedValue;
		this.times.map((element)=>{
			element.active=(element.value===this.selectedValue)?true:false;
			return element;
		});
		this.requestDataChart(true);
	}
    format(value:string,chart:string){
      switch (chart) {
        case "line":
          return moment(value).format('DD/MM/YYYY hh:mm:ss');
          break;
        case "bar":
          return moment(value).format('DD') +" "+ moment(value).format('MMM');
          break;
        default:
          return value;
          break;
      }
      
    }
	requestDataChart(goBackFlag:boolean=false){		
		//bar chart
		this.rainId=null;
		this.et0Id=null;
		//line chart
		this.temperatureId=null;
		this.humidityId=null;
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
		if(this.zoneSelected){
			this.loading = true;
			this.wiseconnService.getMeasuresOfZones(this.zoneSelected.id).subscribe((data) => {
				for (var i = data.length - 1; i >= 0; i--) {
					//bar chart
					if (data[i].sensorType === "Rain") {
						this.rainId = data[i].id;
					}
					if (data[i].name.toLowerCase() === "et0") {
						this.et0Id = data[i].id;
					}
					if(this.rainId&&this.et0Id){
						this.wiseconnService.getDataByMeasure(this.rainId,this.dateRange).subscribe((data) => {
							let rainData=data;
							this.wiseconnService.getDataByMeasure(this.et0Id,this.dateRange).subscribe((data) => {
								let et0Data=data;
								this.loading = false;
								rainData=rainData.map((element)=>{
									element.chart="rain";
									return element
								})
								et0Data=et0Data.map((element)=>{
									element.chart="et0";
									return element;
								})
								let chartData=rainData.concat(et0Data);
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
								this.resetChartsValues("bar");
								for (var i = 0; i < chartData.length; i++) {
									if(chartData[i+1]){
										if(chartData[i].time===chartData[i+1].time&&chartData[i].chart=="et0"&&chartData[i+1].chart=="rain"){
											this.barChartLabels.push(this.format(chartData[i].time,"bar"));										
										}	
									}									
									if(chartData[i].chart=="rain") {
										this.barChartData[0].data.push(chartData[i].value);
									}
									if(chartData[i].chart=="et0") {
										this.barChartData[1].data.push(chartData[i].value);
									}									
									this.renderCharts("bar");
								}
							});
						});
					}
					//line chart
					if (data[i].sensorType === "Temperature") {
						this.temperatureId = data[i].id;
					}
					if (data[i].sensorType === "Humidity") {
						this.humidityId = data[i].id;
					}
					if(this.temperatureId&&this.humidityId){
						this.wiseconnService.getDataByMeasure(this.temperatureId,this.dateRange).subscribe((data) => {
							let temperatureData=data;
							this.wiseconnService.getDataByMeasure(this.humidityId,this.dateRange).subscribe((data) => {
								let humidityData=data;
								this.loading = false;
								temperatureData=temperatureData.map((element)=>{
									element.chart="temperature";
									return element
								})
								humidityData=humidityData.map((element)=>{
									element.chart="humidity";
									return element
								})
								let chartData=temperatureData.concat(humidityData);
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
									if(moment(element.time).minutes()==0 || moment(element.time).minutes()==30)
										return element;
								});
								this.resetChartsValues("line");
								for (var i = 1; i < chartData.length; i+=2) {
									if(this.lineChartLabels.find((element) => {
										return element === chartData[i].time;//.format("YYYY-MM-DD hh:mm:ss");
									}) === undefined) {
										this.lineChartLabels.push(this.format(chartData[i].time,null));
									}
									if (chartData[i].chart==="temperature") {
										this.lineChartData[0].data.push(chartData[i].value);
									} 
									if(chartData[i-1].chart==="humidity"){
										this.lineChartData[1].data.push(chartData[i-1].value);
									}
									this.renderCharts("line");
								}
							});
						});
					}else if(i==0){
						Swal.fire({
							icon: 'error',
							title: 'Oops...',
							text: 'No tiene configurado los sensores de humedad y temperatura'
						})
					}
				}
			});
		}else{
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Debe seleccionar una zona'
			})
		}

	}
	resetChartsValues(chart:string){
		switch (chart) {
			case "line":
				this.lineChartLabels=[];
				this.lineChartData[0].data=[];
				this.lineChartData[1].data=[];
				break;	
			case "bar":
				this.barChartLabels=[];
				this.barChartData[0].data=[];
				this.barChartData[1].data=[];
				break;
			default:
				// code...
				break;
		}
	} 
	isHovered(date: NgbDate) {
		return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
	}
	isInside(date: NgbDate) {
		return date.after(this.fromDate) && date.before(this.toDate);
	}
	isRange(date: NgbDate) {
		return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
	}
	validateInput(currentValue: NgbDate, input: string): NgbDate {
		const parsed = this.formatter.parse(input);
		return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
	}
	// bar chart
	chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
		console.log(event, active);
	}
	chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
		console.log(event, active);
	}
}
