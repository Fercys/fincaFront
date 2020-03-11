import { Component, OnInit,ViewChild,ElementRef ,Inject  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { element } from 'protractor';
import { NgbModal, NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

//graficas
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
//notificaciones
import Swal from 'sweetalert2'
//servicios
import { WiseconnService } from 'app/services/wiseconn.service';
import { WeatherService } from 'app/services/weather.service';

import * as moment from "moment";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
@Component({
  selector: 'app-weather-monitoring',
  templateUrl: './weather-monitoring.component.html',
  styleUrls: ['./weather-monitoring.component.scss']
})
export class WeatherMonitoringComponent implements OnInit {
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
  public dateRange: any = null;
  //graficas
  public lineData= [{
          name: 'Temperatura',
          data: [],
          // yAxis: 0,
      }, {
          name: 'Humedad',
          data: [],
          yAxis: 1,
      }];
  //graficas
  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Temperatura' },
    { data: [], label: 'Humedad', yAxisID: 'y-axis-1' },
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: false, 
    tooltips: { 
      mode: 'index', 
      intersect: false 
    },
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
  public lineChartColors: Color[] = [
    { // red
      backgroundColor:'rgba(255, 255, 255, 0.1)',
      borderColor:'#D12B34',
      pointBackgroundColor:'rgba(255, 0, 0,1)',
      pointBorderColor:'#fff',
      pointHoverBackgroundColor:'#fff',
      pointHoverBorderColor: 'rgba(255, 0, 0,0.8)'
    },
    { // celeste
      backgroundColor:'rgba(255, 255, 255, 0.1)',
      borderColor:'#00B9EE',
      pointBackgroundColor:'rgba(2, 87, 154,1)',
      pointBorderColor:'#fff',
      pointHoverBackgroundColor:'#fff',
      pointHoverBorderColor:'rgba(2,87,154,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [pluginAnnotations];


  public temperatureId: number = null;
  public humidityId: number = null;
  public renderLineChartFlag : boolean = false;

  //bar chart
  public barChartOptions: ChartOptions = {
    responsive: false,
    tooltips: { 
      mode: 'index', 
      intersect: false 
    },
    // We use these empty structures as placeholders for dynamic theming.
    scales: { 
      xAxes: [{}], 
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
          ticks: {
              fontSize: 7,
              max:100
          }
        },        
      ] 
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  barChartColors: Color[] = [
    { // blue
      backgroundColor:'#0168b3',
      borderColor:'#0168b3',
      pointBackgroundColor:'rgba(255, 0, 0,1)',
      pointBorderColor:'#fff',
      pointHoverBackgroundColor:'#fff',
      pointHoverBorderColor: 'rgba(255, 0, 0,0.8)'
    },
    { // gray
      backgroundColor:'#b5b5b5',
      borderColor:'#b5b5b5',
      pointBackgroundColor:'rgba(255, 0, 0,1)',
      pointBorderColor:'#fff',
      pointHoverBackgroundColor:'#fff',
      pointHoverBorderColor: 'rgba(255, 0, 0,0.8)'
    },
    { 
      backgroundColor:'#905ca7',
      borderColor:'#905ca7',
      pointBackgroundColor:'rgba(255, 0, 0,1)',
      pointBorderColor:'#fff',
      pointHoverBackgroundColor:'#fff',
      pointHoverBorderColor: 'rgba(255, 0, 0,0.8)'
    },
    { 
      backgroundColor:'#94c11e',
      borderColor:'#94c11e',
      pointBackgroundColor:'rgba(255, 0, 0,1)',
      pointBorderColor:'#fff',
      pointHoverBackgroundColor:'#fff',
      pointHoverBorderColor: 'rgba(255, 0, 0,0.8)'
    },
    { 
      backgroundColor:'#ffd200',
      borderColor:'#ffd200',
      pointBackgroundColor:'rgba(255, 0, 0,1)',
      pointBorderColor:'#fff',
      pointHoverBackgroundColor:'#fff',
      pointHoverBorderColor: 'rgba(255, 0, 0,0.8)'
    },
  ];
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Precipitación (mm)' }, 
    { data: [], label: 'Et0 (mm)' },
  ];
  public rainId: number = null;
  public et0Id: number = null;
  public renderBarChartFlag: boolean = false;

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
    private router: Router,
    public weatherService: WeatherService,
    private calendar: NgbCalendar,
    private dialogs: MatDialog) {
  }

  ngOnInit() {
    this.getFarms();
  }
  getFarms() {
    this.wiseconnService.getFarms().subscribe((response: any) => {
      this.farms = response.data?response.data:response;
      this.filterFarmsByUser();
      if(this.farms.length>0){
        this.farm=this.farms[0];        
        if(localStorage.getItem("lastFarmId")!=undefined && (parseInt(localStorage.getItem("lastFarmId"))==parseInt(this.farm.id))){
          this.zones = JSON.parse(localStorage.getItem('lastZones'));
          this.weatherZones=this.getWeatherZones();
          this.loadMap();
          this.getChartInformation();
        }else{
          this.getZones();
        }
        this.getWeather()
      }else{
        Swal.fire({icon: 'error',title: 'Oops...',text: 'No existe ningún campo registrado'});
      }      
    })
  }
  filterFarmsByUser(){
    if(localStorage.getItem("username")){
      switch (localStorage.getItem("username").toLowerCase()) {
        case "agrifrut":
          this.farms = this.farms.filter((element) => {
            return element.id == 185 || element.id == 2110 || element.id == 1378 || element.id == 520
          })
          break;
          case "agrifrut@cdtec.cl":
          this.farms = this.farms.filter((element) => {
            let id= element.id_wiseconn?element.id_wiseconn:element.id;
            return id == 185 || id == 2110 || id == 1378 || id == 520
          })
          break;
        case "santajuana":
          this.farms = this.farms.filter((element) => {
            let id= element.id_wiseconn?element.id_wiseconn:element.id;
            return id == 719
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
    }else{
      this.router.navigate(['/login']);
    }
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
        this.getZones();
        this.getWeather();
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
    //moment.utc(value).format("DD/MM/YYYY hh:mm:ss");
    switch (chart) {
      case "line":
        return moment.utc(value).format('DD') +" "+ moment(value).format('MMM');
        break;
      case "bar":
        return moment.utc(value).format('DD') +" "+ moment(value).format('MMM');
        break;
      default:
        return moment.utc(value).format('DD') +" "+ moment(value).format('MMM');
        break;
    }
    return value;
  }
  getWeatherZones(){
    return this.zones.filter((element)=>{
      if(element.type.find(element=>{
        return element.toLowerCase() == "weather"
      })!=undefined){
        return element;
        }
    });
  }
  getChartInformation(){
    this.renderLineChartFlag=false;
    this.renderBarChartFlag=false;
    //rango de fechas para graficas
    this.fromDate = this.calendar.getNext(this.calendar.getToday(), 'd', -5);
    this.toDate = this.calendar.getToday();
    this.dateRange = {
      initTime: moment(this.fromDate.year + "-" + this.fromDate.month + "-" + this.fromDate.day).format("YYYY-MM-DD"),
      endTime: moment(this.toDate.year + "-" + this.toDate.month + "-" + this.toDate.day).format("YYYY-MM-DD")
    };
    for (var i = 0; i < this.zones.length; i++) {
      if (this.zones[i].name == "Estación Meteorológica" || this.zones[i].name == "Estación Metereológica") {
        this.weatherStation = this.zones[i];
        this.loading = true;
        this.wiseconnService.getMeasuresOfZones(this.weatherStation.id).subscribe((response) => {
          let data=response.data?response.data:response;
          for (var i = 0; i < data.length; i++) {
            //bar chart
            if (data[i].sensorType != undefined && data[i].name != undefined){
              if ((data[i].sensorType).toLowerCase() === "rain" && (data[i].name).toLowerCase() === "pluviometro") {
                this.rainId = data[i].id;
              }
            }
            if ((data[i].name) != undefined){
              if ((data[i].name).toLowerCase() === "et0") {
                this.et0Id = data[i].id;
              }
            }
            if(this.rainId&&this.et0Id){
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
                  this.resetChartsValues("bar");
                  let maxLabelValue=0;
                  for (var i = 0; i < chartData.length; i++) {
                    if(chartData[i+1]){
                      if(chartData[i].time===chartData[i+1].time){
                        this.barChartLabels.push(this.momentFormat(chartData[i].time,"bar")); 
                      }  
                    }
                    if(chartData[i].chart=="rain") {
                      this.barChartData[0].data.push(chartData[i].value);
                    }
                    if(chartData[i].chart=="et0") {
                      this.barChartData[1].data.push(chartData[i].value);
                    }
                    if(i+1==chartData.length){
                      this.renderCharts("bar");
                    }
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
                      if(moment(element.time).minutes()==0 || moment(element.time).minutes()==30)
                        return element;
                    });
                    for (var i = 0; i < chartData.length; i++) {                      
                      if(this.lineChartLabels.find((element) => {
                        return element === this.momentFormat(chartData[i].time,"line");
                      }) === undefined) {
                        this.lineChartLabels.push(this.momentFormat(chartData[i].time,"line"));
                        if(chartData[i].time==chartData[i+1].time){
                          this.lineChartData[0].data.push(chartData[i].value);
                          this.lineData[0].data.push(chartData[i].value);

                          this.lineChartData[1].data.push(chartData[i+1].value);
                          this.lineData[1].data.push(chartData[i+1].value);
                        }
                      }
                      // if (chartData[i].chart==="temperature") {
                      //   this.lineChartData[0].data.push(chartData[i].value);
                      //   this.lineData[0].data.push(chartData[i].value);
                      // } 
                      // if(chartData[i].chart==="humidity"){
                      //   this.lineChartData[1].data.push(chartData[i].value);
                      //   this.lineData[1].data.push(chartData[i].value);
                      // }
                      if(i+1==chartData.length){
                        this.renderCharts("line");
                      }
                    }
                  });
                });
              }else if(i==data.length){
                Swal.fire({
                  icon: 'info',
                  title: 'Oops...',
                  text: 'No tiene configurado los sensores de humedad y temperatura'
                })
              }
            }
          });
        }
      }
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
    if(element.latitude){
      lat=element.latitude;
    }else if(element.path){
      lat=element.path[0].lat;
    }else if(element.polygon.path){
      lat=element.polygon.path[0].lat;
    }
    if(element.longitude){
      lng=element.longitude;
    }else if(element.path){
      lng=element.path[0].lng;
    }else if(element.polygon.path){
      lng=element.polygon.path[0].lng;
    }
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
          switch ((zone.status).toLowerCase()) {
            case "running":
            tooltip.innerHTML = zone.name + " - Regando";
            break;
            case "executed ok":
            tooltip.innerHTML = zone.name + " - Ok";
            break;
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
          this.loading = true;
          wisservice.getMeterogoAgrifut(element.id).subscribe((response: any) => {
            this.loading = false;
            this.measurements = response.data?response.data:response;
            this.setLocalStorageItem("lastMeasurements",this.getJSONStringify(this.measurements));
            this.processMeasurements();
          })      
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
        this.lineChartLabels=[];
        for (var i = 0; i < 2; i++) {
          this.lineChartData[i].data=[];
        }
        break;  
      case "bar":
        this.barChartLabels=[];
        for (var i = 0; i < 2; i++) {
          this.barChartData[i].data=[];
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
}