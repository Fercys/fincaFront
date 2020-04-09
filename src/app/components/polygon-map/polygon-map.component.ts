import { Component, Input, ViewChild, ElementRef,OnChanges, SimpleChanges, SimpleChange} from '@angular/core';

//notificaciones
import Swal from 'sweetalert2';

//services
import { WiseconnService } from 'app/services/wiseconn.service';
@Component({
  selector: 'app-polygon-map',
  templateUrl: './polygon-map.component.html',
  styleUrls: ['./polygon-map.component.scss']
})
export class PolygonMapComponent implements OnChanges {
	  @Input() zones:any;
  	@ViewChild('mapElement', { static: true }) mapElement: ElementRef;
  	public statusRegando:boolean=false;
  	constructor(
    private wiseconnService: WiseconnService,) { }

  	ngOnChanges(changes: SimpleChanges) {
  		const zonesCurrentValue: SimpleChange = changes.zones.currentValue;
      console.log("zonesCurrentValue:",zonesCurrentValue)
  		this.zones=zonesCurrentValue;
  		this.loadMap();
  	}
  	//carga de mapa
  	loadMap() {
	    if (this.zones.length == 0) {
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
            let runningElement=data.find(element =>{return element.status == "Running"});
            if (runningElement==undefined) { //status 'ok'
              this.zones.map((zone)=>{
                if(zone.id==element.id||zone.id_wiseconn==element.id){
                  element.status=data[0].status
                }
                return element;
              });
              let path=element.polygon?element.polygon.path:element.path;
              let polygonData={
                paths: path,
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
              if(runningElement) { //status 'running'
                this.zones.map((zone)=>{
                  if(zone.id==element.id||zone.id_wiseconn==element.id){
                    element.status=runningElement.status
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
  getPathData(element:string){
    let pathData=[];
    let i=this.zones.length>=10?10:this.zones.length; 
    let pathFound=false;
    if(this.zones.length>=1){
      switch (element) {
        case "lat":
          while(i>=0 && !pathFound){
            console.log("i:",i)
            console.log("this.zones[i]:",this.zones[i])
            if(this.zones[i]){
              if(this.zones[i].polygon!=undefined && this.zones[i].polygon.path.length>0){
                pathFound=true;
                pathData=this.zones[i].polygon.path[0].lat;
              }else if(this.zones[i].path!=undefined && this.zones[i].path.length>0){
                pathFound=true;
                pathData=this.zones[i].path[0].lat;
              }
            }
            i--;
          }          
          break;
        case "lng":
          while(i>=0 && !pathFound){
            if(this.zones[i]){
              if(this.zones[i].polygon!=undefined && this.zones[i].polygon.path.length>0){
                pathFound=true;
                pathData=this.zones[i].polygon.path[0].lng;
              }else if(this.zones[i].path!=undefined && this.zones[i].path.length>0){
                pathFound=true;
                pathData=this.zones[i].path[0].lng;
              }

            }
            i--;
          }
          break;
        default:
          break;
      }
    }
    return pathData;
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
  setLocalStorageItem(key,value){
    localStorage.setItem(key,value);
  }
  addListenersOnPolygon(polygon, id){
    let tooltip = document.createElement("span");
    let mapContainer = document.getElementById("map-container")?document.getElementById("map-container").firstChild:null;
    if(mapContainer){
      let zone = this.zones.find(element =>{
        if(element.id == id || element.id_wiseconn == id){
          return element;
        }
      });
      window['google'].maps.event.addListener(polygon, 'mouseover', (event) => {        
        tooltip.id = 'tooltip-text';
        tooltip.style.backgroundColor = '#777777';
        tooltip.style.color = '#FFFFFF';        
        if(zone && zone.status!=undefined){
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
    }
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
}
