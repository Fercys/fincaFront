import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as bcrypt from 'bcryptjs';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    active: boolean
}

export const ROUTESADMIN: RouteInfo[] = [ //admin
    { path: '/dashboard', title: 'Inicio',  icon: 'Dashboard-Verde', class: '', active : true },
    //{ path: '/client', title: 'Cuentas',  icon:'Campo-Verde', class: '' , active : false},
    { path: '/weather-monitoring', title: 'Monitoreo del clima',  icon:'Graficador-libre-verde', class: '', active : false },
    { path: '/free-plotter', title: 'Analizador Grafico',  icon:'Graficador-libre-verde', class: '', active : false },
    { path: '/soil-analysis', title: 'Humedad de Suelo',  icon:'Suelo', class: '', active : false },
    //{ path: '/report-instalacion', title: 'Reporte de Instalación',  icon:'Reporte', class: '', active : false },
    { path: '/users', title: 'Usuarios',  icon: 'Usuario-verde', class: '', active : false },
    { path: '/account-settings', title: 'Configuración',  icon:'Configuracion', class: '', active : false },
];
export const ROUTESCONSULTANT: RouteInfo[] = [ //consultor
    { path: '/dashboard', title: 'Inicio',  icon: 'Dashboard-Verde', class: '', active : true },
    { path: '/weather-monitoring', title: 'Monitoreo del clima',  icon:'Graficador-libre-verde', class: '', active : false },
    { path: '/free-plotter', title: 'Analizador Grafico',  icon:'Graficador-libre-verde', class: '', active : false },
    { path: '/soil-analysis', title: 'Humedad de Suelo',  icon:'Suelo', class: '', active : false },
    { path: '/account-settings', title: 'Configuración',  icon:'Configuracion', class: '', active : false },
];
export const ROUTESCLIENTES: RouteInfo[] = [ //clientes
    { path: '/dashboard', title: 'Inicio',  icon: 'Dashboard-Verde', class: '', active : true },
    { path: '/weather-monitoring', title: 'Monitoreo del clima',  icon:'Graficador-libre-verde', class: '', active : false },
    //{ path: '/farms', title: 'Campos',  icon:'Campo-Verde', class: '' , active : false},
    { path: '/free-plotter', title: 'Analizador Grafico',  icon:'Graficador-libre-verde', class: '', active : false },
    { path: '/soil-analysis', title: 'Humedad de Suelo',  icon:'Suelo', class: '', active : false },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  public userLS:any=null;
  public user:any=null;
  constructor( public router: Router) {  }
  ngOnInit() {
    if(localStorage.getItem("user")){
      this.userLS=JSON.parse(localStorage.getItem("user"));
      if(bcrypt.compareSync(this.userLS.plain, this.userLS.hash)){
        this.user=JSON.parse(this.userLS.plain);
        switch (this.user.role.id) {
          case 1://admin
            this.menuItems = ROUTESADMIN.filter(menuItem => menuItem);
            break;
          case 2://consultor
            this.menuItems = ROUTESCONSULTANT.filter(menuItem => menuItem);
            break;
          case 3://clientes
            this.menuItems = ROUTESCLIENTES.filter(menuItem => menuItem);
            break; 
          default:
            this.menuItems = ROUTESCLIENTES.filter(menuItem => menuItem);
            break;
        }
      }else{
        this.router.navigate(['/login']);
      }
    }else{
      this.router.navigate(['/login']);
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
