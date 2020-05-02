import { Component, OnInit, ViewChild, ElementRef, Inject  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NgbModal, NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { element } from 'protractor';
import Swal from 'sweetalert2';
import * as bcrypt from 'bcryptjs';
import * as moment from "moment";
//services
import { WiseconnService } from 'app/services/wiseconn.service';
import { AlertService } from 'app/services/alert.service';
import { WeatherService } from 'app/services/weather.service';
import { NotificationService } from 'app/services/notification.service';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-farm-map',
  templateUrl: './farm-map.component.html',
  styleUrls: ['./farm-map.component.scss']
})
export class FarmMapComponent implements OnInit {
  //ViewChild('mapRef', { static: true }) mapElement: ElementRef;
  private google_api_key = 'AIzaSyDx_dMfo0VnR_2CsF_wNw9Ayjd_HO6sMB0';
  public loading = false;
  public url;
  public dialog;
  public today = Date.now();
  public zone: any = null;
  public zones: any[] = [];
  public weatherZones: any[] = [];
  public farm: any=null;
  public farms: any[] = [];
  public weatherStation: any = null;
  public closeResult: string;
  public clima: any; 
  public measurements:any[]=[];
  public now:any=null
  public statusRegando:boolean=false;
  public status:boolean=null;
  //graficas
  //rango de fechas para graficas
  public fromDate: NgbDate;
  public toDate: NgbDate;
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
  public climaLoading:boolean = false;
  public climaToday: any;
  public climaDay:any[] = [];
  public climaIcon:any[] = [];
  public climaMax:any[] = [];
  public climaMin:any[] = [];

  public userLS:any=null;
  public user:any=null;
  //alertas
  public alerts:any[]=[];

  constructor(
    public _route: ActivatedRoute,
    public wiseconnService: WiseconnService,
    public alertService:AlertService,
    public weatherService: WeatherService,
    public notificationService:NotificationService,
    public userService:UserService,
    public modalService: NgbModal,
    public router: Router,
    public calendar: NgbCalendar,
    public dialogs: MatDialog) {
  }

