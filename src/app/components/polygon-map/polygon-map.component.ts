import { Component, Input, ViewChild, ElementRef, OnInit, OnChanges, SimpleChanges, SimpleChange} from '@angular/core';
import {  NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

//notificaciones
import Swal from 'sweetalert2';
//moment
import * as moment from "moment";

//services
import { WiseconnService } from 'app/services/wiseconn.service';
@Component({
  selector: 'app-polygon-map',
  templateUrl: './polygon-map.component.html',
  styleUrls: ['./polygon-map.component.scss']
})
export class PolygonMapComponent implements OnInit,OnChanges {
	  @Input() zones:any;
    @Input() showCustomControl:boolean;
  	@ViewChild('mapElement', { static: true }) mapElement: ElementRef;

    //rango de fechas para graficas
    public fromDate: NgbDate;
    public toDate: NgbDate;
    public dateRange: any = null;
    public trianglesRef:any[]=[];
  	public statusRegando:boolean=false;
    public loading:boolean=false;
    public percentage:number=null;
    public intPercentage:string='0%';
  	constructor(
      private calendar: NgbCalendar, 
      private wiseconnService: WiseconnService,) { }
    ngOnInit(){
      this.fromDate = this.calendar.getNext(this.calendar.getToday(), 'd', -7);
      this.toDate = this.calendar.getToday();
    }
  	ngOnChanges(changes: SimpleChanges) {
  		const zonesCurrentValue: SimpleChange = changes.zones.currentValue;
  		this.zones=zonesCurrentValue;
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
  		  this.loadMap();
      }
  	}
  	//carga de mapa
  	loadMap() {
      if(this.fromDate&&this.toDate){
        this.dateRange = {
          initTime: moment(this.fromDate.year + "-" + this.fromDate.month + "-" + this.fromDate.day).format("YYYY-MM-DD"),
          endTime: moment(this.toDate.year + "-" + this.toDate.month + "-" + this.toDate.day).format("YYYY-MM-DD")
        };        
      }
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
      if(this.showCustomControl){
        this.addCustomControl(map,this.mapElement);
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
      if(localStorage.getItem('lastPolygonData')&&localStorage.getItem('lastMapData')){
        let lastMapData=null; let lastPolygonData=null;
        if(localStorage.getItem("lastMapData")){
          lastMapData=JSON.parse(localStorage.getItem("lastMapData"));
        }
        if(localStorage.getItem("lastPolygonData")){
          lastPolygonData=JSON.parse(localStorage.getItem("lastPolygonData"));
        }
        var map = new window['google'].maps.Map(this.mapElement.nativeElement,lastMapData);
        for (let polygon of lastPolygonData) {
          let marker=null;
          var Triangle = new window['google'].maps.Polygon(polygon.data);
          if(polygon.markerImg){
            marker=this.addMarkerImage(map, polygon.element, polygon.markerImg);
          }
          Triangle.setMap(map);
          if(polygon.marker){
            polygon.marker.setMap(map);
          }
          this.addListenersOnPolygon(Triangle, polygon.element.id);
          this.trianglesRef.push({triangle:Triangle,element:polygon.element,marker:marker});
        }
        if(this.showCustomControl){
          this.addCustomControl(map,this.mapElement);
        }
        this.intPercentage='100%';
      }else{
        let polygonDatas=[];
        this.loading=true;
        let i=0;
        let zonesWithPaths=this.zones.filter(element=>{
          if(element.path.length>0){
            return element;
          }
        });
        for(let element of zonesWithPaths){
          // Construct the polygon.
          //prueba con wiseconn
          //wisservice.getIrrigarionsRealOfZones(element.id_wiseconn,this.dateRange).subscribe((response: any) => {
          //prueba local
          wisservice.getIrrigarionsRealOfZones(element.id,this.dateRange).subscribe((response: any) => {
            let data=response.data?response.data:response;
            let id= element.id_wiseconn?element.id_wiseconn:element.id;
              if (data.length>0) {
                let runningElement=data.find(element =>{return element.status == "Running"});
                if (runningElement==undefined) { //status 'ok'
                  zonesWithPaths.map((zone)=>{
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
                  // Marker Image          
                  // let marker=this.addMarkerImage(map, element, "../../assets/icons/map/Ok-01.svg");
                  let marker=null;
                  polygonDatas.push({element:element,data:polygonData,markerImg:null});
                  this.setLocalStorageItem("lastPolygonData",JSON.stringify(polygonDatas));
                  Triangle.setMap(map);
                  this.addListenersOnPolygon(Triangle, element.id);
                  this.trianglesRef.push({triangle:Triangle,element:element,marker:marker});
                } else {
                  if(runningElement) { //status 'running'
                    zonesWithPaths.map((zone)=>{
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
                    let marker=this.addMarkerImage(map, element,  "../../assets/icons/map/Regando-01.svg");                  
                    polygonDatas.push({element:element,data:polygonData,markerImg:"../../assets/icons/map/Regando-01.svg"});
                    this.setLocalStorageItem("lastPolygonData",JSON.stringify(polygonDatas));
                     // Marker Image
                    Triangle.setMap(map);
                    this.addListenersOnPolygon(Triangle,element.id);
                    this.trianglesRef.push({triangle:Triangle,element:element,marker:marker});
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
                    let marker=null;
                    polygonDatas.push({element:element,data:polygonData,markerImg:null});
                    this.setLocalStorageItem("lastPolygonData",JSON.stringify(polygonDatas));
                    this.trianglesRef.push({triangle:Triangle,element:element,marker:marker});
                  }
                }
              }
            i++;
            this.percentage=(i/zonesWithPaths.length)*100;
            this.intPercentage=Math.round(this.percentage)+"%";
            if(i==zonesWithPaths.length){
              this.loading=false;
            }
          },
          error=>{
            this.intPercentage="100%";
            this.loading=false;
          });
        }
      }
    
  }

  getPathData(element:string){
    let pathData=[];
    let i=this.zones.length>=10?10:this.zones.length; 
    let pathFound=false;
    if(this.zones.length>=1){
      switch (element) {
        case "lat":
          while(i>=0 && !pathFound){
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
          if(zone && zone.name!=undefined){
            tooltip.innerHTML = zone.name;
          }
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
    let marker; 
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
      marker = new window['google'].maps.Marker({
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
    return marker;
    
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
  addCustomControl(map:any,mapElement:any){
    // Create the DIV to hold the control and call the CenterControl()
        // constructor passing in this DIV.
      let trianglesRef=this.trianglesRef;
      const controls=["General","Clima","Suelo", "Riego"];
      for (var control of controls) {
        var centerControlDiv = document.createElement('div');
        var centerControl = new this.centerControl(centerControlDiv, map,control, mapElement,trianglesRef);
        
         map.controls[window['google'].maps.ControlPosition.LEFT_CENTER].push(centerControlDiv);
       }
  }
  centerControl(controlDiv, map, control,mapElement,trianglesRef) {
          // Set CSS for the control border.
          var controlUI = document.createElement('div');
          controlUI.style.backgroundColor = control=='General'?'#018fff':'#fff';
          controlUI.style.border = '2px solid #fff';
          controlUI.style.borderRadius = '3px';
          controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
          controlUI.style.cursor = 'pointer';
          controlUI.style.marginBottom = '10px';
          controlUI.style.marginLeft = '10px';
          controlUI.style.textAlign = 'center';
          controlUI.classList.add('control-ui');
          controlUI.title = control;
          controlDiv.appendChild(controlUI);

          // Set CSS for the control interior.
          var controlText = document.createElement('div');
          controlText.style.color = control=='General'?'#fff':'#000';
          controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
          controlText.style.fontSize = '10px';
          controlText.style.lineHeight = '15px';
          controlText.style.paddingLeft = '5px';
          controlText.style.paddingRight = '5px';
          controlText.innerHTML = control;
          controlUI.appendChild(controlText);

          // Setup the click event listeners: simply set the map to Chicago.
          controlText.addEventListener('click', function() {
            var controlsUI:any= document.getElementsByClassName("control-ui");
            for (var controlUI of controlsUI) {
              controlUI.style.backgroundColor='#fff';
              controlUI.children[0].style.color="#000";
            }
            this.style.color="#fff"
            this.parentElement.style.backgroundColor="#018fff"
            let lastPolygonData=null;
            let polygonData=null;
            let mapData=null; 
            if(localStorage.getItem("lastPolygonData")){
              lastPolygonData=JSON.parse(localStorage.getItem("lastPolygonData"));
            }
            if(localStorage.getItem("lastMapData")){
              mapData=JSON.parse(localStorage.getItem("lastMapData"));
            }
            if(lastPolygonData && mapData){
              switch ((control).toLowerCase()) {
                  case "general":
                      if(lastPolygonData){
                        for (var triangleRef of trianglesRef){
                          triangleRef.triangle.setMap(map);
                          if(triangleRef.marker){
                            triangleRef.marker.setMap(map);
                          }
                        }
                      }
                    break;
                  case "clima":
                        for (var triangleRef of trianglesRef){
                          if(triangleRef.element.type.find(element=>element.description=="Weather")!=undefined){
                            triangleRef.triangle.setMap(map);
                            if(triangleRef.marker){
                              triangleRef.marker.setMap(map);
                            }
                          }else{
                            triangleRef.triangle.setMap(null);
                            if(triangleRef.marker){
                              triangleRef.marker.setMap(null);
                            }
                          }
                        }
                    break;
                  case "suelo":
                        for (var triangleRef of trianglesRef){
                          if(triangleRef.element.type.find(element=>element.description=="Soil")!=undefined){
                            triangleRef.triangle.setMap(map);
                            if(triangleRef.marker){
                              triangleRef.marker.setMap(map);
                            }
                          }else{
                            triangleRef.triangle.setMap(null);
                            if(triangleRef.marker){
                              triangleRef.marker.setMap(null);
                            }
                          }
                        }
                    break;                
                  case "riego":
                    for (var triangleRef of trianglesRef){
                      if(triangleRef.element.type.find(element=>element.description=="Irrigation")!=undefined){
                        triangleRef.triangle.setMap(map);
                        if(triangleRef.marker){
                          triangleRef.marker.setMap(map);
                        }
                      }else{
                        triangleRef.triangle.setMap(null);
                        if(triangleRef.marker){
                          triangleRef.marker.setMap(null);
                        }
                      }
                    }
                    break;
                  default:
                    // code...
                    break;
                }  
            }
            
          });
        

      }
}
