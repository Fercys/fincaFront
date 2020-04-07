import { Component, OnInit, ViewChild, ElementRef , Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { element } from 'protractor';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NgbModal,ModalDismissReasons , NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

//notificaciones
import Swal from 'sweetalert2'
//servicios
import { WiseconnService } from 'app/services/wiseconn.service';
import { WeatherService } from 'app/services/weather.service';
import { UserService } from 'app/services/user.service';

import * as bcrypt from 'bcryptjs';
import * as moment from "moment";

//graficas
// tslint:disable-next-line:no-var-requires
const Highcharts = require('highcharts/highstock');
// tslint:disable-next-line:no-var-requires
require('highcharts/highmaps');
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);
require('highcharts/highcharts-more')(Highcharts);

@Component({
  selector: 'app-weather-monitoring',
  templateUrl: './weather-monitoring.component.html',
  styleUrls: ['./weather-monitoring.component.scss']
})
export class WeatherMonitoringComponent implements OnInit,OnDestroy {
  public userLS:any=null;
  public user:any=null;
  @ViewChild('mapRef', { static: true }) mapElement: ElementRef;
  private google_api_key = 'AIzaSyDx_dMfo0VnR_2CsF_wNw9Ayjd_HO6sMB0';
  public loading = false;
  public id = 0;
  public url;
  public status=false;
  public measurements; //mediciones
  public statusRegando=false;
  public dialog;
  public today = Date.now();
  public dataFarm: any;
  public zone: any = null;
  public zones: any[] = [];
  public weatherZones: any[] = [];
  public farm: any=null;
  public farms: any[] = [];
  public weatherStation: any = null;
  public closeResult: string;
  public clima: any;

  //rango de fechas para graficas  
  public fromDate: NgbDate;
  public toDate: NgbDate;
  public hoveredDate: NgbDate;
  public dateRange: any = null;
  public dateRangeHistory:any[]=[]
  public selectedValue: any = '1S';
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
  //Pronostico values
  public climaLoading = false;
  public climaToday: any;
  public climaDay = [];
  public climaIcon = [];
  public climaMax = [];
  public climaMin = [];
  
  constructor(
    private _route: ActivatedRoute,
    private wiseconnService: WiseconnService,
    public weatherService: WeatherService,
    public userService: UserService,
    public modalService: NgbModal,
    private router: Router,
    private calendar: NgbCalendar,
    private formatter: NgbDateParserFormatter,
    private dialogs: MatDialog) {
  }

