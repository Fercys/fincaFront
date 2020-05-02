import { Component, OnInit, ViewChild, ElementRef , Inject } from '@angular/core';
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


@Component({
  selector: 'app-weather-monitoring',
  templateUrl: './weather-monitoring.component.html',
  styleUrls: ['./weather-monitoring.component.scss']
})
export class WeatherMonitoringComponent implements OnInit {
  public userLS:any=null;
  public user:any=null;
  private google_api_key = 'AIzaSyDx_dMfo0VnR_2CsF_wNw9Ayjd_HO6sMB0';
  public loading = false;
  public id = 0;
  public url;
  public status=false;
  public measurements:any[]=[]; //mediciones
  public now:any=null
  public statusRegando=false;
  public dialog;
  public today = Date.now();
  public dataFarm: any;
  public zone: any = null;
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
    public calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private dialogs: MatDialog) {
  }

  ngOnInit() {   
    this.now=moment().format('L') +" "+ moment().format('LTS');
    this.dateRangeByDefault();
    if(localStorage.getItem("user")){
      this.userLS=JSON.parse(localStorage.getItem("user"));
      if(bcrypt.compareSync(this.userLS.plain, this.userLS.hash)){
        this.user=JSON.parse(this.userLS.plain);
        if(localStorage.getItem("lastRoute")&&localStorage.getItem("lastRoute")!="weather-monitoring"){
          if(localStorage.getItem('lastPolygonData')){
            localStorage.removeItem('lastPolygonData');
          }
        }
        this.setLocalStorageItem("lastRoute","weather-monitoring");
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
  }
  getFarms() {
    this.loading = true;
    this.wiseconnService.getFarms().subscribe((response: any) => {
      this.farms = response.data?response.data:response;
      if(localStorage.getItem("lastFarmId")){
        this.farm=this.getFarm(parseInt(localStorage.getItem("lastFarmId")));
      }
      if(this.farm){
        this.processWeatherStation();
      }else if(localStorage.getItem("lastFarmId")!=undefined&&this._route.snapshot.paramMap.get('id')){
        Swal.fire({icon: 'error',title: 'Oops...',text: 'Farm no existente'});
      }        
      this.loading = false;     
    })
  }
  getFarmsByUser(){
    this.loading = true;
    this.userService.getFarmsByUser(this.user.id).subscribe((response: any) => {
      this.farms = response.data?response.data:response;
      if(localStorage.getItem("lastFarmId")){
        this.farm=this.getFarm(parseInt(localStorage.getItem("lastFarmId")));
      }
      if(this.farm){
        this.processWeatherStation();
      }else if(localStorage.getItem("lastFarmId")!=undefined&&this._route.snapshot.paramMap.get('id')){
        Swal.fire({icon: 'error',title: 'Oops...',text: 'Farm no existente'});
      }        
      this.loading = false;
    });
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
  processWeatherStation(){
    if(localStorage.getItem('lastWeatherStation')){
      this.weatherStation = JSON.parse(localStorage.getItem('lastWeatherStation'));
      this.getIrrigarionsRealOfWeatherStation();
      this.getWeather();
    }else{
      this.getWeatherStation();
    }
  }
  getIrrigarionsRealOfWeatherStation(){
    this.loading = true;
    this.wiseconnService.getMeterogoAgrifut(this.weatherStation.id).subscribe((response: any) => {
      this.loading = false;
      let data=response.data?response.data:response;
      this.measurements = this.processMeasurements(data);
      this.setLocalStorageItem("lastMeasurements",this.getJSONStringify(this.measurements));
    });
  }
  /*goBack(){
    let lastElement=this.dateRangeHistory.pop();
    this.fromDate=lastElement.fromDate;
    this.toDate=lastElement.toDate;
    this.selectedValue=lastElement.selectedValue;
    this.times.map((element)=>{
      element.active=(element.value===this.selectedValue)?true:false;
      return element;
    });
  }*/
getWeatherStation() {
  this.loading = true;
  this.wiseconnService.getWeatherStation(this.farm.id).subscribe((response: any) => {
    this.loading = false; 
    this.weatherStation = response.data?response.data:null;
    if(this.weatherStation){
      this.getIrrigarionsRealOfWeatherStation();
      this.setLocalStorageItem("lastFarmId",this.farm.id);
      this.setLocalStorageItem("lastWeatherStation",this.getJSONStringify(this.weatherStation));
      this.getWeather();
    }else{
      Swal.fire({icon: 'error',title: 'Oops...',text: 'Campo sin "Estación Metereologica" registrada'});
    }

  });
} 

getWeather(){
  if (this.farm.latitude && this.farm.longitude) {
    this.climaLoading = false;
    this.weatherService.getWeather("e8078bb2fbfd43f1b9f175027202403", [this.farm.latitude, this.farm.longitude]).subscribe((response) => {
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
    //this.setLocalStorageItem("lastLineChartLabels",this.getJSONStringify(this.lineChartLabels));
    //this.setLocalStorageItem("lastLineChartData",this.getJSONStringify(this.lineChartData));
    //this.setLocalStorageItem("lastBarChartLabels",this.getJSONStringify(this.barChartLabels));
    //this.setLocalStorageItem("lastBarChartData",this.getJSONStringify(this.barChartData));
    this.farm=this.getFarm(id);
    if(this.farm){
      this.setLocalStorageItem("lastFarmId",this.farm.id);
      this.getWeatherStation();
      this.getWeather();
    }
    break;
    default:
    break;
  }
} 
setLocalStorageItem(key,value){
  localStorage.setItem(key,value);
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
changeDateRange(){
  this.fromDate=this.fromDate;
  this.toDate=this.toDate;
  this.weatherStation=this.weatherStation;
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

deleteValueJson(value) {
  var index: number = this.measurements.indexOf(this.measurements.find(x => x.name == value));
  if (index != -1) this.measurements.splice(index, 1);
}
open(content, sizeValue) {
  this.modalService.open(content, {size: sizeValue} );
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
translateMeasurement(measurement:string){
  let newMeasurement;
  switch ((measurement).toLowerCase()) {
    case "station temperature":
    newMeasurement="Temperatura";
    break;
    case "wind direction":
    newMeasurement="Dir. Viento";
    break;
    case "direccion de viento":
    newMeasurement="Dir. Viento";
    break;
    case "velocidad viento":
    newMeasurement="Vel. Viento";
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
    case "station relative humidity":
    newMeasurement="Humedad";
    break;
    case "radiacion solar":
    newMeasurement="Rad. Solar";
    break;
    case "solar radiation ":
    newMeasurement="Rad. Solar";
    break;
    default:
    newMeasurement=measurement;
    break;
  }    
  return newMeasurement;
}
processMeasurements(data){
  let measurementsResult=[]
  let measurementNames=[
  "Velocidad Viento",
  "Vel. Viento",
  "Wind Speed (period)",
  "Direccion de viento",
  "Dir. Viento",
  "Wind Direction",
  "Radiacion Solar",
  "Rad. Solar",
  "Solar radiation ",
  "Station Relative Humidity",
  "Sta. Rel. Humidity",
  "Pluviometro",
  "Temperatura", 
  "Humedad",
  "Station Temperature"]
  for (const item of data) {
    if(measurementNames.find(element=>element==item.name)!=undefined){
      if(measurementsResult.find(element=>element.name==item.name)==undefined){
        measurementsResult.push(item);
      }
    }  
  }
  return measurementsResult;
}
decimalProcessor(value,decimals){
  return value.toFixed(decimals);
}
getCardinalPointOfTheValue(value:number){
  let CardinalPoint;
  switch (value) {
    case 360:
    CardinalPoint='N';
    break;
    case 90:
    CardinalPoint='E';
    break;
    case 180:
    CardinalPoint='S';
    break;
    case 270:
    CardinalPoint='W';
    break;
    default:
    if(value>=0&&value<=89.99){
      CardinalPoint='NE';
    }else if(value>=90.1&&value<=179.99){
      CardinalPoint='SE';
    }else if(value>=180.1&&value<=269.99){
      CardinalPoint='SW';
    }else if(value>=270.1&&value<=359.99){
      CardinalPoint='NW';
    }
    break;
  }
  return CardinalPoint;
}

}
