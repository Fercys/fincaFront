import { Component, OnInit,ViewChild,ElementRef   } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WiseconnService } from 'app/services/wiseconn.service';
import { element } from 'protractor';
import { NgbModal,ModalDismissReasons , NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { WeatherService } from 'app/services/weather.service';

import * as moment from "moment";
import Swal from 'sweetalert2'

//graficas
// tslint:disable-next-line:no-var-requires
const Highcharts = require('highcharts/highstock');
// tslint:disable-next-line:no-var-requires
require('highcharts/highmaps');
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);
require('highcharts/highcharts-more')(Highcharts);


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
  public farmData: any;
  public closeResult: string;
  public status: any;
  public idfarm: any;
  public today = Date.now();
  public hoveredDate: NgbDate;
  public selectedValue: any = '1S';
  public getZone: any;
  public fromDate: NgbDate;
  public toDate: NgbDate;
  public requestChartBtn: boolean =true;
  public weatherStationId: string = null;
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
  //linechart
  @ViewChild('lineChart', { static: true }) public lineChartElement: ElementRef;
  private lineChart;
  public lineChartData:any[]=[[],[]];
  public lineChartLabels:any[]=[];
  public lineChartOptions:any = {
      chart: {
          type: 'spline',

      },
      colors: ['#D12B34','#00B9EE'],
      title: {
          text: 'TEMPERATURA/HUMEDAD'
      },
      subtitle: {
          text: 'TEMPERATURA/HUMEDAD'
      },
      xAxis: [{
          categories: [],
          startOnTick: true,
          endOnTick: true,
      }],
       yAxis: [{ // left y axis
          title: {
              text: null
          },
          // tickInterval: 5,
          labels: {
              format: '{value:.,0f}'
          },
          showFirstLabel: false
      }, { // right y axis
        opposite: true,
        tickInterval: 5,
          labels: {
              format: '{value:.,0f}'
          },
          showFirstLabel: false
      }],
      plotOptions: {
          line: {
              dataLabels: {
                  enabled: false
              },
              enableMouseTracking: true,
          }
      },
      series: [{ 
          data: [], 
          name: 'Temperatura',
        type: 'line',
        //yAxis: 0 
        },{ 
          data: [], 
          name: 'Humedad',
        type: 'line', 
          yAxis: 1 
        }],
      tooltip: {
          shared: true,
          crosshairs: true
      },
  };
  public temperatureId: number = null;
  public humidityId: number = null;
  public renderLineChartFlag: boolean = false;
  //barchart
  @ViewChild('barChart', { static: true }) public barChartElement: ElementRef;
  private barChart;
  public barChartData:any[]=[[],[]];
  public barChartLabels:any[]=[];
  public barChartOptions:any = {
      chart: {
          type: 'column'
      },
      colors: ['#D12B34','#00B9EE'],
      title: {
          text: 'PRECIPITACIÓN/ET0'
      },
      subtitle: {
          text: 'PRECIPITACIÓN/ET0'
      },
      xAxis: {
          categories: [
          ],
          crosshair: true
      },
      yAxis: {
          // min: 0,
          title: {
              text:'PRECIPITACIÓN/ET0'
          }
      },
      tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
      },
      plotOptions: {
          column: {
              pointPadding: 0.2,
              borderWidth: 0
          }
      },
      series: [
          { type: undefined,name: 'Precipitación (mm)', data: [] }, 
          { type: undefined,name: 'Et0 (mm)', data: [] },
      ]
  };
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
    public weatherService: WeatherService,
    private calendar: NgbCalendar, 
    public formatter: NgbDateParserFormatter) {
  }
  ngOnInit() {
    this.loading = true;
    this.weatherStationId=this._route.snapshot.paramMap.get('farm');
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
            this.highchartsShow();
            this.loading = false; 
          });
        });
    });    
  }
  highchartsShow(){
    this.lineChartOptions.chart['renderTo'] = this.lineChartElement.nativeElement;
    this.lineChart = Highcharts.chart(this.lineChartOptions);
    this.barChartOptions.chart['renderTo'] = this.barChartElement.nativeElement;
    this.barChart = Highcharts.chart(this.barChartOptions);    
    this.dateRangeByDefault();
  }
  loadMap2(data){
    this.weatherService;
    let idFarm = this._route.snapshot.paramMap.get('farm');
    let farmPolygon = data.find(function(element){
      return element['id'] == idFarm;
    });
    if(farmPolygon.latitude && farmPolygon.longitude){
      const q = [farmPolygon.latitude, farmPolygon.longitude];
      const key = "7da96f2f52f54be7a1b123737202102";
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
      let path=farmPolygon.polygon?farmPolygon.polygon.path:farmPolygon.path;
      if(farmPolygon.latitude == undefined && farmPolygon.latitude == undefined){
        var map = new window['google'].maps.Map(this.mapElement.nativeElement, {
          center: {lat:  path[0].lat, lng: path[0].lng},
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
        paths: path,
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
        data.forEach(element => {
          // Construct the polygon.
          let idFarm = this._route.snapshot.paramMap.get('id');
          let paths=element.polygon?element.polygon.path:element.path;
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
      momentFormat(value:string,chart:string){
        switch (chart) {
          case "line":
              return moment.utc(value).format('DD') +" "+ moment.utc(value).format('MMM');
              break;
          case "bar":
              return moment.utc(value).format('DD') +" "+ moment.utc(value).format('MMM');
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
        this.resetChartsValues("line");
        this.resetChartsValues("bar");
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
        if(this.weatherStationId){
          this.loading = true;
          this.wiseconnService.getMeasuresOfZones(this.weatherStationId).subscribe((response) => {
            let data=response.data?response.data:response;
            let barFlag=false;
                    let lineFlag=false;
                    let j=0;
                    while (!lineFlag && j < data.length) {
                        //line chart
                        if (data[j].sensorType === "Temperature") {
                          this.temperatureId = data[j].id;
                        }
                        if (data[j].sensorType === "Humidity") {
                          this.humidityId = data[j].id;
                        }
                         if(this.temperatureId&&this.humidityId){
                              lineFlag=true;
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
                                    let hour=moment(element.time).hours();
                                    if(hour==0 || hour==2 || hour==4 || hour==6 ||hour==8 || hour==10 || hour==12 || hour==16 || hour==18 || hour==20 || hour==22)
                                      return element;
                                  });
                                  for (var i = 0; i < chartData.length ; i++) {
                                    if(chartData[i+1]){
                                      if((chartData[i].chart==="temperature")&&(chartData[i+1].chart==="humidity")){
                                        this.lineChartLabels.push(this.momentFormat(chartData[i].time,"line"));
                                        this.lineChartData[0].push(chartData[i].value);
                                      this.lineChartData[1].push(chartData[i+1].value);
                                      }
                                    }
                                  }
                                  this.renderCharts("line");
                                });
                              });
                            }else if(j+1==data.length){
                              Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'No tiene configurado los sensores de humedad y temperatura'
                              })
                            }
                        j++;
                    }
                    j=0;
                    while (!barFlag && j < data.length) {
                      //bar chart
                      if (data[j].sensorType != undefined && data[j].name != undefined){
                        if ((data[j].sensorType).toLowerCase() === "rain" && (data[j].name).toLowerCase() === "pluviometro") {
                          this.rainId = data[j].id;
                        }
                      }
                      if ((data[j].name) != undefined){
                        if ((data[j].name).toLowerCase() === "et0") {
                          this.et0Id = data[j].id;
                        }
                      }
                      if(this.rainId&&this.et0Id){
                        barFlag=true;
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
                              let maxLabelValue=0;
                              for (var i = 0; i < chartData.length; i++) {
                                 if(chartData[i+1]){
                                    if(chartData[i].time===chartData[i+1].time){
                                    if(this.barChartLabels.find((element) => {
                                      return element === this.momentFormat(chartData[i].time,"bar");
                                    }) === undefined) {
                                    this.barChartLabels.push(this.momentFormat(chartData[i].time,"bar"));
                                    if(chartData[i].chart=="rain") {
                                this.barChartData[0].push(chartData[i].value);
                                 }
                              if(chartData[i].chart=="et0") {
                              this.barChartData[1].push(chartData[i].value);
                                  }
                                      }
                                  }
                                }
                              }
                              this.renderCharts("bar");
                          });
                        });
                      }else if(j+1==data.length){
                        Swal.fire({
                          icon: 'error',
                          title: 'Oops...',
                          text: 'No tiene configurado los sensores de rain y et0'
                        })
                      }
                      j++;
                    }
          });
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Debe seleccionar una zona'
          })
        }
}
renderCharts(chart:string) {
    switch (chart) {
      case "line":
          this.lineChart.series[0].setData(this.lineChartData[0]);
          this.lineChart.series[1].setData(this.lineChartData[1]);
          this.lineChart.xAxis[0].setCategories(this.lineChartLabels, true);
        this.renderLineChartFlag=true;
        break;
      case "bar":
        this.barChart.series[0].setData(this.barChartData[0]);
          this.barChart.series[1].setData(this.barChartData[1]);
          this.barChart.xAxis[0].setCategories(this.barChartLabels, true);
        this.renderBarChartFlag=true;
        break;
      default:
        // code...
        break;
    }
  }
  resetChartsValues(chart:string){
    switch (chart) {
        case "line":
        
        this.temperatureId=null;
        this.humidityId=null;
        this.lineChart.series[0].setData([]);
        this.lineChart.series[1].setData([]);
        this.lineChart.xAxis[0].setCategories([]);

        this.lineChartLabels=[];
        for (var i = 0; i < 2; i++) {
          this.lineChartData[i]=[];
        }
        break;  
        case "bar":

        this.rainId=null;
        this.et0Id=null;
        
        this.barChart.series[0].setData([]);
        this.barChart.series[1].setData([]);  
        this.barChart.xAxis[0].setCategories([]);

        this.barChartLabels=[];
        for (var i = 0; i < 2; i++) {
          this.barChartData[i]=[];
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
