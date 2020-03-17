import { Component, OnInit,ViewChild,ElementRef ,Inject  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WiseconnService } from 'app/services/wiseconn.service';
import { element } from 'protractor';
import { NgbModal, NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

import Swal from 'sweetalert2'

import { WeatherService } from 'app/services/weather.service';


import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-farm-map',
  templateUrl: './farm-map.component.html',
  styleUrls: ['./farm-map.component.scss']
})
export class FarmMapComponent implements OnInit {
  @ViewChild('mapRef', { static: true }) mapElement: ElementRef;
  private google_api_key = 'AIzaSyDx_dMfo0VnR_2CsF_wNw9Ayjd_HO6sMB0';
  public loading = false;
  public url;
  public statusRegando=false;
  public dialog;
  public today = Date.now();
  public zones: any[] = [];
  public farm: any=null;
  public farms: any[] = [];
  public weatherStation: any = null;
  public closeResult: string;
  public clima: any; 

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
      this.farm=this.getFarm(this._route.snapshot.paramMap.get('id'));      
      this.wiseconnService.farmId=this.farm.id;
      if(this.farm){
        if(localStorage.getItem("lastFarmId")!=undefined){
          if(parseInt(localStorage.getItem("lastFarmId"))==parseInt(this.farm.id)){
            this.zones = JSON.parse(localStorage.getItem('lastZones'));
            this.loadMap();
            let polygonDatas=JSON.parse(localStorage.getItem('lastPolygonData'));
            let map=new window['google'].maps.Map(this.mapElement.nativeElement, JSON.parse(localStorage.getItem('lastMapData')));
            if(polygonDatas){
              for (var i = 0; i < polygonDatas.length; i++) {
                var Triangle = new window['google'].maps.Polygon(polygonDatas[i].data);
                Triangle.setMap(map);
                this.addListenersOnPolygon(Triangle,polygonDatas[i].element.id);
                let id= polygonDatas[i].element.id_wiseconn?polygonDatas[i].element.id_wiseconn:polygonDatas[i].element.id;
                if (parseInt(id) == 727 || parseInt(id) == 6054 || parseInt(id) == 13872){
                  // Marker Image          
                  this.addMarkerImage(map, polygonDatas[i].element, "https://i.imgur.com/C7gyw7N.png");
                }else if (polygonDatas[i].element.status!=undefined){
                  if((polygonDatas[i].element.status).toLowerCase() == "executed ok") {            
                      // Marker Image          
                      // this.addMarkerImage(map, polygonDatas[i].element, "../../assets/icons/map/Ok-01.svg");
                  }else if((polygonDatas[i].element.status).toLowerCase() == "running"){
                    // Marker Image          
                    this.addMarkerImage(map, polygonDatas[i].element,  "../../assets/icons/map/Regando-01.svg"); 
                  }
                } 
              }
            }else{
                Swal.fire({icon: 'error',title: 'Oops...',text: 'Valores de poligonos no encontrados'});
            }             
          }else{
            this.getZones();
          }
        }else{
          this.getZones();
        }
        this.getWeather();
      }else{
        Swal.fire({icon: 'error',title: 'Oops...',text: 'Farm no existente'});
      }    
    });
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
  setLocalStorageItem(key,value){
    localStorage.setItem(key,value);
  }
  getZones() {
    this.loading = true;
    this.wiseconnService.getZones(this.farm.id).subscribe((response: any) => {
      this.loading = false; 
      this.zones = response.data?response.data:response;
      this.setLocalStorageItem("lastFarmId",this.farm.id);
      this.setLocalStorageItem("lastZones",this.getJSONStringify(this.zones));
      this.loadMap();
    });
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
          switch ((zone.type.length)) {
            case 1:
            tooltip.innerHTML = zone.name + " - "+zone.type[0];
            break;
            case 2:
            tooltip.innerHTML = zone.name + " - "+ zone.type[0]+" , "+ zone.type[1];
            break;
            case 3:
            tooltip.innerHTML = zone.name + " - "+ zone.type[0]+" , "+ zone.type[1]+" , "+ zone.type[2];
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
    }
  }
  loadMap() {
    if (this.zones.length == 0) {
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
    this.zones.forEach(element => {
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
          this.setLocalStorageItem("lastPolygonData",JSON.stringify(polygonDatas));
          // Marker Image          
          this.addMarkerImage(map, element, "https://i.imgur.com/C7gyw7N.png");
          Triangle.setMap(map);
          this.addListenersOnPolygon(Triangle, element.id);   
        } else {
          if (data != "") {
            if (data[0].status == "Executed OK") {
              this.zones.map((zone)=>{
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
              this.setLocalStorageItem("lastPolygonData",JSON.stringify(polygonDatas));
              // Marker Image          
              // this.addMarkerImage(map, element, "../../assets/icons/map/Ok-01.svg");
              Triangle.setMap(map);
              this.addListenersOnPolygon(Triangle, element.id);
            } else {
              if (data[0].status == "Running") {
                this.zones.map((zone)=>{
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
                this.setLocalStorageItem("lastPolygonData",JSON.stringify(polygonDatas));
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
                this.setLocalStorageItem("lastPolygonData",JSON.stringify(polygonDatas));
              }
            }
          }
        }
      });
    });
  }
  open(content, sizeValue) {
    this.modalService.open(content, {size: sizeValue} );
  }
  onSelect(select: string, id: number) {
    switch (select) {
      case "farm":
        this.farm=this.getFarm(id);
        this.wiseconnService.farmId=this.farm.id;
        this.getZones();
        this.getWeather();
        break;
      default:
        break;
    }
  } 
  //por refactorizar
  renderMap() {
    window['initMap'] = () => {
      this.loadMap();
    }
    if (!window.document.getElementById('google-map-script')) {
    } else {
      this.loadMap();
    }
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