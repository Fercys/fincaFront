import { Component, OnInit,ViewChild,ElementRef   } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WiseconnService } from 'app/services/wiseconn.service';
import { element } from 'protractor';
import { NgbModal,ModalDismissReasons , NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { WeatherService } from 'app/services/weather.service';

import * as moment from "moment";
import Swal from 'sweetalert2'

@Component({
  selector: 'app-farm-map-polygon',
  templateUrl: './farm-map-polygon.component.html',
  styleUrls: ['./farm-map-polygon.component.scss'],
})
export class FarmMapPolygonComponent implements OnInit {
  @ViewChild('mapRef', {static: true }) mapElement: ElementRef;
  private google_api_key = 'AIzaSyDx_dMfo0VnR_2CsF_wNw9Ayjd_HO6sMB0';
  public loading = false;
  public id = 0;
  public url;
  public measurements;
  public now:any=null
  public clima;
  public climaRes: any = [];
  public farmData: any;
  public closeResult: string;
  public status: any;
  public idfarm: any;
  public today = Date.now();
  public hoveredDate: NgbDate;
  public selectedValue: any = '1S';
  public zones: any[]=[];
  public weatherStation: any = null;
  public weatherZones: any[]=[];
  public zone:any=null;
  public fromDate: NgbDate;
  public toDate: NgbDate;
  public requestChartBtn: boolean =true;
  public weatherStationId: number = null;
  public dateRange: any = null;
  public dateRangeHistory:any[]=[]; 
  public times =[
  { value: '1D' , active: false},
  { value: '1S' , active: true},
  { value: '2S' , active: false},
  { value: '1M' , active: false},
  { value: '3M' , active: false},
  { value: '6M' , active: false},
  ]
  //graficas
  
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
    public modalService: NgbModal, 
    public weatherService: WeatherService,
    private calendar: NgbCalendar, 
    public formatter: NgbDateParserFormatter) {
  }
  ngOnInit() {
    this.now=moment().format('L') +" "+ moment().format('LTS');
    if(localStorage.getItem("lastRoute")&&localStorage.getItem("lastRoute")!="farmpolygon/"+this._route.snapshot.paramMap.get('idfarm')+"/"+this._route.snapshot.paramMap.get('idzone')){
      if(localStorage.getItem('lastPolygonData')){
        localStorage.removeItem('lastPolygonData');
      }
    }
    this.setLocalStorageItem("lastRoute","farmpolygon/"+this._route.snapshot.paramMap.get('idfarm')+"/"+this._route.snapshot.paramMap.get('idzone'));
    this.getMeterogoAgrifut(parseInt(this._route.snapshot.paramMap.get('idfarm')),parseInt(this._route.snapshot.paramMap.get('idzone')));
  }
  getMeterogoAgrifut(idfarm:number,idzone:number){
    this.loading = true;
    this.weatherStationId=idzone;
    this.wiseconnService.getMeterogoAgrifut(idzone)
    .subscribe((response: any) => { 
      this.loading = false;
      this.farmData = response.data?response.data:response;
      this.loading = true;
      this.wiseconnService.getZones(idfarm).subscribe((response: any) => {
        this.loading = false;
        let zones=response.data?response.data:response;
        this.weatherStation=this.getWeatherStation(zones);
        this.weatherZones = zones.filter((element)=>{
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
        this.zone=this.getZone(idzone);
        this.getMeterogoAgrifutByZones();
        this.zones = zones.filter(function(element){
          return element['id'] == idzone;
        });
        this.getWeather(); 
        this.wiseconnService.getFarm(idfarm).subscribe((response: any) => {
          let accountId=response.data?response.data:response;
          switch (accountId) { 
            case 63:
            this.url="https://cdtec.irrimaxlive.com/?cmd=signin&username=cdtec&password=l01yliEl7H#/u:3435/Campos/Agrifrut";
            break;
            case 395:
            this.url="https://cdtec.irrimaxlive.com/?cmd=signin&username=cdtec&password=l01yliEl7H#/u:3507/Campos/Agricola%20Santa%20Juana%20de%20Chincolco";
            break;
            default:
            this.url="";
          }
          this.dateRangeByDefault();
        });
      });
    });    
  }
  getMeterogoAgrifutByZones(){
    this.zones.forEach(element =>{
      if(element.name=="Estación Meteorológica"){
        this.loading = true;
        this.wiseconnService.getMeterogoAgrifut(element.id).subscribe((response: any) => { 
          this.loading = false;
          let data=response.data?response.data:response;
          this.measurements = this.processMeasurements(data);
        });
      }
    });
  }
  getWeatherStation(zones:any){
    return zones.find((element)=>{
      return element.name=="Estación Meteorológica"||element.name=="Estación Metereológica";
    })
  }
  getZone(idzone:number){
    return this.weatherZones.find(element=>{return element.id==idzone});
  }
  getWeather(){
    if(this.zones[0].latitude && this.zones[0].longitude){
      //pronostico
      const q = [this.zones[0].latitude, this.zones[0].longitude];
      const key = "e8078bb2fbfd43f1b9f175027202403";
      this.climaLoading = false;
      this.weatherService.getWeather(key,q).subscribe((weather) => {
        this.climaToday = weather.data.current_condition[0];
        var clima = (weather.data.weather);
        for (const data of clima) {
          data.iconLabel = data.hourly[0].weatherIconUrl[0];
          this.climaDay.push(data.date);
          this.climaIcon.push(data.iconLabel.value);
          this.climaMax.push(data.maxtempC);
          this.climaMin.push(data.mintempC);
          this.climaLoading = true;
        }
      });
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No están cargada las coordenadas correctamente'
      })
    }     
  }
  open(content) {
    this.modalService.open(content);
  }
  deleteValueJson(value){
        var index:number = this.measurements.indexOf(this.measurements.find(x => x.name == value));
        if(index != -1) this.measurements.splice(index, 1);
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
          }
        });
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
  onSelect(select: string, id: number) {
    switch (select) {
      case "zone":
      if(localStorage.getItem("lastRoute")&&localStorage.getItem("lastRoute")!="farmpolygon/"+this._route.snapshot.paramMap.get('idfarm')+"/"+id){
        if(localStorage.getItem('lastPolygonData')){
          localStorage.removeItem('lastPolygonData');
        }
        this.setLocalStorageItem("lastRoute","farmpolygon/"+this._route.snapshot.paramMap.get('idfarm')+"/"+id);
        this.getMeterogoAgrifut(parseInt(this._route.snapshot.paramMap.get('idfarm')),id);
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