  ngOnInit() {    
    this.dateRangeByDefault();
    if(localStorage.getItem("user")){
          this.userLS=JSON.parse(localStorage.getItem("user"));
          if(bcrypt.compareSync(this.userLS.plain, this.userLS.hash)){
            this.user=JSON.parse(this.userLS.plain);
            if(this.user.id_role==1){
              this.getFarms();
            }else{
              this.getFarmsByUser();
            }            
          }else{
            this.router.navigate(['/login']);
          }
        }else{
          this.router.navigate(['/login']);
        }
    this.highchartsShow();
  }
  getFarms() {
    this.loading = true;
    this.wiseconnService.getFarms().subscribe((response: any) => {
      this.loading = false;
      this.farms = response.data?response.data:response;
      if(this.farms.length>0){
          this.fromDate = this.calendar.getNext(this.calendar.getToday(), 'd', -5);
          this.toDate = this.calendar.getToday();
          if(localStorage.getItem("lastFarmId")){
            this.farm=this.getFarm(parseInt(localStorage.getItem("lastFarmId")));
            if(this.farm){
              if(localStorage.getItem("lastFarmId")!=undefined && (parseInt(localStorage.getItem("lastFarmId"))==parseInt(this.farm.id))){
                this.zones = JSON.parse(localStorage.getItem('lastZones'));
                this.weatherZones=this.getWeatherZones();
                this.loadMap();
                if(this.fromDate && this.toDate){
                  this.getChartInformation();
                }
                this.processMapData();
              }else{
                this.getZones();
              }
              this.getWeather()
            }  
          }
      }else{
        Swal.fire({icon: 'error',title: 'Oops...',text: 'No existe ningún campo registrado'});
      }      
    })
  }
  getFarmsByUser(){      
      this.loading = true;
      this.userService.getFarmsByUser(this.user.id).subscribe((response: any) => {
          this.loading = false;
          this.farms = response.data?response.data:response;
            if(this.farms.length>0){
              this.fromDate = this.calendar.getNext(this.calendar.getToday(), 'd', -5);
              this.toDate = this.calendar.getToday();
              if(localStorage.getItem("lastFarmId")){
                this.farm=this.getFarm(parseInt(localStorage.getItem("lastFarmId")));
                if(this.farm){
                  if(localStorage.getItem("lastFarmId")!=undefined && (parseInt(localStorage.getItem("lastFarmId"))==parseInt(this.farm.id))){
                    this.zones = JSON.parse(localStorage.getItem('lastZones'));
                    this.weatherZones=this.getWeatherZones();
                    this.loadMap();
                    if(this.fromDate && this.toDate){
                      this.getChartInformation();
                    }
                    this.processMapData();
                  }else{
                    this.getZones();
                  }
                  this.getWeather()
                }
              }
          }else{
            Swal.fire({icon: 'error',title: 'Oops...',text: 'No existe ningún campo registrado'});
          } 
      });
  }
  getFarm(id){
    return this.farms.find(element =>{
      return element.id==id || element.id_wiseconn==id
    });
  }
  getZones() {
    this.loading = true;
    this.wiseconnService.getZones(this.farm.id).subscribe((response: any) => {
      this.loading = false; 
      this.zones = response.data?response.data:response;
      this.weatherZones=this.getWeatherZones();
      this.setLocalStorageItem("lastFarmId",this.farm.id);
      this.setLocalStorageItem("lastZones",this.getJSONStringify(this.zones));
      this.loadMap();
      this.getChartInformation();
      this.processMapData();
    });
  }
  getWeather(){
    if (this.farm.latitude && this.farm.longitude) {
      this.climaLoading = false;
      this.weatherService.getWeather("7da96f2f52f54be7a1b123737202102", [this.farm.latitude, this.farm.longitude]).subscribe((response) => {
        this.climaLoading = true;
        this.resetWeatherValues(response);
        for (const element of response.data.weather) {
          element.iconLabel = element.hourly[0].weatherIconUrl[0];
          this.climaDay.push(element.date);
          this.climaIcon.push(element.iconLabel.value);
          this.climaMax.push(element.maxtempC);
          this.climaMin.push(element.mintempC);
        }
      });
    }
    this.setUrlValue();
  }
  setUrlValue(){
    switch (this.farm.name) {
      case "Agrifrut":
      this.url = "https://cdtec.irrimaxlive.com/?cmd=signin&username=cdtec&password=l01yliEl7H#/u:3435/Campos:l/Agrifrut:f";
      break;
      case "Agrifrut II (Nogales y Parrones)":
      this.url = "https://cdtec.irrimaxlive.com/?cmd=signin&username=cdtec&password=l01yliEl7H#/u:3435/Campos:l/Agrifrut%20II%20(Nogales%20y%20Parrones):f";
      break;
      case "Santa Juana de Chincolco":
      this.url = "https://cdtec.irrimaxlive.com/?cmd=signin&username=cdtec&password=l01yliEl7H#/u:3507/Campos:l/Agricola%20Santa%20Juana%20de%20Chincolco%20SA:f";
      break;
      default:
      this.url = "";
    }
  }
  resetWeatherValues(response){
    this.climaDay = [];
    this.climaIcon = [];
    this.climaMax = [];
    this.climaMin = [];
    this.climaToday = response.data.current_condition[0];
  }
  onSelect(select: string, id: number) {
    switch (select) {
      case "farm":
      this.setLocalStorageItem("lastLineChartLabels",this.getJSONStringify(this.lineChartLabels));
      this.setLocalStorageItem("lastLineChartData",this.getJSONStringify(this.lineChartData));
      this.setLocalStorageItem("lastBarChartLabels",this.getJSONStringify(this.barChartLabels));
      this.setLocalStorageItem("lastBarChartData",this.getJSONStringify(this.barChartData));
      this.farm=this.getFarm(id);
      if(this.farm){
        this.setLocalStorageItem("lastFarmId",this.farm.id);
        this.getZones();
        this.getWeather();
      }
      break;
      case "zone":
      this.setLocalStorageItem("lastLineChartLabels",this.getJSONStringify(this.lineChartLabels));
      this.setLocalStorageItem("lastLineChartData",this.getJSONStringify(this.lineChartData));
      this.setLocalStorageItem("lastBarChartLabels",this.getJSONStringify(this.barChartLabels));
      this.setLocalStorageItem("lastBarChartData",this.getJSONStringify(this.barChartData));
      this.router.navigate(['/farmpolygon',this.farm.id, id]);
      break;
      default:
      break;
    }
  } 
  setLocalStorageItem(key,value){
    localStorage.setItem(key,value);
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
  getWeatherZones(){
    return this.zones.filter((element)=>{
      if(element.type.find(element=>{
        if(element.description){
          return element.description.toLowerCase() == "weather"
        }
        return element.toLowerCase() == "weather" 
      })!=undefined){
        return element;
      }
    });
  }
  highchartsShow(){
    this.lineChartOptions.chart['renderTo'] = this.lineChartElement.nativeElement;
    this.lineChart = Highcharts.chart(this.lineChartOptions);
    this.barChartOptions.chart['renderTo'] = this.barChartElement.nativeElement;
    this.barChart = Highcharts.chart(this.barChartOptions);
  }
  getChartInformation(goBackFlag:boolean=false){
    this.resetChartsValues("line");
    this.resetChartsValues("bar");                               
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
      let weatherStationFlag=false;
      let i=0;
      while (!weatherStationFlag && i < this.zones.length) {
        this.loading=true;
        if (this.zones[i].name == "Estación Meteorológica" || this.zones[i].name == "Estación Metereológica") {
          weatherStationFlag=true;
          this.weatherStation = this.zones[i];
          this.wiseconnService.getMeasuresOfZones(this.weatherStation.id).subscribe((response) => {        
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
                        // this.loading = false;
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
                      if(i+1==chartData.length){
                        this.renderCharts("bar");
                      }
                    }
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
            }
          });
        }
        i++;
      }
      this.loading=false;
    }
  }
