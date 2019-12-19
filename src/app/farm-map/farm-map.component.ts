import { Component, OnInit,ViewChild,ElementRef   } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WiseconnService } from 'app/services/wiseconn.service';
import { element } from 'protractor';

@Component({
  selector: 'app-farm-map',
  templateUrl: './farm-map.component.html',
  styleUrls: ['./farm-map.component.scss'],
})
export class FarmMapComponent implements OnInit {
  @ViewChild('mapRef', {static: true }) mapElement: ElementRef;
  private google_api_key = 'AIzaSyDx_dMfo0VnR_2CsF_wNw9Ayjd_HO6sMB0';
  public loading = false;
  public id = 0;
  
  constructor(private _route: ActivatedRoute,private wiseconnService: WiseconnService) { }
  ngOnInit() {
    //this.renderMap();
    this.loading = true;
    console.log(this._route.snapshot.paramMap.get('id'));
    this.wiseconnService.getZones(this._route.snapshot.paramMap.get('id')).subscribe((data: {}) => {      
      console.log(data); 
      this.loading = false; 
      this.loadMap(data); 
    })
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
    var map = new window['google'].maps.Map(this.mapElement.nativeElement, {
      center: {lat: -32.232403, lng: -70.827825},
      zoom:15
    });
    //Funcion de Click
    var wisservice = this.wiseconnService;
    var addListenersOnPolygon = function(polygon,id) {
      //this.loading = true;
      window['google'].maps.event.addListener(polygon, 'click', () => {
        console.log(id);
     //   var ids = 0;

   //     this.ids = id;
    //   this.obtenerMedidas(id);
       wisservice.getMeasuresOfZones(id).subscribe((data: {}) => {      
        console.log(data); 
       
        alert('ID Sector: '+id+'\nfarmId: '+data[0].farmId+ '\nZone ID: '+data[0].zoneId+
         '\nName: '+data[0].name+' \nUnit: '+data[0].unit+ '\nLast Data: '+data[0].lastData+
         '\nLast Data Date: '+data[0].lastDataDate+'\nMonitoring Time: '+data[0].monitoringTime+
         '\nSenson Depth: '+data[0].sensorDepth+'\nDepth Unit: '+data[0].depthUnit+
         '\nNode ID: '+data[0].nodeId+'\nExpansion Port: '+data[0].physicalConnection.expansionPort+
         '\nExpansionBoard: '+data[0].physicalConnection.expansionBoard+
         '\nNode Port: '+data[0].physicalConnection.nodePort+'\nSensor Type: '+data[0].sensorType);
      })
       
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
      {lat: -32.89963602180464, lng: -70.90243510967417},
      {lat: -32.90179795883293, lng: -70.90349726444401},
      {lat: -32.90276180541499, lng: -70.90126030212565},
      {lat: -32.9021042289774, lng:  -70.90038590198674},
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
      console.log(element.polygon.path);
      
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
    });
  }

  obtenerMedidas(id){
    console.log(id)
    this.wiseconnService.getMeasuresOfZones(this.id).subscribe((data: {}) => {      
      console.log(data); 
    })
  }
}
