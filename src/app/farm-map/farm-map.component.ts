import { Component, OnInit,ViewChild,ElementRef   } from '@angular/core';

@Component({
  selector: 'app-farm-map',
  templateUrl: './farm-map.component.html',
  styleUrls: ['./farm-map.component.scss']
})
export class FarmMapComponent implements OnInit {
  @ViewChild('mapRef', {static: true }) mapElement: ElementRef;
  private google_api_key = 'AIzaSyDx_dMfo0VnR_2CsF_wNw9Ayjd_HO6sMB0';
  constructor() { }

  ngOnInit() {
    //this.renderMap();
    this.loadMap();
  }
  renderMap() {
    
    window['initMap'] = () => {
      this.loadMap();     
    }
    if(!window.document.getElementById('google-map-script')) {
    } else {
      this.loadMap();
    }
  }
  loadMap = () => {
    var map = new window['google'].maps.Map(this.mapElement.nativeElement, {
      center: {lat: -33.4372, lng: -70.6506},
      zoom:7
    });
    //Funcion de Click
    var addListenersOnPolygon = function(polygon) {
      window['google'].maps.event.addListener(polygon, 'click', function (event) {
        alert('Hello World!');
      });  
    }
 
    var marker = new window['google'].maps.Marker({
      position: {lat: -33.4372, lng: -70.6506},
      map: map,
      title: 'Hello World!',
      draggable: true,
      animation: window['google'].maps.Animation.DROP,
    });
    
    var contentString = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h3 id="thirdHeading" class="thirdHeading">W3path.com</h3>'+
    '<div id="bodyContent">'+
    '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>'+
    '</div>'+
    '</div>';

    var flightPlanCoordinates = [
      {lat: 37.772, lng: -122.214},
      {lat: 21.291, lng: -157.821},
      {lat: -18.142, lng: 178.431},
      {lat: -27.467, lng: 153.027}
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
    
      marker.addListener('click', function() {
        infowindow.open(map, marker);
      });

          // Define the LatLng coordinates for the polygon's path.
    var triangleCoords = [
      {lat: -32.90045576247285, lng: -70.90006940132304},
      {lat: -32.89963602180464, lng: -70.90243510967417},
      {lat: -32.90179795883293, lng: -70.90349726444401},
      {lat: -32.90276180541499, lng: -70.90126030212565},
      {lat: -32.9021042289774, lng:  -70.90038590198674},
      {lat: -32.90105930295035, lng: -70.90128712421574}
    ];

    // Construct the polygon.
    var Triangle = new window['google'].maps.Polygon({
      paths: triangleCoords,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
    });
    Triangle.setMap(map);
    addListenersOnPolygon(Triangle);

    var triangleCoords = [
      {lat: -32.89964784520172, lng: -70.90245153787691},
      {lat: -32.90178275818888, lng: -70.90349223530211},
      {lat: -32.90155755883886, lng: -70.90408232128539},
      {lat: -32.901332358916164, lng: -70.90418960964598},
      {lat: -32.89887933165899, lng: -70.90472035240964}
    ];

    // Construct the polygon.
    var Triangle = new window['google'].maps.Polygon({
      paths: triangleCoords,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
    });
    Triangle.setMap(map);
    addListenersOnPolygon(Triangle);
  }
}