processMapData(){
  if (this.zones.length == 0) {
  this.loadMap();
  this.measurements = [];
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Por favor revisar la data cargada en el campo, ya que no tiene data cargada!'
  })
}else {
  if (this.zones[0].max != null) {
    this.loadMap();
  } else {
    this.loadMap();
    this.measurements = [];
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Por favor revisar la data cargada en el campo, ya que presenta errores, (ubicaciones no cargada, falta data etc) !'
    })
  }
} 
}
getJSONStringify(data) {
  var cache = [];
  var result =null;
  result=JSON.stringify(data, function(key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        return;
      }
      cache.push(value);
    }
    return value;
  });
  cache = null;
  return result;
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
getPathData(element:string){
  let pathData=[];
  if(this.zones.length>=10){
    switch (element) {
      case "lat":
      if(this.zones[10].polygon!=undefined && this.zones[10].polygon.path.length>0){
        pathData=this.zones[10].polygon.path[0].lat;
      }else if(this.zones[10].path!=undefined && this.zones[10].path.length>0){
        pathData=this.zones[10].path[0].lat;
      }
      break;
      case "lng":
      if(this.zones[10].polygon!=undefined && this.zones[10].polygon.path.length>0){
        pathData=this.zones[10].polygon.path[0].lng;
      }else if(this.zones[10].path!=undefined && this.zones[10].path.length>0){
        pathData=this.zones[10].path[0].lng;
      }
      break;
      default:
      // code...
      break;
    }
  }
  return pathData;
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
    this.getChartInformation(false);
  }
