import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal,ModalDismissReasons , NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';

import * as moment from "moment";

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
	selector: 'app-free-plotter',
	templateUrl: './free-plotter.component.html',
	styleUrls: ['./free-plotter.component.scss']
})
export class FreePlotterComponent implements OnInit {
	public loading:boolean=false;
	public farms:any[]=[];
	public weatherZones:any[]=[];
	public farmSelected:any=null;
	public zoneSelected:any=null;
	//rango de fechas para graficas
	public fromDate: NgbDate;
	public toDate: NgbDate;
	public dateRange: any = null;
	public dateRangeHistory:any[]=[]
	public selectedValue: any = '1S';
	public hoveredDate: NgbDate;
	public requestChartBtn: boolean =true;
	//graficas
	//linechart
	@ViewChild('lineChart', { static: true }) public lineChartElement: ElementRef;
	private lineChart;
	public lineChartData:any[]=[[],[]];
	public lineChartLabels:any[]=[];
	public lineChartOptions:any = {
	    chart: {
	        type: 'spline',

	    },
	    colors: ['#D12B34','#00B9EE'],
	    title: {
	        text: 'TEMPERATURA/HUMEDAD'
	    },
	    subtitle: {
	        text: 'TEMPERATURA/HUMEDAD'
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
	    series: [{ 
        	data: [], 
        	name: 'Temperatura',
	    	type: 'line',
	    	//yAxis: 0 
        },{ 
        	data: [], 
        	name: 'Humedad',
	    	type: 'line', 
        	yAxis: 1 
        }],
	    tooltip: {
	        shared: true,
	        crosshairs: true
	    },
	};
	public temperatureId: number = null;
	public humidityId: number = null;
	public renderLineChartFlag: boolean = false;
	//barchart
	@ViewChild('barChart', { static: true }) public barChartElement: ElementRef;
	private barChart;
	public barChartData:any[]=[[],[]];
	public barChartLabels:any[]=[];
	public barChartOptions:any = {
	    chart: {
	        type: 'column'
	    },
	    colors: ['#D12B34','#00B9EE'],
	    title: {
	        text: null
	    },
	    subtitle: {
	        text: null
	    },
	    xAxis: {
	        categories: [
	        ],
	        crosshair: true
	    },
	    yAxis: {
	        // min: 0,
	        title: {
	            text:null
	        }
	    },
	    tooltip: {
	        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
	        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
	            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
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
	    series: [
	        { type: undefined,name: 'Precipitación (mm)', data: [] }, 
	        { type: undefined,name: 'Et0 (mm)', data: [] },
	    ]
	};
	public rainId: number = null;
	public et0Id: number = null;
	public renderBarChartFlag: boolean = false;
	//times
	public times =[
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
  		this.highchartsShow();
	}
	
	getFarms() {
		this.loading=true;
		this.wiseconnService.getFarms().subscribe((response: any) => {			
			this.loading=false;
			this.farms = response.data?response.data:response;
			switch (localStorage.getItem("username").toLowerCase()) {
				case "agrifrut":
				this.farms = this.farms.filter((element) => {
					return element.id == 185 || element.id == 2110 || element.id == 1378 || element.id == 520
				})
				break;
				case "agrifrut@cdtec.cl":
				this.farms = this.farms.filter((element) => {
					return element.id == 185 || element.id == 2110 || element.id == 1378 || element.id == 520
				})
				break;
				case "santajuana":
				this.farms = this.farms.filter((element) => {
					return element.id == 719
				})
				break;
				case "santajuana@cdtec.cl":
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
		this.wiseconnService.getZones(id).subscribe((response: any) => {
			let data=response.data?response.data:response;
			this.weatherZones = data.filter((element)=>{
				if(element.type){
					if(element.type.length>0){
						if(element.type.find((element) => {
							return element === 'Weather' || (element.description!=undefined&&element.description === 'Weather');
						}) != undefined){
							return element
						}
					}
				}
			});
			this.loading = false;
		});
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
    momentFormat(value:string,chart:string){
      switch (chart) {
        case "line":
          	return moment.utc(value).format('DD') +" "+ moment.utc(value).format('MMM');
          	break;
        case "bar":
          	return moment.utc(value).format('DD') +" "+ moment.utc(value).format('MMM');
          	break;
        default:
          	return value;
          	break;
      }      
    }
	requestDataChart(goBackFlag:boolean=false){
        this.resetChartsValues("line");
        this.resetChartsValues("bar");
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
			this.wiseconnService.getMeasuresOfZones(this.zoneSelected.id).subscribe((response) => {
				let data=response.data?response.data:response;
				let barFlag=false;
                let lineFlag=false;
                let j=0;
                while (!lineFlag && j < data.length) {
                    //line chart
                    if (data[j].sensorType === "Temperature") {
                      this.temperatureId = data[j].id;
                    }
                    if (data[j].sensorType === "Humidity") {
                      this.humidityId = data[j].id;
                    }
                   	if(this.temperatureId&&this.humidityId){
                          lineFlag=true;
                          this.wiseconnService.getDataByMeasure(this.temperatureId,this.dateRange).subscribe((response) => {
                            let temperatureData=response.data?response.data:response;
                            this.wiseconnService.getDataByMeasure(this.humidityId,this.dateRange).subscribe((response) => {
                              let humidityData=response.data?response.data:response;
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
                                let hour=moment(element.time).hours();
                                if(hour==0 || hour==2 || hour==4 || hour==6 ||hour==8 || hour==10 || hour==12 || hour==16 || hour==18 || hour==20 || hour==22)
                                  return element;
                              });
                              for (var i = 0; i < chartData.length ; i++) {
                              	if(chartData[i+1]){
                              //     if(this.lineChartLabels.find((element) => {
                              //       return element === this.momentFormat(chartData[i].time,"line");
                              //     }) === undefined) {
                              		if((chartData[i].chart==="temperature")&&(chartData[i+1].chart==="humidity")){
                              		  this.lineChartLabels.push(this.momentFormat(chartData[i].time,"line"));
                              			this.lineChartData[0].push(chartData[i].value);
	                          		  this.lineChartData[1].push(chartData[i+1].value);
                              		}
                              //     }
                              	}
                              }
                              this.renderCharts("line");
                            });
                          });
                        }else if(j==data.length){
                          Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'No tiene configurado los sensores de humedad y temperatura'
                          })
                        }
                    j++;
                }
                j=0;
                while (!barFlag && j < data.length) {
                  //bar chart
                  if (data[j].sensorType != undefined && data[j].name != undefined){
                    if ((data[j].sensorType).toLowerCase() === "rain" && (data[j].name).toLowerCase() === "pluviometro") {
                      this.rainId = data[j].id;
                    }
                  }
                  if ((data[j].name) != undefined){
                    if ((data[j].name).toLowerCase() === "et0") {
                      this.et0Id = data[j].id;
                    }
                  }
                  if(this.rainId&&this.et0Id){
                    barFlag=true;
                    this.wiseconnService.getDataByMeasure(this.rainId,this.dateRange).subscribe((response) => {
                      let rainData=response.data?response.data:response;
                      this.wiseconnService.getDataByMeasure(this.et0Id,this.dateRange).subscribe((response) => {
                        let et0Data=response.data?response.data:response;
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
                          return 0;
                        });
                        chartData=chartData.filter((element)=>{
                          if(moment.utc(element.time).format("HH:mm:ss")=="00:00:00"){
                            return element;
                          }
                        })
                        	let maxLabelValue=0;
                        	for (var i = 0; i < chartData.length; i++) {
                        	 	if(chartData[i+1]){
                        	    	if(chartData[i].time===chartData[i+1].time){
                        				if(this.barChartLabels.find((element) => {
                        					return element === this.momentFormat(chartData[i].time,"bar");
                        				}) === undefined) {
                        				this.barChartLabels.push(this.momentFormat(chartData[i].time,"bar"));
                        				if(chartData[i].chart=="rain") {
			            					this.barChartData[0].push(chartData[i].value);
			               				}
				            			if(chartData[i].chart=="et0") {
				            			this.barChartData[1].push(chartData[i].value);
				                    	}
                        	        }
                        	    }
                        	  }
                        	}
                        	this.renderCharts("bar");
                      });
                    });
                  }else if(j==data.length){
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: 'No tiene configurado los sensores de rain y et0'
                    })
                  }
                  j++;
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
	highchartsShow(){
		this.lineChartOptions.chart['renderTo'] = this.lineChartElement.nativeElement;
    	this.lineChart = Highcharts.chart(this.lineChartOptions);
    	this.barChartOptions.chart['renderTo'] = this.barChartElement.nativeElement;
    	this.barChart = Highcharts.chart(this.barChartOptions);
	}
	renderCharts(chart:string) {
		switch (chart) {
			case "line":
    			this.lineChart.series[0].setData(this.lineChartData[0]);
    			this.lineChart.series[1].setData(this.lineChartData[1]);
    			this.lineChart.xAxis[0].setCategories(this.lineChartLabels, true);
				this.renderLineChartFlag=true;
				break;
			case "bar":
				this.barChart.series[0].setData(this.barChartData[0]);
    			this.barChart.series[1].setData(this.barChartData[1]);
    			this.barChart.xAxis[0].setCategories(this.barChartLabels, true);
				this.renderBarChartFlag=true;
				break;
			default:
				// code...
				break;
		}
	}
	resetChartsValues(chart:string){
		switch (chart) {
			case "line":
				this.lineChartLabels=[];
		        this.lineChartLabels=[];
		        this.lineChartData=[[],[]];
				break;	
			case "bar":
				this.barChartLabels=[];
		        this.barChartLabels=[];
				this.barChartData=[[],[]];
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
}