  ngOnInit() {
    this.now=moment().format('L') +" "+ moment().format('LTS');
    if(localStorage.getItem("user")){
      this.userLS=JSON.parse(localStorage.getItem("user"));
      if(bcrypt.compareSync(this.userLS.plain, this.userLS.hash)){
        this.user=JSON.parse(this.userLS.plain);
        if(localStorage.getItem("lastRoute")&&localStorage.getItem("lastRoute")!="farmmap/"+this._route.snapshot.paramMap.get('id')){
          if(localStorage.getItem("lastPolygonData")){
            localStorage.removeItem("lastPolygonData");
          }
        }
        this.setLocalStorageItem("lastRoute","farmmap/"+this._route.snapshot.paramMap.get('id'));
        if(this.user.role.id==1){//admin
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
  getFarms(){
    this.loading = true;
    this.wiseconnService.getFarms().subscribe((response: any) => {
      this.loading = false;
      this.farms = response.data?response.data:response;
      if(localStorage.getItem("lastFarmId")){
        if(this._route.snapshot.paramMap.get('id')){
          if(parseInt(this._route.snapshot.paramMap.get('id'))==parseInt(localStorage.getItem("lastFarmId"))){
            this.farm=this.getFarm(parseInt(localStorage.getItem("lastFarmId")));
          }else{
            this.farm=this.getFarm(parseInt(this._route.snapshot.paramMap.get('id')));
            this.setLocalStorageItem("lastFarmId",this.farm.id);
            if(localStorage.getItem("lastZones")){
              localStorage.removeItem('lastZones');
            }
            if(localStorage.getItem("lastWeatherStation")){
              localStorage.removeItem('lastWeatherStation');
            }
          }
        }
      }else if(this._route.snapshot.paramMap.get('id')){
        this.farm=this.getFarm(this._route.snapshot.paramMap.get('id'));
        this.setLocalStorageItem("lastFarmId",this.farm.id);
            if(localStorage.getItem("lastZones")){
              localStorage.removeItem('lastZones');
            }
            if(localStorage.getItem("lastWeatherStation")){
              localStorage.removeItem('lastWeatherStation');
            }
      }else if(this.farms.length>0){
        this.farm=this.farms[0];
      }
      this.dateRangeByDefault();
      if(this.farm){
        this.processZones();
      }else if(localStorage.getItem("lastFarmId")!=undefined&&this._route.snapshot.paramMap.get('id')){
        Swal.fire({icon: 'error',title: 'Oops...',text: 'Farm no existente'});
      }        
      this.loading = false;
    });
  }
  getFarmsByUser(){
    this.loading = true;
    this.userService.getFarmsByUser(this.user.id).subscribe((response: any) => {
      this.loading = false;
      this.farms = response.data?response.data:response;
      if(localStorage.getItem("lastFarmId")){
        if(this._route.snapshot.paramMap.get('id')){
          if(parseInt(this._route.snapshot.paramMap.get('id'))==parseInt(localStorage.getItem("lastFarmId"))){
            this.farm=this.getFarm(parseInt(localStorage.getItem("lastFarmId")));
          }else{
            this.farm=this.getFarm(parseInt(this._route.snapshot.paramMap.get('id')));
            this.setLocalStorageItem("lastFarmId",this.farm.id);
            if(localStorage.getItem("lastZones")){
              localStorage.removeItem('lastZones');
            }
            if(localStorage.getItem("lastWeatherStation")){
              localStorage.removeItem('lastWeatherStation');
            }
          }
        }
      }else if(this._route.snapshot.paramMap.get('id')){
        this.farm=this.getFarm(this._route.snapshot.paramMap.get('id'));
        this.setLocalStorageItem("lastFarmId",this.farm.id);
            if(localStorage.getItem("lastZones")){
              localStorage.removeItem('lastZones');
            }
            if(localStorage.getItem("lastWeatherStation")){
              localStorage.removeItem('lastWeatherStation');
            }
      }else if(this.farms.length>0){
        this.farm=this.farms[0];
      }
      this.dateRangeByDefault();
      if(this.farm){
        this.processZones();
      }else if(localStorage.getItem("lastFarmId")!=undefined&&this._route.snapshot.paramMap.get('id')){
        Swal.fire({icon: 'error',title: 'Oops...',text: 'Farm no existente'});
      }        
      this.loading = false;
    });
  }
  getFarm(id){
    let farm = this.farms.find(element =>{
      return element.id==id
    });
    if(!farm){
      if(this.farms[0]){
        farm=this.farms[0];
      }    
    }
    return farm;
  }
  processZones(){
    if(localStorage.getItem('lastZones')){
      this.zones = JSON.parse(localStorage.getItem('lastZones'));
      this.weatherStation=this.getWeatherStation(this.zones);
      this.weatherZones=this.getWeatherZones();
      this.getIrrigarionsRealOfZones();
      this.getWeather();
    }else{
      this.getZones();
    }
  }
  getZones() {
    this.loading = true;
    this.wiseconnService.getZones(this.farm.id).subscribe((response: any) => {
      this.loading = false; 
      this.zones = response.data?response.data:response;
      this.weatherStation=this.getWeatherStation(this.zones);
      this.weatherZones=this.getWeatherZones();
      this.getIrrigarionsRealOfZones();
      this.setLocalStorageItem("lastFarmId",this.farm.id);
      this.setLocalStorageItem("lastZones",this.getJSONStringify(this.zones));
      this.getWeather();
    });
  }
  getWeatherStation(zones:any){
    return zones.find((element)=>{
      return element.name=="Estación Meteorológica"||element.name=="Estación Metereológica";
    })
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
  getIrrigarionsRealOfZones(){
    this.zones.forEach(element => {
        let id= element.id_wiseconn?element.id_wiseconn:element.id;
          if (element.name == "Estación Meteorológica" || element.name == "Estación Metereológica") {
            this.loading = true;
            this.wiseconnService.getMeterogoAgrifut(element.id).subscribe((response: any) => {
              this.loading = false;
              let data=response.data?response.data:response;
              this.measurements = this.processMeasurements(data);
              this.setLocalStorageItem("lastMeasurements",this.getJSONStringify(this.measurements));
            },
            error=>{
              this.loading = false;
              
              if(error.error)
              this.notificationService.showError('Error',error.error)
              console.log("error:",error)
            }) 
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
  momentFormat(value:string){
    return moment.utc(value).format("YYYY-MM-DD");
  }
  getAlerts(){
    if(this.fromDate&&this.toDate){
      this.dateRange = {
        initTime: moment(this.fromDate.year + "-" + this.fromDate.month + "-" + this.fromDate.day).format("DD-MM-YYYY"),
        endTime: moment(this.toDate.year + "-" + this.toDate.month + "-" + this.toDate.day).format("DD-MM-YYYY")
      };
      if(this.farm){
        this.loading=true;
        this.alertService.getAlerts(this.farm.id,this.dateRange).subscribe((response) => {
          this.loading=false;
          this.alerts=response.data?response.data:response;        
        },
        error=>{
          console.log("error:",error);
          this.loading=false;
        }); 
      }
      

    }
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
    this.climaToday = response.data&&response.data.current_condition!=undefined&&response.data.current_condition.length>0?response.data.current_condition[0]:null;
  }
  setLocalStorageItem(key,value){
    localStorage.setItem(key,value);
  }
  selectTime(event){
    this.selectedValue = event.value;
    this.dateRangeByDefault();
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
  open(content:any, sizeValue:any, modal:any=null) {
    switch (modal) {
      case "alerts":
        if(this.farm){
          this.modalService.open(content, {size: sizeValue} );
        }else{
          Swal.fire({icon: 'error',title: 'Oops...',text: 'No hay un ningún campo seleccionado'});
        }
        break;      
      default:
        this.modalService.open(content, {size: sizeValue} );
        break;
    }
  }
  onSelect(select: string, id: number) {
    switch (select) {
      case "farm":
        this.farm=this.getFarm(id);
        if(this.farm){
          this.setLocalStorageItem("lastFarmId",this.farm.id);
            if(localStorage.getItem("lastZones")){
              localStorage.removeItem('lastZones');
            }
            if(localStorage.getItem("lastWeatherStation")){
              localStorage.removeItem('lastWeatherStation');
            }
          this.getZones();
          this.getWeather();
        }
        break;
      case "zone":
        //this.setLocalStorageItem("lastLineChartLabels",this.getJSONStringify(this.lineChartLabels));
        //this.setLocalStorageItem("lastLineChartData",this.getJSONStringify(this.lineChartData));
        //this.setLocalStorageItem("lastBarChartLabels",this.getJSONStringify(this.barChartLabels));
        //this.setLocalStorageItem("lastBarChartData",this.getJSONStringify(this.barChartData));
        this.router.navigate(['/farmpolygon',this.farm.id, id]);
      default:
        break;
    }
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
    this.getAlerts();
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
  deleteValueJson(value){
    var index:number = this.measurements.indexOf(this.measurements.find(x => x.name == value));
    if(index != -1) this.measurements.splice(index, 1);
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
  
  openDialog(): void {
     const dialogRef = this.dialogs.open(DialogMessage, {
       panelClass: 'messagedialogcss'
     });
  }   
}
@Component({
  selector: 'message-dialog',
  templateUrl: 'message-dialog.html',
  styleUrls: ['./message-dialog.scss'],
})
export class DialogMessage {

  constructor(
    public dialogRef: MatDialogRef<DialogMessage>,
    // @Inject(MAT_DIALOG_DATA) public data 
    ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}