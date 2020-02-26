import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as Chartist from 'chartist';

import { WiseconnService } from '../services/wiseconn.service';
import { HttpClient, HttpHeaders, HttpHandler,HttpClientModule  } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  //@italo
  @ViewChild('mapRef', {static: true }) mapElement: ElementRef;

  farms: any = [];
  public loading = false;
  public cant_farms=0;
  public users = 0;
  lat = -32.9034219818308;
  lng = -70.9091198444366;
  constructor(private _route: ActivatedRoute, private wiseconnService: WiseconnService,private router: Router) { }  

  startAnimationForLineChart(chart){
      let seq: any, delays: any, durations: any;
      seq = 0;
      delays = 80;
      durations = 500;

      chart.on('draw', function(data) {
        if(data.type === 'line' || data.type === 'area') {
          data.element.animate({
            d: {
              begin: 600,
              dur: 700,
              from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
              to: data.path.clone().stringify(),
              easing: Chartist.Svg.Easing.easeOutQuint
            }
          });
        } else if(data.type === 'point') {
              seq++;
              data.element.animate({
                opacity: {
                  begin: seq * delays,
                  dur: durations,
                  from: 0,
                  to: 1,
                  easing: 'ease'
                }
              });
          }
      });

      seq = 0;
  };

  coordinates = new window['google'].maps.LatLng(this.lat, this.lng);

  mapInitializer() {
    var map = new window['google'].maps.Map(this.mapElement.nativeElement, { 
      center: this.coordinates,
      zoom:8,
      mapTypeId: window['google'].maps.MapTypeId.HYBRID
    });      
      this.farms.forEach(element => {
        let marker = new window['google'].maps.Marker({
          position: {lat: element['latitude'], lng: element['longitude']},          
        });
        //tooltip
        let tooltip = document.createElement("span");
        let mapContainer = document.getElementById("map-container")?document.getElementById("map-container").firstChild:null;
        if(mapContainer){
          marker.addListener('mouseover', (event) => {
            tooltip.id = 'tooltip-text';
            tooltip.style.backgroundColor = '#777777';
            tooltip.style.color = '#FFFFFF';
            tooltip.innerHTML = element.name;
            tooltip.style.position = 'absolute';
            tooltip.style.padding = '20px 20px';
            tooltip.style.bottom = '0px';
            mapContainer.appendChild(tooltip);
          });
          marker.addListener('mouseout', (event) => {
            var elem = document.querySelector('#tooltip-text');
              if(elem)
                elem.parentNode.removeChild(elem);
          });
        }
       
        marker.addListener('click', () => {
          this.router.navigate(['/farmmap', element['id']]);
        });
        marker.setMap(map);
      },[map,this]);

  }
  startAnimationForBarChart(chart){
      let seq2: any, delays2: any, durations2: any;

      seq2 = 0;
      delays2 = 80;
      durations2 = 500;
      chart.on('draw', function(data) {
        if(data.type === 'bar'){
            seq2++;
            data.element.animate({
              opacity: {
                begin: seq2 * delays2,
                dur: durations2,
                from: 0,
                to: 1,
                easing: 'ease'
              }
            });
        }
      });

      seq2 = 0;
  };
  ngOnInit() {
    
    this.loading = true;
    this.wiseconnService.getFarms().subscribe((response: any) => {
      console.log("getFarms:",response)
      this.farms = response.data?response.data:response;
      localStorage.setItem("datafarms", JSON.stringify(this.farms));
      this.cant_farms=this.farms.length;
      var farm_client = this.farms.filter(function(item,index,array){ 
        if(index == 0){
          return true;
        }else{
          return (item['account']['id'] == array[--index]['account']['id'])? false: true;
        }
      });
      this.users = farm_client.length;
      this.loading = false;
      this.mapInitializer();  
    })
      /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */

     //  const dataDailySalesChart: any = {
     //      labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
     //      series: [
     //          [12, 17, 7, 17, 23, 18, 38]
     //      ]
     //  };

     // const optionsDailySalesChart: any = {
     //      lineSmooth: Chartist.Interpolation.cardinal({
     //          tension: 0
     //      }),
     //      low: 0,
     //      high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
     //      chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
     //  }

      // var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

      // this.startAnimationForLineChart(dailySalesChart);


      /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

     //  const dataCompletedTasksChart: any = {
     //      labels: ['12p', '3p', '6p', '9p', '12p', '3a', '6a', '9a'],
     //      series: [
     //          [230, 750, 450, 300, 280, 240, 200, 190]
     //      ]
     //  };

     // const optionsCompletedTasksChart: any = {
     //      lineSmooth: Chartist.Interpolation.cardinal({
     //          tension: 0
     //      }),
     //      low: 0,
     //      high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
     //      chartPadding: { top: 0, right: 0, bottom: 0, left: 0}
     //  }

      // var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

      // start animation for the Completed Tasks Chart - Line Chart
      // this.startAnimationForLineChart(completedTasksChart);



      /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

      // var datawebsiteViewsChart = {
      //   labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      //   series: [
      //     [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

      //   ]
      // };
      // var optionswebsiteViewsChart = {
      //     axisX: {
      //         showGrid: false
      //     },
      //     low: 0,
      //     high: 1000,
      //     chartPadding: { top: 0, right: 5, bottom: 0, left: 0}
      // };
      // var responsiveOptions: any[] = [
      //   ['screen and (max-width: 640px)', {
      //     seriesBarDistance: 5,
      //     axisX: {
      //       labelInterpolationFnc: function (value) {
      //         return value[0];
      //       }
      //     }
      //   }]
      // ];
      // var websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

      //start animation for the Emails Subscription Chart
      // this.startAnimationForBarChart(websiteViewsChart);
  }
}
