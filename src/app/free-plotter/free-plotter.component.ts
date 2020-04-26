import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal,ModalDismissReasons , NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import * as bcrypt from 'bcryptjs';
import * as moment from "moment";

import { WiseconnService } from 'app/services/wiseconn.service';
import { NotificationService } from 'app/services/notification.service';
import { UserService } from 'app/services/user.service';

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
  	public userLS:any=null;
  	public user:any=null;
	public loading:boolean=false;
	public farms:any[]=[];	
	public farm:any=null;
	public zonesAux:any[]=[];
	public sensorTypes:any[]=[];
	//rango de fechas para graficas
  	public today = Date.now();
	public fromDate: NgbDate;
	public toDate: NgbDate;
	public dateRange: any = null;
	public dateRangeHistory:any[]=[]
	public selectedValue: any = '1S';
	public hoveredDate: NgbDate;
	public requestChartBtn: boolean =true;
	//graficas
	//chart
	@ViewChild('chartElement', { static: true }) public chartElement: ElementRef;
	private chart;
	public chartDataLength:number=null;
	public chartData:any[]=[[],[]];
	public chartLabels:any[]=[];
	public chartOptions:any = {
	    chart: {
	        type: 'spline',

	    },
	    colors: [],//dinamic '#D12B34','#00B9EE'
	    title: {
	        text: 'Title'
	    },
	    subtitle: {
	        text: 'Subtitle'
	    },
	    xAxis: [{
	        categories: [],
	        startOnTick: true,
    		endOnTick: true,
	    }],
	   	yAxis: [],
	    plotOptions: {
	        line: {
	            dataLabels: {
	                enabled: false
	            },
	            enableMouseTracking: true,
	        }
	    },
	    series: [],//dinamic {data: [],name: 'Humedad',type: 'line',yAxis: 1 }
	    tooltip: {
	        shared: true,
	        crosshairs: true
	    },
	};
	//times
	public times =[
		{ value: '1D' , active: false},
		{ value: '1S' , active: true},
		{ value: '2S' , active: false},
		{ value: '1M' , active: false},
		{ value: '3M' , active: false},
		{ value: '6M' , active: false},
	]
	//selects
	public selectGroups:any[]=[];
	public chartColors:string[]=['#D12B34','#00B9EE','#DBAB3F','#31B404','#084B8A','#DF0174'];
	public defaultSelectGroups:any={
		variableGroups:[{
			name: 'Variables',
			variable: []
		}],
		variablesSelected:null,
		types:[
			{id:1,name:"Linea"},
			{id:2,name:"Columna"},
		],
		typeSelected:null,
		resolutions:[
			{id:1,name:"15 Minutos"},
			{id:2,name:"30 Minutos"},
			{id:3,name:"45 Minutos"},
			{id:4,name:"60 Minutos"},
		],
		resolutionSelected:null,
		zones:[],
		zoneSelected:null,
		sensors:[
			{id:1,name:"#1 15 cm (%)"},
			{id:2,name:"#2 35 cm (%)"},
			{id:3,name:"#3 55 cm (%)"},
			{id:4,name:"#4 75 cm (%)"},
		],
		sensorSelected:null,
		chartColor:this.chartColors[this.selectGroups.length]
	};
	constructor(
		public wiseconnService: WiseconnService,
    	public notificationService:NotificationService,
    	public userService:UserService,
		public router: Router,
		public calendar: NgbCalendar, 
		public formatter: NgbDateParserFormatter) { }

	ngOnInit() {//rango de fechas para graficas
		if(localStorage.getItem("user")){
	        this.userLS=JSON.parse(localStorage.getItem("user"));
	        if(bcrypt.compareSync(this.userLS.plain, this.userLS.hash)){
	          	this.user=JSON.parse(this.userLS.plain);
				this.addSelectGroups();
				this.dateRangeByDefault();
					if(localStorage.getItem("lastFarmId")){
						this.farm=this.getFarm(parseInt(localStorage.getItem("lastFarmId")));
		          		this.getSensorTypesOfFarm(parseInt(localStorage.getItem("lastFarmId")));
				    }else{
		          		Swal.fire({
	                    	icon: 'error',
	                    	title: 'Oops...',
	                    	text: 'No tiene campo seleccionado'
	                	})
		          	}
	        }else{
	          this.router.navigate(['/login']);
	        }
	      }else{
	        this.router.navigate(['/login']);
	      }
	}
	getFarmsByUser(){      
	  	this.loading = true;
	  	this.userService.getFarmsByUser(this.user.id).subscribe((response: any) => {
	  	  	this.farms = response.data?response.data:response;      
	  	  	this.loading = false;
	  	});
	}
	getFarms() {
		this.loading=true;
		this.wiseconnService.getFarms().subscribe((response: any) => {			
			this.loading=false;
			this.farms = response.data?response.data:response;
		})
	}
	getFarm(id){
	    let farm = this.farms.find(element =>{
	      return element.id==id || element.id_wiseconn==id
	    });
	    if(!farm){
	      if(this.farms[0]){
	        farm=this.farms[0];
	      }
	    }
	    return farm;
	}
	getSensorTypesOfFarm(id:number=0) {
		this.loading = true;
		this.wiseconnService.getSensorTypesOfFarm(id).subscribe((response: any) => {
			this.loading = false;
			this.sensorTypes=response.data?response.data:response;
			for (let sensorType of this.sensorTypes) {
				for (let variableGroup of this.selectGroups[this.selectGroups.length-1].variableGroups) {
					if(variableGroup.name==sensorType.group){
						variableGroup.variable.push({id:sensorType.id,name:sensorType.name})
					}
				}				
			}			
		},
		error=>{
			this.loading = false;
            this.notificationService.showError(error.error);
			console.log("error:",error)
		});
	}	
	sortData(data, type) {
	    let ordered = [];
	    let dataArr = [].slice.call(data);
	    let dataSorted = dataArr.sort((a, b) => {
	        if (type === "asc") {
	            if (a.zone.name < b.zone.name) return -1
	            else return 1
	        } else {
	            if (a.zone.name > b.zone.name) return -1
	            else return 1
	        }
	    });
	    dataSorted.forEach(e => ordered.push(e));
	    return ordered;
	}
	filterZonesByVariable(group:any,variablesSelected:any){
			this.sensorTypes.filter(element=>{
				if(element.id==variablesSelected.id){
					element.zones=element.zones.filter(zone=>{
						if(zone.zone.id_farm==element.id_farm){
							return zone;
						}
					});
					this.selectGroups[this.selectGroups.length-1].zones=this.sortData(element.zones,"asc");
				}
			})
	}
	onSelect(select: string, id: number, group:any=null) {
		switch (select) {			
			case "variable":
				if(group){
					this.selectGroups[this.selectGroups.length-1].variablesSelected=group.variable.find((element)=>{
						return element.id == id
					});
					this.filterZonesByVariable(group,this.selectGroups[this.selectGroups.length-1].variablesSelected)
				}
			break;
			case "type":
				this.selectGroups[this.selectGroups.length-1].typeSelected=this.selectGroups[this.selectGroups.length-1].types.find((element)=>{
					return element.id == id
				});
			break;
			case "resolution":
				this.selectGroups[this.selectGroups.length-1].resolutionSelected = this.selectGroups[this.selectGroups.length-1].resolutions.find((element)=>{
					return element.id == id
				});
			break;
			case "zone":
				this.selectGroups[this.selectGroups.length-1].zoneSelected = this.selectGroups[this.selectGroups.length-1].zones.find((element)=>{
					return element.zone.id == id
				});
			break;
			case "sensor":
				this.selectGroups[this.selectGroups.length-1].sensorSelected = this.selectGroups[this.selectGroups.length-1].sensors.find((element)=>{
					return element.id == id
				});
			break;
			default:
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
			break;
		}
		this.toDate = this.calendar.getToday();
		this.requestChartBtn=(this.fromDate && this.toDate && this.toDate.after(this.fromDate))?false:true;
		//this.requestDataChart(false);
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
    resetChartsValues(){
    	this.chartOptions.colors=[];
    	this.chartOptions.series=[];
    	this.chartOptions.yAxis=[];
    	this.chartOptions.xAxis[0].categories=[];
	    this.highchartsShow();
    }
    getSensorName(sensorType:string){
        switch ((sensorType).toLowerCase()) {
            //clima
            case 'temperature':
                return 'Temperatura';
                break;
            case 'humidity':
                return 'Humedad Relativa';
                break;
            case 'wind velocity':
                return 'Velocidad Viento';
                break;
            case 'solar radiation':
                return 'Radiación Solar';
                break;
            case 'wind direction':
                return 'Dirección Viento';
                break;
            case 'atmospheric preassure':
                return 'Presión Atmosférica';
                break;
            case 'wind gust':
                return 'Ráfaga Viento';
                break;
            case 'chill hours':
                return 'Horas Frío';
                break;
            case 'chill portion':
                return 'Porción Frío';
                break;
            case 'daily etp':
                return 'Etp Diaria';
                break;
            case 'daily et0':
                return 'Et0 Diaria';
                break;
            //humedad
            case 'salinity':
                return 'Salinidad';
                break;
            case 'soil temperature':
                return 'Temperatura Suelo';
                break;
            case 'soil moisture':
                return 'Humedad Suelo';
                break;
            case 'soil humidity':
                return 'Humedad de Tubo';
                break;
            case 'added soild moisture':
                return 'Suma Humedades';
                break;
            //Riego
            case 'irrigation':
                return 'Riego';
                break;
            case 'irrigation volume':
                return 'Volumen Riego';
                break;
            case 'daily irrigation time':
                return 'Tiempo de Riego Diario';
                break;
            case 'flow':
                return 'Caudal';
                break;
            case 'daily irrigation volume by pump system':
                return 'Volumen de Riego Diario por Equipo';
                break;
            case 'daily irrigation time by pump system':
                return 'Tiempo de Riego Diario por Equipo';
                break;
            case 'irrigation by pump system':
                return 'Riego por Equipo';
                break;
            case 'flow by zone':
                return 'Caudal por Sector';
                break;
            default:
                return sensorType;
                break;
        }
    }
	requestDataChart(goBackFlag:boolean=false){
		if(this.selectGroups[this.selectGroups.length-1].typeSelected&&
			this.selectGroups[this.selectGroups.length-1].resolutionSelected&&
			this.selectGroups[this.selectGroups.length-1].zoneSelected){
	        //this.resetChartsValues("bar");
	    	this.resetChartsValues();
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
			let i=0;
			for(let selectGroup of this.selectGroups){
				let j=0;
				let getDataByMeasure=false;
				while(j<selectGroup.zoneSelected.zone.measures.length&&!getDataByMeasure){
					let measure=selectGroup.zoneSelected.zone.measures[j];
					if(measure.sensorType&&selectGroup.variablesSelected.name){
						if((this.getSensorName(measure.sensorType)).toLowerCase()==(selectGroup.variablesSelected.name).toLowerCase()){
							//measure.id => para probar local
							//measure.id_wiseconn => para probar con wiseconn
							this.loading=true;
							this.wiseconnService.getDataByMeasure(measure.id,this.dateRange).subscribe((response) => {
								getDataByMeasure=true;
								let chartData=response.data?response.data:response;
	                            this.selectGroups[this.selectGroups.length-1].resolutionSelected
	                            chartData = chartData.filter((element) => {
	                                let minutes=moment(element.time).minutes();
	                                switch (this.selectGroups[this.selectGroups.length-1].resolutionSelected.name) {
	                                	case "15 Minutos":
	                                		if(minutes==15)
	                                			return element;
	                                		break;
	                                	case "30 Minutos":
	                                		if(minutes==30)
	                                			return element;
	                                		break;
	                                	case "45 Minutos":
	                                		if(minutes==45)
	                                			return element;
	                                		break;
	                                	case "60 Minutos":
	                                		if(minutes==0)
	                                			return element;
	                                		break;
	                                	default:
	                                		// code...
	                                		break;
	                                }
	                                
	                            });
	                            chartData.sort(function (a, b) {
		                          if (moment(a.time).isAfter(b.time)) {
		                            return 1;
		                          }
		                          if (!moment(a.time).isAfter(b.time)) {
		                            return -1;
		                          }
		                          return 0;
		                        });
		                        
	                            if(chartData.length>this.chartOptions.xAxis[0].categories.length){
	                            	this.chartOptions.xAxis[0].categories=[];
	                            	for(let data of chartData){
		                            	this.chartOptions.xAxis[0].categories.push(this.momentFormat(data.time,"line"));
	                            	}
	                            }

	                            chartData=chartData.map(element=>{
	                              	return element.value
	                            });

	                            let yAxis=(this.chartOptions.yAxis.length % 2 == 0)?{ // Primary yAxis
							        labels: {
							            format: '{value}',
							            style: {
							                color: selectGroup.chartColor
							            }
							        },
							        title: {
							            text: selectGroup.variablesSelected.name +"/"+selectGroup.zoneSelected.zone.name,
							            style: {
							                color: selectGroup.chartColor
							            }
							        },
							        opposite: true

							    }:{ // Secondary yAxis
							        gridLineWidth: 0,
							        title: {
							            text: selectGroup.variablesSelected.name +"/"+selectGroup.zoneSelected.zone.name,
							            style: {
							                color: selectGroup.chartColor
							            }
							        },
							        labels: {
							            format: '{value}',
							            style: {
							                color: selectGroup.chartColor
							            }
							        }

							    };
					    		let serieLabelName=selectGroup.variablesSelected.name +"/"+selectGroup.zoneSelected.zone.name;
					    		let serie=((selectGroup.typeSelected.name).toLowerCase() == "linea")?{
					    				data: chartData.slice(0, this.chartDataLength-1),
					    				name: serieLabelName,
					    				type: 'line',
					    				yAxis: this.chartOptions.series.length
					    			}:{
					    				data: chartData.slice(0, this.chartDataLength-1),
					    				name: serieLabelName,
					    				type: 'column',
					    				yAxis: this.chartOptions.series.length
					    			};
					    		if(this.chartOptions.series.length==0){					    			
					    			this.chartOptions.series.push(serie);
					    			this.chartOptions.yAxis.push(yAxis);
					    			this.chartOptions.colors.push(selectGroup.chartColor);
					    		}else if(this.chartOptions.series.find(element=>{return element.name==serieLabelName})==undefined){
					    			this.chartOptions.series.push(serie);
					    			this.chartOptions.yAxis.push(yAxis);
					    			this.chartOptions.colors.push(selectGroup.chartColor);
					    		}					    			
	    						this.highchartsShow();
	    						this.loading=false;
							},
							error=>{
	    						this.loading=false;
								console.log("error:",error)
							});
						}
					}
					j++;
				}
				i++;
			}
		}else{
			let message='';
			if(!this.selectGroups[this.selectGroups.length-1].typeSelected){
				message+='Debe seleccionar el tipo de gráfica <br>' 
			}
			if(!this.selectGroups[this.selectGroups.length-1].resolutionSelected){
				message+='Debe seleccionar la resolución <br>' 
			}
			if(!this.selectGroups[this.selectGroups.length-1].zoneSelected){
				message+='Debe seleccionar la zona <br>' 
			}
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				html: message
			})
	    } 
	}
	highchartsShow(){
		this.chartOptions.chart['renderTo'] = this.chartElement.nativeElement;
    	this.chart = Highcharts.chart(this.chartOptions);
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
	getDefaultSelectGroups(){
		return {
			variableGroups:[{
				name: 'Clima',
				variable: []
			},
			{
				name: 'Humedad',
				variable: []
			},
			{
				name: 'Riego',
				variable: []
			}],
			variablesSelected:null,
			types:[
				{id:1,name:"Linea"},
				{id:2,name:"Columna"},
			],
			typeSelected:null,
			resolutions:[
				{id:1,name:"15 Minutos"},
				{id:2,name:"30 Minutos"},
				{id:3,name:"45 Minutos"},
				{id:4,name:"60 Minutos"},
			],
			resolutionSelected:null,
			zones:[],
			zoneSelected:null,
			sensors:[
				{id:1,name:"#1 15 cm (%)"},
				{id:2,name:"#2 35 cm (%)"},
				{id:3,name:"#3 55 cm (%)"},
				{id:4,name:"#4 75 cm (%)"},
			],
			sensorSelected:null,
			chartColor:this.chartColors[this.selectGroups.length]
		};
	}
	addSelectGroups(){
		if(this.selectGroups.length>0){
			if(this.selectGroups.length<6){
				if(this.selectGroups[this.selectGroups.length-1].typeSelected&&
					this.selectGroups[this.selectGroups.length-1].resolutionSelected&&
					this.selectGroups[this.selectGroups.length-1].zoneSelected){
					this.selectGroups.push(this.getDefaultSelectGroups())
						if(localStorage.getItem("lastFarmId")){
			          		this.getSensorTypesOfFarm(parseInt(localStorage.getItem("lastFarmId")));
					    }
				}else{
					let message='';
					if(!this.selectGroups[this.selectGroups.length-1].typeSelected){
						message+='Debe seleccionar el tipo de gráfica <br>' 
					}
					if(!this.selectGroups[this.selectGroups.length-1].resolutionSelected){
						message+='Debe seleccionar la resolución <br>' 
					}
					if(!this.selectGroups[this.selectGroups.length-1].zoneSelected){
						message+='Debe seleccionar la zona <br>' 
					}
					Swal.fire({
				      icon: 'error',
				      title: 'Oops...',
				      html: message
				    })
		    	}
		    }else{
		    	Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ya no se puede añadir más selectores'
                })
		    }
		}else{
			this.selectGroups.push(this.getDefaultSelectGroups())
			if(localStorage.getItem("lastFarmId")){
	          		this.getSensorTypesOfFarm(parseInt(localStorage.getItem("lastFarmId")));
			    }
		}
	}
}
