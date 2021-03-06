import { Component, OnInit,ViewChild,ElementRef   } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WiseconnService } from 'app/services/wiseconn.service';
import { element } from 'protractor';
import { NgbModal, NgbDate,NgbCalendar } from '@ng-bootstrap/ng-bootstrap';


import { WeatherService } from 'app/services/weather.service';

import * as Chartist from 'chartist';
import * as moment from "moment";

@Component({
  selector: 'app-farm-map',
  templateUrl: './farm-map.component.html',
  styleUrls: ['./farm-map.component.scss']
})
export class FarmMapComponent implements OnInit {
  @ViewChild('mapRef', {static: true }) mapElement: ElementRef;
  private google_api_key = 'AIzaSyDx_dMfo0VnR_2CsF_wNw9Ayjd_HO6sMB0';
  public loading = false;
  public id = 0;
  public url;
  public mediciones;
  public zones:any[]=[];
  public weatherStation:any=null;
  closeResult: string;
  clima: any;

  //rango de fechas para graficas
  public fromDate: NgbDate;
  public toDate: NgbDate;
  public dateRange:any=null;
  //graficas
  public temperatureId:number=null;
  public humidityId:number=null;
  public lineChart:any={
    labels:[],
    series:[[],[]]
  }
  constructor(
    private _route: ActivatedRoute,
    private wiseconnService: WiseconnService, 
    public modalService: NgbModal,
    private router: Router, 
    public weatherService: WeatherService,
    private calendar: NgbCalendar,) { }
  ngOnInit() {
    //rango de fechas para graficas
    this.fromDate = this.calendar.getNext(this.calendar.getToday(), 'd', -2);
    this.toDate = this.calendar.getToday();
    this.dateRange={
      initTime:moment(this.fromDate.year+"-"+this.fromDate.month+"-"+this.fromDate.day).format("YYYY-MM-DD"),
      endTime:moment(this.toDate.year+"-"+this.toDate.month+"-"+this.toDate.day).format("YYYY-MM-DD")
    };
    this.loading = true;
    this.wiseconnService.getZones(this._route.snapshot.paramMap.get('id')).subscribe((data: any) => {      
      this.loading = false; 
      this.zones=data;
      for (var i = this.zones.length - 1; i >= 0; i--) {      
        if(this.zones[i].name==="Estación Meteorológica" && this.zones[i].type.map((element)=>{return element=="Weather"})[0]){
          this.weatherStation=this.zones[i];
          this.wiseconnService.getMeasuresOfZones(this.weatherStation.id).subscribe((data) => {
            let temperatureFlag,humidityFlag=false;
            for (var i = data.length - 1; i >= 0; i--) {
              if(data[i].sensorType==="Temperature"){
                this.temperatureId=data[i].id;
              }
              if(data[i].sensorType==="Humidity"){
                this.humidityId=data[i].id;
              }
              if(this.temperatureId&&this.humidityId){
                this.wiseconnService.getDataByMeasure(this.temperatureId,this.dateRange).subscribe((data) => {
                  let temperatureData=data;
                  console.log("temperatureData:",temperatureData);
                  this.wiseconnService.getDataByMeasure(this.humidityId,this.dateRange).subscribe((data) => {
                    let humidityData=data;
                    console.log("humidityData:",humidityData);
                    for (var i = temperatureData.length - 1; i >= 0; i--) {
                      if(this.lineChart.labels.filter((element) => {
                        return element == moment(temperatureData[i].time).format("YYYY-MM-DD");
                      }).length==0){
                        this.lineChart.labels.push(moment(temperatureData[i].time).format("YYYY-MM-DD"));                     
                      }
                      this.lineChart.series[0].push(temperatureData[i].value);                      
                      if(i==0){
                        this.renderCharts();
                      }
                    }
                    for (var i = humidityData.length - 1; i >= 0; i--) {
                      if(this.lineChart.labels.filter((element) => {return element == moment(humidityData[i].time).format("YYYY-MM-DD")}).length==0){
                        this.lineChart.labels.push(moment(humidityData[i].time).format("YYYY-MM-DD"));
                        
                      }
                      this.lineChart.series[1].push(humidityData[i].value);
                      console.log("this.lineChart:",this.lineChart);
                      if(i==0){
                        this.renderCharts();
                      }
                    }
                  });
                });
              }
            }
          });
        }
      }
      this.loadMap(data); 
    });
    let idFarm = (this._route.snapshot.paramMap.get('id'));
    this.wiseconnService.getFarm(idFarm).subscribe((data) => {
      console.log(data);
      this.weatherService;
      const q = [data.latitude, data.longitude];
      const key = "67a49d3ba5904bef87441658192312";
      console.log(q);
      this.weatherService.getWeather(key,q).subscribe((weather) => {
        this.clima = (weather.data.weather);
        // var clima2 = weather.data.current_condition[0];
        // this.climaRes.push({ name: 'temp_C' , value: clima2.temp_C });
        // this.climaRes.push({ name: 'temp_F' , value: clima2.temp_F });
        console.log(weather.data.weather);
      });
        console.log(data['account']['id']);
        switch (data['account']['id']) { 
          case 63:
            this.url="https://cdtec.irrimaxlive.com/?cmd=signin&username=cdtec&password=l01yliEl7H#/u:3435/Campos/Agrifrut";
            break;
          case 395:
            this.url="https://cdtec.irrimaxlive.com/?cmd=signin&username=cdtec&password=l01yliEl7H#/u:3507/Campos/Agricola%20Santa%20Juana%20de%20Chincolco";
            break;
          default:
            this.url="";
        } console.log(this.url);
    });
  }
  renderLineChart(){
    new Chartist.Line('.ct-chart.line-chart', {
      labels: this.lineChart.labels,
      series: this.lineChart.series
    }, {
      fullWidth: true,
      chartPadding: {
        right: 40
      }
    });
  }
  renderBarChart(){
    new Chartist.Bar('.ct-chart.bar-chart', {
      labels: ['Jan', 'Feb', 'Mar', 'Apr'],
      series: [
      [5, 4, 3, 7]
      ]
    }, {
      seriesBarDistance: 10,
      axisX: {
        offset: 60
      },
      axisY: {
        offset: 80,
        labelInterpolationFnc: function(value) {
          return value + ' CHF'
        },
        scaleMinSpace: 15
      }
    });

  }
  renderCharts(){
    this.renderLineChart();
    this.renderBarChart();
  }
  renderMap() {
    
    window['initMap'] = () => {
      this.loadMap(null);     
    }
    if(!window.document.getElementById('google-map-script')) {
    } else {
      this.loadMap(null);
    }
  }
  loadMap = (data) => {
    if(data.length == 0){
      var map = new window['google'].maps.Map(this.mapElement.nativeElement, {
        center: {lat: -32.89963602180464, lng: -70.90243510967417},
        zoom:15,
        mapTypeId: window['google'].maps.MapTypeId.HYBRID
      });
    }else{
      var map = new window['google'].maps.Map(this.mapElement.nativeElement, {
        center: {lat: data[10].polygon.path[0].lat, lng: data[10].polygon.path[0].lng},
        zoom:15,
        mapTypeId: window['google'].maps.MapTypeId.HYBRID
      });
    }
    
    //Funcion de Click
      var wisservice = this.wiseconnService;
      var redirect =  this.router;
      var zones =this.zones;
    var addListenersOnPolygon = function(polygon,id) {
      //this.loading = true;
      let zone=zones.filter(element => element.id==id)[0];
      window['google'].maps.event.addListener(polygon, 'mouseover', (event) => {
        let map=document.getElementById("map-container").firstChild;
        let tooltip= document.createElement("span");
        tooltip.id='tooltip-text';
        tooltip.style.backgroundColor= '#777777';
        tooltip.style.color= '#FFFFFF';
        tooltip.style.left= event.tb.offsetX+'px';
        tooltip.style.top= event.tb.offsetY+'px';
        tooltip.style.padding= '10px 20px';
        tooltip.style.position= 'absolute';
        tooltip.innerHTML= zone.name;
        map.appendChild(tooltip);
      });
      window['google'].maps.event.addListener(polygon, 'mouseout', (event) => {
        let map=document.getElementById("map-container").firstChild;
        let tooltip= document.getElementById("tooltip-text");
        if(tooltip)
          map.removeChild(tooltip);
      });
      window['google'].maps.event.addListener(polygon, 'click', () => {
     //   var ids = 0;

   //     this.ids = id;
    //   this.obtenerMedidas(id);
       wisservice.getMeasuresOfZones(id).subscribe((data: any) => {     
       wisservice.getIrrigarionsRealOfZones(id).subscribe((dataIrrigations: any) => {
          redirect.navigate(['/farmpolygon', data[0].farmId, id]);

        //     alert('ID Sector: '+id+'\nfarmId: '+data[0].farmId+ '\nESTATUS: '+dataIrrigations[0].status+
        //   '\nZone ID: '+data[0].zoneId+
        //   '\nName: '+data[0].name+' \nUnit: '+data[0].unit+ '\nLast Data: '+data[0].lastData+
        //   '\nLast Data Date: '+data[0].lastDataDate+'\nMonitoring Time: '+data[0].monitoringTime+
        //   '\nSenson Depth: '+data[0].sensorDepth+'\nDepth Unit: '+data[0].depthUnit+
        //   '\nNode ID: '+data[0].nodeId//'\nExpansion Port: '+data[0].physicalConnection.expansionPort+
        // // // '\nExpansionBoard: '+data[0].physicalConnection.expansionBoard+
        // //  //'\nNode Port: '+data[0].physicalConnection.nodePort+'\nSensor Type: '+data[0].sensorType
        //   );
     })
        });
      });  
    }
 
    // var marker = new window['google'].maps.Marker({
    //   position: {lat: -32.232403, lng: -70.827825},
    //   map: map,
    //   title: 'Hello World!',
    //   draggable: true,
    //   animation: window['google'].maps.Animation.DROP,
    // });
    
    var contentString = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h3 id="thirdHeading" class="thirdHeading">W3path.com</h3>'+
    '<div id="bodyContent">'+
    '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>'+
    '</div>'+
    '</div>';

    var flightPlanCoordinates = [
      {lat: -32.90045576247285, lng: -70.90006940132304},
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
    
      // marker.addListener('click', function() {
      //   infowindow.open(map, marker);
      // });
    data.forEach(element => {
      // Construct the polygon.
      wisservice.getIrrigarionsRealOfZones(element.id).subscribe((dataIrrigations: {}) => {
        if(element.id == "727" || element.id== 727 || element.id == "6054" || element.id == 6054 || element.id == "13872" || element.id == 13872){
          var Triangle = new window['google'].maps.Polygon({
            paths: element.polygon.path,
            strokeColor: '#E5C720',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#E5C720',
            fillOpacity: 0.35,
          });
          Triangle.setMap(map);
         addListenersOnPolygon(Triangle, element.id);
         this.loading = true;
         wisservice.getMeterogoAgrifut(element.id).subscribe((data: {}) => { 
          this.loading = false;
              console.log(data);
           this.mediciones=data;   
         });
        }else{
        
        if(dataIrrigations[0].status == "Executed OK"){
          var Triangle = new window['google'].maps.Polygon({
            paths: element.polygon.path,
            strokeColor: '#49AA4F',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#49AA4F',
            fillOpacity: 0.35,
          });
          Triangle.setMap(map);
         addListenersOnPolygon(Triangle, element.id);
        }else{
          if(dataIrrigations[0].status == "Running"){
            var Triangle = new window['google'].maps.Polygon({
              paths: element.polygon.path,
              strokeColor: '#419FD5',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#419FD5',
              fillOpacity: 0.35,
            });
            Triangle.setMap(map);
            addListenersOnPolygon(Triangle, element.id);
          }else{
            var Triangle = new window['google'].maps.Polygon({
              paths: element.polygon.path,
              strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#FF0000',
              fillOpacity: 0.35,
            });
            Triangle.setMap(map);
            addListenersOnPolygon(Triangle, element.id);
          //  var map2 = new window['google'].maps.Map(this.mapElement.nativeElement, {          
         //     center: {lat: element.polygon.path[0].lat, lng: element.polygon.path[0].lng},
         //     zoom:15
         //   });
          }
        }
      }
      });
      
      
    });
  }
  obtenerMedidas(id){
    this.wiseconnService.getMeasuresOfZones(this.id).subscribe((data: {}) => {      
    })
  }
  open(content) {
    this.modalService.open(content);
  }
}