processMeasurements(){
  for (const item of this.measurements) {
    if(item.name == "Velocidad Viento"){
      item.name = "Vel. Viento"
    }
    if(item.name == "Direccion de viento") {
      item.name = "Dir. Viento"
    }
    if(item.name == "Radiacion Solar"){
      item.name = "Rad. Solar"
    }   
    if(item.name == "Station Relative Humidity"){
      item.name = " Sta. Rel. Humidity "
    }  
    if(item.name == "Wind Direction" || item.name ==  "ATM pressure" || item.name ==  "Wind Speed (period)" || item.name ==  "Porciones de Frío" || item.name ==  "Horas Frío"){
      this.deleteValueJson(item.name);
    }    
    if(item.name == "Porciones de Frío")  {
      this.deleteValueJson(item.name);
    }
    if(item.name == "Horas Frío")  {
      this.deleteValueJson(item.name);
    }    
  }
  this.deleteValueJson("Et0");
  this.deleteValueJson("Etp");
}
addMarkerImage(map,element,urlImage){
    let lat;
    let lng;
    if(element.path!=undefined){
      if(element.path.length>0){
        lat=parseFloat(element.path[0].lat);
        lng=parseFloat(element.path[0].lng);
      }else if(element.latitude && element.longitude){
        lat=parseFloat(element.latitude);
        lng=parseFloat(element.longitude);
      }
    }else if(element.polygon!=undefined){
      if(element.polygon.path!=undefined){
        if(element.polygon.path.length>0){
          lat=parseFloat(element.polygon.path[0].lat);
          lng=parseFloat(element.polygon.path[0].lng);
        }
      }
    }
    if(lat && lng){
      var marker = new window['google'].maps.Marker({
          position: {lat: lat, lng: lng},
          map: map,
          icon: {
              url: urlImage, // url
              scaledSize: new window['google'].maps.Size(30, 30), // scaled size
              origin: new window['google'].maps.Point(0,0), // origin
              anchor: new window['google'].maps.Point(0, 0) // anchor
          }
      });
    }
    
  }
  getTranslateType(type:string){
    let typeResult;
    switch (type) {
      case "Irrigation":
        typeResult="Sector riego";
        break;
      case "Soil":
        typeResult="Humedad de suelo";
        break;
      case "Weather":
        typeResult="Clima";
        break;
      default:
        // code...
        break;
    }
    return typeResult;
  }
