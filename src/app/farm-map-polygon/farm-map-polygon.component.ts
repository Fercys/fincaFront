import { Component, OnInit,ViewChild,ElementRef   } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WiseconnService } from 'app/services/wiseconn.service';
import { element } from 'protractor';
import { NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { WeatherService } from 'app/services/weather.service';

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
  public mediciones;
  closeResult: string;
  status: any;
  idfarm: any;
  
  constructor(private _route: ActivatedRoute,private wiseconnService: WiseconnService, public modalService: NgbModal, public weatherService: WeatherService) { }
  ngOnInit() {
    //this.renderMap();
    this.loading = true;
    this.wiseconnService.getZones(this._route.snapshot.paramMap.get('id')).subscribe((data: {}) => {      
      this.loading = false; 
      console.log(this._route.snapshot.paramMap.get('farm'))
      this.wiseconnService.getMeterogoAgrifut(this._route.snapshot.paramMap.get('farm')).subscribe((data: {}) => { 
        this.loading = false;
            console.log(data);
         this.mediciones=data;   
       });
      this.wiseconnService.getIrrigarionsRealOfZones(this._route.snapshot.paramMap.get('farm')).subscribe((dataIrrigations: {}) => {
     //   console.log(dataIrrigations)
        this.idfarm = data[0].zoneId;
        this.status = dataIrrigations[0].status;
        this.idfarm = data[0].name;
        this.idfarm = data[0].unit;
        this.idfarm = data[0].lastData;
        this.idfarm = data[0].lastDataDate;
        this.idfarm = data[0].monitoringTime;
        this.idfarm = data[0].sensorDepth;
        this.idfarm = data[0].depthUnit;

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
      this.loadMap2(data); 
    });
    let idFarm = (this._route.snapshot.paramMap.get('id'));
    this.wiseconnService.getFarm(idFarm).subscribe((data: {}) => {
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
  loadMap2(data){
    this.weatherService;
    let idFarm = this._route.snapshot.paramMap.get('farm');
    let farmPolygon = data.find(function(element){
      return element['id'] == idFarm;
    }); 
    const q = [farmPolygon.latitude, farmPolygon.longitude];
    const key = "67a49d3ba5904bef87441658192312";
    console.log(q);
    this.weatherService.getWeather(key,q).subscribe((data: {}) => {
    console.log(data);
    });
    // console.log( farmPolygon.latitude, farmPolygon.longitude)

    var map = new window['google'].maps.Map(this.mapElement.nativeElement, {
      center: {lat: farmPolygon.latitude, lng: farmPolygon.longitude},
      zoom:15,
    });   
    var flightPath = new window['google'].maps.Polygon({
      paths: farmPolygon.polygon.path,
      strokeColor: '#49AA4F',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#49AA4F',
      fillOpacity: 0.35,
    });
    flightPath.setMap(map);
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
        zoom:15
      });
    }else{
      var map = new window['google'].maps.Map(this.mapElement.nativeElement, {
        center: {lat: data[10].polygon.path[0].lat, lng: data[10].polygon.path[0].lng},
        zoom:15
      });
    }
    
    //Funcion de Click
    var wisservice = this.wiseconnService;
    var addListenersOnPolygon = function(polygon,id) {
      //this.loading = true;
      window['google'].maps.event.addListener(polygon, 'click', () => {
     //   var ids = 0;

   //     this.ids = id;
    //   this.obtenerMedidas(id);
       wisservice.getMeasuresOfZones(id).subscribe((data: {}) => {     
       wisservice.getIrrigarionsRealOfZones(id).subscribe((dataIrrigations: {}) => {
       
          alert('ID Sector: '+id+'\nfarmId: '+data[0].farmId+ '\nESTATUS: '+dataIrrigations[0].status+
        '\nZone ID: '+data[0].zoneId+
        '\nName: '+data[0].name+' \nUnit: '+data[0].unit+ '\nLast Data: '+data[0].lastData+
        '\nLast Data Date: '+data[0].lastDataDate+'\nMonitoring Time: '+data[0].monitoringTime+
        '\nSenson Depth: '+data[0].sensorDepth+'\nDepth Unit: '+data[0].depthUnit+
        '\nNode ID: '+data[0].nodeId//'\nExpansion Port: '+data[0].physicalConnection.expansionPort+
       // '\nExpansionBoard: '+data[0].physicalConnection.expansionBoard+
        //'\nNode Port: '+data[0].physicalConnection.nodePort+'\nSensor Type: '+data[0].sensorType
        );
        
        
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
      let idFarm = this._route.snapshot.paramMap.get('id');
      wisservice.getIrrigarionsRealOfZones(idFarm).subscribe((dataIrrigations: {}) => {
        if(idFarm == "727" || element.id== 727 || element.id == "6054" || element.id == 6054 || element.id == "13872" || element.id == 13872){
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
