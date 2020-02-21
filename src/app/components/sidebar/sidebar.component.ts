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
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'Dashboard-Verde', class: '', active : false },
    { path: '/farms', title: 'Campos',  icon:'Campo-Verde', class: '' , active : false},
    { path: '/free-plotter', title: 'Graficador Libre',  icon:'Graficador-libre-verde', class: '', active : false },
    { path: '/?', title: 'Análisis de suelo',  icon:'Suelo', class: '', active : false },
    { path: '/report-instalacion', title: 'Reporte de Instalación',  icon:'Reporte', class: '', active : false },
    { path: '/configuration', title: 'Configuración',  icon:'Configuracion', class: '', active : false }, 
    // { path: '/icons', title: 'Icons',  icon:'bubble_chart', class: '' },
    // { path: '/maps', title: 'Maps',  icon:'location_on', class: '' },
    // { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
    // { path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  constructor( public router: Router) {  }
  ngOnInit() {
    
    this.menuItems = ROUTES.filter(menuItem => {
      switch (localStorage.getItem("username").toLowerCase()) {
        case "agrifrut":
          if (menuItem.title.toLowerCase()!="dashboard") {
            return menuItem;
          }
          break;
        case "santajuana":
          if (menuItem.title.toLowerCase()!="dashboard") {
            return menuItem;
          }
          break;        
        default:
          return menuItem;
          break;
      }
      
    });
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
    if( this.router.url == routePath.path){
      return true;
    }
    return false;
}
}
