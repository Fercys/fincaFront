import { Component, OnInit,ViewChild,ElementRef   } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WiseconnService } from 'app/services/wiseconn.service';
import { element } from 'protractor';
import { NgbModal,ModalDismissReasons , NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { WeatherService } from 'app/services/weather.service';

//graficas
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';

import * as Chartist from 'chartist';
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
  public mediciones;
  public clima;
  public climaRes: any = [];

  farmData: any;
  closeResult: string;
  status: any;
  idfarm: any;
  today = Date.now();
  hoveredDate: NgbDate;
  selectedValue: any = '1S';
  getZone: any;
  fromDate: NgbDate;
  toDate: NgbDate;
  requestChartBtn: boolean =true;
  weatherStationId: string = null;
  dateRange: any = null;
  dateRangeHistory:any[]=[]
  //graficas  
  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
  lineChartData: ChartDataSets[] = [
  { data: [], label: 'Temperatura' },
  { data: [], label: 'Humedad', yAxisID: 'y-axis-1' },
  ];
  lineChartLabels={
    labels:[],
    values:[]
  };
  lineChartOptions: (ChartOptions & { annotation: any }) = {
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
  lineChartColors: Color[] = [
  { // red
    backgroundColor:'rgba(255, 255, 255, 0.1)',
    borderColor:'rgba(255, 0, 0,1)',
    pointBackgroundColor:'rgba(255, 0, 0,1)',
    pointBorderColor:'#fff',
    pointHoverBackgroundColor:'#fff',
    pointHoverBorderColor: 'rgba(255, 0, 0,0.8)'
  },
  { // blue
    backgroundColor:'rgba(255, 255, 255, 0.1)',
    borderColor:'rgba(2,87,154,1)',
    pointBackgroundColor:'rgba(2, 87, 154,1)',
    pointBorderColor:'#fff',
    pointHoverBackgroundColor:'#fff',
    pointHoverBorderColor:'rgba(2,87,154,0.8)'
  }
  ];
  lineChartLegend = true;
  lineChartType = 'line';
  lineChartPlugins = [pluginAnnotations];


  temperatureId: number = null;
  humidityId: number = null;
  renderLineChartFlag : boolean = false;
  //bar chart
  barChartOptions: ChartOptions = {
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
  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [
  { data: [], label: 'Precipitación (mm)' }, 
  { data: [], label: 'Et0 (mm)' },
  { data: [], label: 'Velocidad de viento' },
  { data: [], label: 'Dirección de viento' },
  { data: [], label: 'Radiación' }  
  ];
  windVelocityId: number = null;
  windDirectionId: number = null;
  rainId: number = null;
  et0Id: number = null;
  radiationId: number = null;
  renderBarChartFlag: boolean = false;

  times =[
  { value: '1D' , active: false},
  { value: '1S' , active: true},
  { value: '2S' , active: false},
  { value: '1M' , active: false},
  { value: '3M' , active: false},
  { value: '6M' , active: false},
  ]

  //Pronostico values
  climaLoading = false;
  climaToday: any;
  climaDay = [];
  climaIcon = [];
  climaMax = [];
  climaMin = [];
  
  constructor(
    private _route: ActivatedRoute,
    private wiseconnService: WiseconnService, 
    public modalService: NgbModal, 
    public weatherService: WeatherService,
    private calendar: NgbCalendar, 
    public formatter: NgbDateParserFormatter) {
  }
  ngOnInit() {
    this.loading = true;
    this.weatherStationId=this._route.snapshot.paramMap.get('farm');
    this.dateRangeByDefault();
    this.wiseconnService.getMeterogoAgrifut(this._route.snapshot.paramMap.get('farm'))
    .subscribe((response: any) => { 
      this.farmData = response.data?response.data:response; 
      this.wiseconnService.getZones(this._route.snapshot.paramMap.get('id')).subscribe((response: any) => {
        this.getZone = response.data?response.data:response; 
        this.getZone.forEach(element =>{
          let id= element.id_wiseconn?element.id_wiseconn:element.id;
          if(parseInt(id) == 727 || parseInt(id) == 6054 || parseInt(id) == 13872){
            this.wiseconnService.getMeterogoAgrifut(element.id).subscribe((response: any) => { 
              this.loading = false;
              this.mediciones=response.data?response.data:response; 
              for (const item of this.mediciones) {
                if(item.name == "Velocidad Viento"){
                  item.name = "Vel. Viento"
                }
                if(item.name == "Direccion de viento") {
                  item.name = "Dir. Viento"
                }
                if(item.name == "Radiacion Solar"){
                  item.name = "Rad. Solar"
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
            });
          }
        });
        // this.wiseconnService.getIrrigarionsRealOfZones(this._route.snapshot.paramMap.get('farm')).subscribe((dataIrrigations: any) => {
          // console.log(dataIrrigations)
          // this.idfarm = data[0].zoneId;
          // this.status = dataIrrigations[0].status;
          // this.idfarm = data[0].name;
          // this.idfarm = data[0].unit;
          // this.idfarm = data[0].lastData;
          // this.idfarm = data[0].lastDataDate;
          // this.idfarm = data[0].monitoringTime;
          // this.idfarm = data[0].sensorDepth;
          // this.idfarm = data[0].depthUnit;

          //     alert('ID Sector: '+id+'\nfarmId: '+data[0].farmId+ '\nESTATUS: '+dataIrrigations[0].status+
          //   '\nZone ID: '+data[0].zoneId+
          //   '\nName: '+data[0].name+' \nUnit: '+data[0].unit+ '\nLast Data: '+data[0].lastData+
          //   '\nLast Data Date: '+data[0].lastDataDate+'\nMonitoring Time: '+data[0].monitoringTime+
          //   '\nSenson Depth: '+data[0].sensorDepth+'\nDepth Unit: '+data[0].depthUnit+
          //   '\nNode ID: '+data[0].nodeId//'\nExpansion Port: '+data[0].physicalConnection.expansionPort+
          // // // '\nExpansionBoard: '+data[0].physicalConnection.expansionBoard+
          // //  //'\nNode Port: '+data[0].physicalConnection.nodePort+'\nSensor Type: '+data[0].sensorType
          //   );
          // })
          this.loadMap2(this.getZone); 
          this.wiseconnService.getFarm(this._route.snapshot.paramMap.get('id')).subscribe((response: any) => {
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
            this.renderCharts("line");
            this.renderCharts("bar");
            this.loading = false; 
          });
        });
    });    
  }
  loadMap2(data){
    this.weatherService;
    let idFarm = this._route.snapshot.paramMap.get('farm');
    let farmPolygon = data.find(function(element){
      return element['id'] == idFarm;
    });
    if(farmPolygon.latitude && farmPolygon.longitude){
      const q = [farmPolygon.latitude, farmPolygon.longitude];
      const key = "67a49d3ba5904bef87441658192312";
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
      if(farmPolygon.latitude == undefined && farmPolygon.latitude == undefined){
        var map = new window['google'].maps.Map(this.mapElement.nativeElement, {
          center: {lat:  farmPolygon.polygon.path[0].lat, lng: farmPolygon.polygon.path[0].lng},
          zoom:15,
          mapTypeId: window['google'].maps.MapTypeId.HYBRID
        });
      }else{
        var map = new window['google'].maps.Map(this.mapElement.nativeElement, {
          center: {lat: farmPolygon.latitude, lng: farmPolygon.longitude},
          zoom:15,
          mapTypeId: window['google'].maps.MapTypeId.HYBRID
        });
      } 
      var flightPath = new window['google'].maps.Polygon({
        paths: farmPolygon.polygon.path,
        strokeColor: '#49AA4F',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#49AA4F',
        fillOpacity: 0.35,
      });
      flightPath.setMap(map);
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No están cargada las coordenadas correctamente'
      })
    }     
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
        center: {
          lat: -32.89963602180464, 
          lng: -70.90243510967417
        },
        zoom:15
      });
    }else{
      let path=data[10].polygon?data[10].polygon.path[0]:data[10].path[0];
      var map = new window['google'].maps.Map(this.mapElement.nativeElement, {
        center: {
          lat: path.lat, 
          lng:path.lng
        },
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
        wisservice.getMeasuresOfZones(id).subscribe((data: any) => {     
          wisservice.getIrrigarionsRealOfZones(id).subscribe((dataIrrigations: any) => {

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
          let paths=element.path?element.path:element.polygon.path;
          wisservice.getIrrigarionsRealOfZones(idFarm).subscribe((dataIrrigations: any) => {
            if(idFarm == "727" || element.id== 727 || element.id == "6054" || element.id == 6054 || element.id == "13872" || element.id == 13872){
              var Triangle = new window['google'].maps.Polygon({
                paths: paths,
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
                this.mediciones=data;
              });
            }else{

              if(dataIrrigations[0].status == "Executed OK"){
                var Triangle = new window['google'].maps.Polygon({
                  paths: paths,
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
                    paths: paths,
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
                    paths: paths,
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
      deleteValueJson(value){
        var index:number = this.mediciones.indexOf(this.mediciones.find(x => x.name == value));
        if(index != -1) this.mediciones.splice(index, 1);
      }
      format(value:string,chart:string){
        switch (chart) {
          case "line":
          return moment.utc(value).format('DD') +" "+ moment(value).format('MMM');
          break;
          case "bar":
          return moment.utc(value).format('DD') +" "+ moment(value).format('MMM');
          break;
          default:
          return value;
          break;
        }
        
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
        this.requestDataChart();
      }
      goBack(){
        let lastElement=this.dateRangeHistory.pop();
        this.fromDate=lastElement.fromDate;
        this.toDate=lastElement.toDate;
        this.selectedValue=lastElement.selectedValue;
        this.times.map((element)=>{
          element.active=(element.value===this.selectedValue)?true:false;
          return element;
        });
        this.requestDataChart(true);
      }
      requestDataChart(goBackFlag:boolean=false){
        this.dateRange = {
          initTime: moment(this.fromDate.year + "-" + this.fromDate.month + "-" + this.fromDate.day).format("YYYY-MM-DD"),
          endTime: moment(this.toDate.year + "-" + this.toDate.month + "-" + this.toDate.day).format("YYYY-MM-DD")
        };
        if(!goBackFlag){          
          this.dateRangeHistory.push({
            fromDate:this.fromDate,
            toDate:this.toDate,
            selectedValue:this.selectedValue
          });
        }
        this.loading = true;
        this.wiseconnService.getMeasuresOfZones(this.weatherStationId).subscribe((response) => {
          let data=response.data?response.data:response;
          console.log("data:",data)
          for (var i = data.length - 1; i >= 0; i--) {
            //bar chart
            if (data[i].sensorType != undefined && data[i].name != undefined){
              if ((data[i].sensorType).toLowerCase() === "rain" && (data[i].name).toLowerCase() === "pluviometro") {
                this.rainId = data[i].id;
              }
            }
            if (data[i].sensorType != undefined && data[i].name != undefined){
              if ((data[i].sensorType).toLowerCase() === "wind velocity" && 
                ((data[i].name).toLowerCase() === "velocidad viento"||(data[i].name).toLowerCase() === "wind speed (period)")) {
                this.windVelocityId = data[i].id;
              }
            }
            if (data[i].sensorType != undefined && data[i].name != undefined){
              if ((data[i].sensorType).toLowerCase() === "wind direction" && 
                ((data[i].name).toLowerCase() === "direccion de viento"||(data[i].name).toLowerCase() === "wind direction")) {
                this.windDirectionId = data[i].id;
              }
            }
            if (data[i].sensorType != undefined && data[i].name != undefined){
              if ((data[i].sensorType).toLowerCase() === "solar radiation" && 
                ((data[i].name).toLowerCase() === "radiacion solar"||(data[i].name).toLowerCase() === "Solar radiation ")) {
                this.radiationId = data[i].id;
              }
            }
            if ((data[i].name) != undefined){
              if ((data[i].name).toLowerCase() === "et0") {
                this.et0Id = data[i].id;
              }
            }
            if(this.rainId&&this.et0Id&&this.windVelocityId&&this.windDirectionId&&this.radiationId){
              this.wiseconnService.getDataByMeasure(this.rainId,this.dateRange).subscribe((response) => {
                let rainData=response.data?response.data:response;
                this.wiseconnService.getDataByMeasure(this.et0Id,this.dateRange).subscribe((response) => {
                  let et0Data=response.data?response.data:response;
                  this.wiseconnService.getDataByMeasure(this.windVelocityId,this.dateRange).subscribe((response) => {
                    let windVelocityData=response.data?response.data:response;
                    this.wiseconnService.getDataByMeasure(this.windDirectionId,this.dateRange).subscribe((response) => {
                      let windDirectionData=response.data?response.data:response;
                      this.wiseconnService.getDataByMeasure(this.radiationId,this.dateRange).subscribe((response) => {
                        let radiationData=response.data?response.data:response;
                        this.loading = false;
                        rainData=rainData.map((element)=>{
                          element.chart="rain";
                          return element
                        })
                        et0Data=et0Data.map((element)=>{
                          element.chart="et0";
                          return element;
                        })
                        windVelocityData=windVelocityData.map((element)=>{
                          element.chart="windvelocity";
                          return element;
                        })
                        windDirectionData=windDirectionData.map((element)=>{
                          element.chart="winddirection";
                          return element;
                        })
                        radiationData=radiationData.map((element)=>{
                          element.chart="radiation";
                          return element;
                        })
                        let chartData=rainData.concat(et0Data.concat(windVelocityData.concat(windDirectionData.concat(radiationData))));
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
                        console.log("chartData:",chartData)
                        this.resetChartsValues("bar");
                        for (var i = 0; i < chartData.length; i++) {
                          if(chartData[i+1]&&chartData[i+2]&&chartData[i+3]&&chartData[i+4]){
                            if(chartData[i].time===chartData[i+1].time && chartData[i+1].time===chartData[i+2].time && chartData[i+2].time===chartData[i+3].time && chartData[i+3].time===chartData[i+4].time){
                              this.barChartLabels.push(this.format(chartData[i].time,"bar"));                    
                            }  
                          }
                          if(chartData[i].chart=="rain") {
                            this.barChartData[0].data.push(chartData[i].value);
                          }
                          if(chartData[i].chart=="et0") {
                            this.barChartData[1].data.push(chartData[i].value);
                          }
                          if(chartData[i].chart=="windvelocity") {
                            this.barChartData[2].data.push(chartData[i].value);
                          }
                          if(chartData[i].chart=="winddirection") {
                            this.barChartData[3].data.push(chartData[i].value);
                          }
                          if(chartData[i].chart=="radiation") {
                            this.barChartData[4].data.push(chartData[i].value);
                          }
                          this.renderCharts("bar");
                        }
                      });
                      
                    });
                    
                  });
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
      this.resetChartsValues("line");
      for (var i = 0; i < chartData.length; i++) {
        if(this.lineChartLabels.values.find((element) => {
          return element === chartData[i].time;
        }) === undefined) {
          this.lineChartLabels.values.push(this.format(chartData[i].time,null));
          this.lineChartLabels.labels.push(this.format(chartData[i].time,"line"));
        }
        if (chartData[i].chart==="temperature") {
          this.lineChartData[0].data.push(chartData[i].value);
        } 
        if(chartData[i].chart==="humidity"){
          this.lineChartData[1].data.push(chartData[i].value);
        }
        this.renderCharts("line");
      }
    });
  });
}else if(i==0){
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'No tiene configurado los sensores de humedad y temperatura'
  })
}
}
});
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
    this.renderBarChartFlag=true;            
    this.renderLineChartFlag=true;
    break;
  }
}
resetChartsValues(chart:string){
  switch (chart) {
    case "line":
    this.lineChartLabels.labels=[];
    this.lineChartLabels.values=[];
    this.lineChartData[0].data=[];
    this.lineChartData[1].data=[];
    break;  
    case "bar":
        this.barChartLabels=[];
        for (var i = 0; i < 5; i++) {
              this.barChartData[i].data=[];
            }
    break;
    default:
    // code...
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
}