addListenersOnPolygon(polygon, id){
  let tooltip = document.createElement("span");
  let mapContainer = document.getElementById("map-container")?document.getElementById("map-container").firstChild:null;
  if(mapContainer){
    let zone = this.zones.filter(element => element.id == id || element.id_wiseconn == id)[0];
    window['google'].maps.event.addListener(polygon, 'mouseover', (event) => {        
      tooltip.id = 'tooltip-text';
      tooltip.style.backgroundColor = '#777777';
      tooltip.style.color = '#FFFFFF';
      if(zone.status!=undefined){
        switch ((zone.type.length)) {
            case 1:
            tooltip.innerHTML = zone.name + " - "+this.getTranslateType(zone.type[0].description);
            break;
            case 2:
            tooltip.innerHTML = zone.name + " - "+ this.getTranslateType(zone.type[0].description)+", "+ this.getTranslateType(zone.type[1].description);
            break;
            case 3:
            tooltip.innerHTML = zone.name + " - "+ this.getTranslateType(zone.type[0].description)+", "+ this.getTranslateType(zone.type[1].description)+", "+ this.getTranslateType(zone.type[2].description);
            default:
            break;
          }
      }else{
        tooltip.innerHTML = zone.name;
      }

      tooltip.style.position = 'absolute';
      tooltip.style.padding = '20px 20px';
      tooltip.style.bottom = '0px';
      mapContainer.appendChild(tooltip);
    });
    window['google'].maps.event.addListener(polygon, 'mouseout', (event) => {
      var elem = document.querySelector('#tooltip-text');
      if(elem)
        elem.parentNode.removeChild(elem);
    });
    window['google'].maps.event.addListener(polygon, 'click', () => {
      let farmId=this.zones[0].farmId?this.zones[0].farmId:this.zones[0].id_farm;
      this.router.navigate(['/farmpolygon', farmId, id]);
    });
  }
}
loadMap() {
  if (this.weatherZones.length == 0) {
    Swal.fire({icon: 'info',title: 'Información sobre el mapa',text: 'Sin zonas registradas'});
    var map = new window['google'].maps.Map(this.mapElement.nativeElement, {
      center: { lat: -32.89963602180464, lng: -70.90243510967417 },
      zoom: 15,
      mapTypeId: window['google'].maps.MapTypeId.HYBRID
    });
    this.setLocalStorageItem("lastMapData",this.getJSONStringify({
      center: { lat: -32.89963602180464, lng: -70.90243510967417 },
      zoom: 15,
      mapTypeId: window['google'].maps.MapTypeId.HYBRID
    }));
  } else {
    if(this.getPathData('lat').length==0&&this.getPathData('lng').length==0){
      Swal.fire({icon: 'info',title: 'Información sobre el mapa',text: 'Datos de poligonos no registrados'});
    }
    var map = new window['google'].maps.Map(this.mapElement.nativeElement, {
      center: { lat: this.getPathData('lat'), lng: this.getPathData('lng') },
      zoom: 15,
      mapTypeId: window['google'].maps.MapTypeId.HYBRID
    });
    this.setLocalStorageItem("lastMapData",this.getJSONStringify({
      center: { lat: this.getPathData('lat'), lng: this.getPathData('lng') },
      zoom: 15,
      mapTypeId: window['google'].maps.MapTypeId.HYBRID
    }));
  }

  var contentString = '<div id="content">' +
  '<div id="siteNotice">' +
  '</div>' +
  '<h3 id="thirdHeading" class="thirdHeading">W3path.com</h3>' +
  '<div id="bodyContent">' +
  '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>' +
  '</div>' +
  '</div>';

  var flightPlanCoordinates = [
  { lat: -32.90045576247285, lng: -70.90006940132304 },
  ];
  var flightPath = new window['google'].maps.Polyline({
    path: flightPlanCoordinates,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  flightPath.setMap(map);
  var infowindow = new window['google'].maps.InfoWindow({
    content: contentString
  });
  var wisservice = this.wiseconnService;

  let polygonDatas=[];
  this.weatherZones.forEach(element => {
    // Construct the polygon.
    wisservice.getIrrigarionsRealOfZones(element.id).subscribe((response: any) => {
      let data=response.data?response.data:response;
      let id= element.id_wiseconn?element.id_wiseconn:element.id;
      if (parseInt(id) == 727 || parseInt(id) == 6054 || parseInt(id) == 13872){
        let polygonData={
          paths: element.path?element.path:element.polygon.path,
          strokeColor: '#E5C720',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#E5C720',
          fillOpacity: 0.35,
        };
        var Triangle = new window['google'].maps.Polygon(polygonData);
        polygonDatas.push({element:element,data:polygonData});
        this.setLocalStorageItem("lastPolygonWeatherData",JSON.stringify(polygonDatas));
        // Marker Image          
        this.addMarkerImage(map, element, "https://i.imgur.com/C7gyw7N.png");
        Triangle.setMap(map);
        this.addListenersOnPolygon(Triangle, element.id);        
        if (element.name == "Estación Meteorológica" || element.name == "Estación Metereológica") {
          this.loading = true;
          wisservice.getMeterogoAgrifut(element.id).subscribe((response: any) => {
            this.loading = false;
            this.measurements = response.data?response.data:response;
            this.setLocalStorageItem("lastMeasurements",this.getJSONStringify(this.measurements));
            this.processMeasurements();
          }) 
        }
             
      } else {
        if (data != "") {
          if (data[0].status == "Executed OK") {
            this.weatherZones.map((zone)=>{
              if(zone.id==element.id||zone.id_wiseconn==element.id){
                element.status=data[0].status
              }
              return element;
            });
            let polygonData={
              paths: element.path?element.path:element.polygon.path,
              strokeColor: '#49AA4F',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#49AA4F',
              fillOpacity: 0.35,
            };
            var Triangle = new window['google'].maps.Polygon(polygonData);              
            polygonDatas.push({element:element,data:polygonData});
            this.setLocalStorageItem("lastPolygonWeatherData",JSON.stringify(polygonDatas));
            // Marker Image          
            // this.addMarkerImage(map, element, "../../assets/icons/map/Ok-01.svg");
            Triangle.setMap(map);
            this.addListenersOnPolygon(Triangle, element.id);
          } else {
            if (data[0].status == "Running") {
              this.weatherZones.map((zone)=>{
                if(zone.id==element.id||zone.id_wiseconn==element.id){
                  element.status=data[0].status
                }                  
                this.statusRegando=true;
                return element;
              });
              let polygonData={
                paths: element.path?element.path:element.polygon.path,
                strokeColor: '#419FD5',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#419FD5',
                fillOpacity: 0.35,
              };
              var Triangle = new window['google'].maps.Polygon(polygonData);                
              polygonDatas.push({element:element,data:polygonData});
              this.setLocalStorageItem("lastPolygonWeatherData",JSON.stringify(polygonDatas));
              // Marker Image          
              this.addMarkerImage(map, element,  "../../assets/icons/map/Regando-01.svg");                  
              Triangle.setMap(map);
              this.addListenersOnPolygon(Triangle,element.id);
            } else {
              let polygonData={
                paths: element.path?element.path:element.polygon.path,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
              };
              var Triangle = new window['google'].maps.Polygon(polygonData);
              Triangle.setMap(map);
              this.addListenersOnPolygon(Triangle,element.id);                
              polygonDatas.push({element:element,data:polygonData});              
              this.setLocalStorageItem("lastPolygonWeatherData",JSON.stringify(polygonDatas));
            }
          }
        }
      }
    });
});
}

resetChartsValues(chart: string){
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
    // code...
    break;
  }
}
deleteValueJson(value) {
  var index: number = this.measurements.indexOf(this.measurements.find(x => x.name == value));
  if (index != -1) this.measurements.splice(index, 1);
}
open(content, sizeValue) {
  this.modalService.open(content, {size: sizeValue} );
}
translateMeasurement(measurement:string){
    let newMeasurement;
    switch ((measurement).toLowerCase()) {
          case "station temperature":
            newMeasurement="Temperatura";
            break;
          case "wind direction":
            newMeasurement="Dir. Viento";
            break;
          case "wind speed (period)":
            newMeasurement="Vel. Viento";
            break;
          case "solar radiation":
            newMeasurement="Rad. Solar";
            break;
          case "sta. rel. humidity":
            newMeasurement="Humedad";
            break;
          default:
            newMeasurement=measurement;
            break;
        }    
    return newMeasurement;
  }
translateDate(date:string){
  let newDate;
  let days=[
  {ing:"Mon",spa:"Lun"},
  {ing:"Tue",spa:"Mar"},
  {ing:"Wed",spa:"Mie"},
  {ing:"Thu",spa:"Jue"},
  {ing:"Fri",spa:"Vie"},
  {ing:"Sat",spa:"Sab"},
  {ing:"Sun",spa:"Dom"}
  ];
  for (var i = 0; i < days.length; i++) {      
    if(date.indexOf(days[i].ing)==0){
      newDate=date.replace(days[i].ing, days[i].spa);
    }
  }    
  return newDate;
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
//por factorizar  
renderMap() {
  window['initMap'] = () => {
    this.loadMap();
  }
  if (!window.document.getElementById('google-map-script')) {
  } else {
    this.loadMap();
  }
}

ngOnDestroy() {
  // this.wiseconnService.getFarms().unsubscribe();
  // this.wiseconnService.getZones().unsubscribe();
  // this.weatherService.getWeather().unsubscribe();
  // this.weatherService.getMeasuresOfZones().unsubscribe();
  // this.weatherService.getDataByMeasure().unsubscribe();
}
}