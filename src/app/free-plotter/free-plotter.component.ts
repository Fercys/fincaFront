import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal,ModalDismissReasons , NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import * as bcrypt from 'bcryptjs';
import * as moment from "moment";

import { WiseconnService } from 'app/services/wiseconn.service';
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
	public zonesAux:any[]=[];
	public sensorTypes:any[]=[];
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
	public lineChartDataLength:number=0;
	public lineChartData:any[]=[[],[]];
	public lineChartLabels:any[]=[];
	public lineChartOptions:any = {
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
	    series: [],//dinamic {data: [],name: 'Humedad',type: 'line',yAxis: 1 }
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
	        text: 'PRECIPITACIÓN/ET0'
	    },
	    subtitle: {
	        text: 'PRECIPITACIÓN/ET0'
	    },
	    xAxis: {
	        categories: [
	        ],
	        crosshair: true
	    },
	    yAxis: {
	        // min: 0,
	        title: {
	            text:'PRECIPITACIÓN/ET0'
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
	//selects
	public selectGroups:any[]=[];
	public chartColors:string[]=['#D12B34','#00B9EE','#FFFF00','#31B404','#084B8A','#DF0174'];
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
			{id:1,name:"Minuto"},
			{id:2,name:"1/4 horas"},
			{id:3,name:"Suma humedades"},
			{id:4,name:"Hora"},
			{id:5,name:"2 horas"},
			{id:6,name:"6 horas"},
			{id:7,name:"Medio dia"},
			{id:8,name:"Dia"},
			{id:9,name:"Semana"},
			{id:10,name:"Mes"},
			{id:11,name:"Año"},
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
		//this.highchartsShow();
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
				//this.selectGroups[this.selectGroups.length-1].variableGroups[0].variable.push({id:sensorType.id,name:sensorType.name})
				//this.defaultSelectGroups.variableGroups[0].variable.push({id:sensorType.id,name:sensorType.name})
			}
			/*this.zonesAux=response.data?response.data:response;
			this.selectGroups[this.selectGroups.length-1].zones=this.zonesAux;
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
			});*/
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
    requestRandomDataChart(){

    	if(this.selectGroups[this.selectGroups.length-1].typeSelected){
    		//prueba
    		//this.loading = true;
			
    		//prueba
    		/*this.resetRandomChartsValues();
    		let i=0;
    		for (const element of this.selectGroups) {
    			this.lineChartOptions.colors.push(element.chartColor);
    			let serie=((element.typeSelected.name).toLowerCase() == "linea")?{
    			data: [
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
    			],
    			name: 'Grupo #'+(i+1),
    			type: 'line'
    			}:{
    			data: [
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10),
    			],
    			name: 'Grupo #'+(i+1),
    			type: 'column'
    			};
    			this.lineChartOptions.series.push(serie);
    			i++;
    		}*/
    		this.highchartsShow();
		}else{
	    	Swal.fire({
	            icon: 'error',
	            title: 'Oops...',
	            text: 'Debe seleccionar el tipo de gráfica'
	        })
	    }    	
    }
    resetRandomChartsValues(){
    	this.lineChartOptions.colors=[];
    	this.lineChartOptions.series=[];
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
		if(this.selectGroups[this.selectGroups.length-1].typeSelected){
	        this.resetRandomChartsValues();
	        //this.resetChartsValues("bar");
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
			console.log("this.selectGroups.length:",this.selectGroups.length)
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
								this.loading=false;
								getDataByMeasure=true;
								let chartData=response.data?response.data:response;
								console.log("chartData:",chartData)
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
	                            if(this.lineChartDataLength==0){
	                            	for(let data of chartData){
		                            	this.lineChartLabels.push(this.momentFormat(data.time,"line"));
		                            }
		                            console.log("lineChartLabels:",this.lineChartLabels)
	                            }else{
	                            	this.lineChartDataLength=chartData.length;
	                            }

	                            
	                            chartData=chartData.map(element=>{
	                              	return element.value
	                            });
					    		this.lineChartOptions.colors.push(selectGroup.chartColor);
					    			let serie=((selectGroup.typeSelected.name).toLowerCase() == "linea")?{
					    				data: chartData.slice(0, this.lineChartDataLength-1),
					    				name: selectGroup.variablesSelected.name +"/"+selectGroup.zoneSelected.zone.name,
					    				type: 'line'
					    			}:{
					    				data: chartData.slice(0, this.lineChartDataLength-1),
					    				name: selectGroup.variablesSelected.name +"/"+selectGroup.zoneSelected.zone.name,
					    				type: 'column'
					    			};
					    		this.lineChartOptions.series.push(serie);
	    						this.highchartsShow();
							},
							error=>{
								console.log("error:",error)
							});
						}
					}
					j++;
				}
				//console.log("selectGroup.zoneSelected.zone.measures:",selectGroup.zoneSelected.zone.measures)
				/*this.wiseconnService.getDataByMeasure(selectGroup.variablesSelected.id,this.dateRange).subscribe((response) => {
					console.log("response:",response)
				});*/
				/*this.loading = true;
		    		this.wiseconnService.getMeasuresOfZones(selectGroup.zoneSelected.id).subscribe((response) => {
					this.loading = false;
					let data=response.data?response.data:response;
					console.log("data:",data)
					let barFlag=false;
	                let lineFlag=false;
	                console.log("selectGroup.variablesSelected:",selectGroup.variablesSelected);*/
					/**/
	                /*let j=0;
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
	                          this.loading = true;
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
	                              		if((chartData[i].chart==="temperature")&&(chartData[i+1].chart==="humidity")){
	                              		  this.lineChartLabels.push(this.momentFormat(chartData[i].time,"line"));
	                              			this.lineChartData[0].push(chartData[i].value);
		                          		  this.lineChartData[1].push(chartData[i+1].value);
	                              		}
	                              	}
	                              }
	                              this.renderCharts("line");
	                            });
	                          });
	                        }else if(j+1==data.length){
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
	                    this.loading = true;
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
	                  }else if(j+1==data.length){
	                    Swal.fire({
	                      icon: 'error',
	                      title: 'Oops...',
	                      text: 'No tiene configurado los sensores de rain y et0'
	                    })
	                  }
	                  j++;
	                }*/
				//});
				i++;
			}
		}else{
	    	Swal.fire({
	            icon: 'error',
	            title: 'Oops...',
	            text: 'Debe seleccionar el tipo de gráfica'
	        })
	    } 
	}
	highchartsShow(){
		this.lineChartOptions.chart['renderTo'] = this.lineChartElement.nativeElement;
    	this.lineChart = Highcharts.chart(this.lineChartOptions);
    	/*this.barChartOptions.chart['renderTo'] = this.barChartElement.nativeElement;
    	this.barChart = Highcharts.chart(this.barChartOptions);*/
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
		    
		    this.temperatureId=null;
		    this.humidityId=null;
		    if(this.lineChart!=undefined){
		    	this.lineChart.series[0].setData([]);
		    	this.lineChart.series[1].setData([]);
		    	this.lineChart.xAxis[0].setCategories([]);
		    }

		    this.lineChartLabels=[];
		    for (var i = 0; i < 2; i++) {
		      this.lineChartData[i]=[];
		    }
		    break;  
		    case "bar":

		    this.rainId=null;
		    this.et0Id=null;
		    
		    if(this.barChart!=undefined){
		    	this.barChart.series[0].setData([]);
		    	this.barChart.series[1].setData([]); 
		    	this.barChart.xAxis[0].setCategories([]);
		    }
		    this.barChartLabels=[];
		    for (var i = 0; i < 2; i++) {
		      this.barChartData[i]=[];
		    }
		    break;
		    default:
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
				{id:1,name:"Minuto"},
				{id:2,name:"1/4 horas"},
				{id:3,name:"Suma humedades"},
				{id:4,name:"Hora"},
				{id:5,name:"2 horas"},
				{id:6,name:"6 horas"},
				{id:7,name:"Medio dia"},
				{id:8,name:"Dia"},
				{id:9,name:"Semana"},
				{id:10,name:"Mes"},
				{id:11,name:"Año"},
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
				if(this.selectGroups[this.selectGroups.length-1].typeSelected){
					this.selectGroups.push(this.getDefaultSelectGroups())
						if(localStorage.getItem("lastFarmId")){
			          		this.getSensorTypesOfFarm(parseInt(localStorage.getItem("lastFarmId")));
					    }
				}else{
		    		Swal.fire({
		                icon: 'error',
		                title: 'Oops...',
		                text: 'Debe seleccionar el tipo de gráfica'
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
