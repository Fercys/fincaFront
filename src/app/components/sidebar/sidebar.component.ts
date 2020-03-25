import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    active: boolean
}
export const ROUTESCLIENTES: RouteInfo[] = [
    { path: '/user-profile', title: 'Perfil',  icon: 'Usuario-verde', class: '', active : false },
    { path: '/soil-analysis', title: 'Humedad de Suelo',  icon:'Suelo', class: '', active : false },
    { path: '/report-instalacion', title: 'Reporte de Instalación',  icon:'Reporte', class: '', active : false },
    { path: '/configuration', title: 'Configuración',  icon:'Configuracion', class: '', active : false },
    { path: '/soil-analysis', title: 'Humedad de Suelo',  icon:'Suelo', class: '', active : false }
];
export const ROUTESADMIN: RouteInfo[] = [
    { path: '/user-profile', title: 'Perfil',  icon: 'Usuario-verde', class: '', active : false },
    { path: '/dashboard', title: 'Dashboard',  icon: 'Dashboard-Verde', class: '', active : false },
    { path: '/weather-monitoring', title: 'Monitoreo del clima',  icon:'Graficador-libre-verde', class: '', active : false },
    { path: '/farms', title: 'Campos',  icon:'Campo-Verde', class: '' , active : false},
    { path: '/free-plotter', title: 'Analizador Grafico',  icon:'Graficador-libre-verde', class: '', active : false },
    { path: '/soil-analysis', title: 'Humedad de Suelo',  icon:'Suelo', class: '', active : false },
    { path: '/report-instalacion', title: 'Reporte de Instalación',  icon:'Reporte', class: '', active : false },
    { path: '/configuration', title: 'Configuración',  icon:'Configuracion', class: '', active : false }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  username="";
  constructor( public router: Router) {  }
  ngOnInit() {
    if(localStorage.getItem("username")){
      switch (localStorage.getItem("username").toLowerCase()) {
        case "agrifrut":
            this.username="Agrifrut";
          break;
          case "agrifrut@cdtec.cl":
            this.username="Agrifrut";
          break;
        case "santajuana":
            this.username="SantaJuana";
          break;  
          case "santajuana@cdtec.cl":
            this.username="SantaJuana";
            break;      
        default:
            this.username="Admin";
          break;
      }
      if(this.username == "Admin"){
        this.menuItems = ROUTESADMIN.filter(menuItem => menuItem);
      }else{
        this.menuItems = ROUTESCLIENTES.filter(menuItem => menuItem);
      }
    }
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
  activeHover(value, cond){
     cond  ? value.active  = true : value.active  = false 
  }
  isCurrentRoute(routePath) {
    if( this.router.url === routePath.path){
      return true;
    }
    return false;
}
}
