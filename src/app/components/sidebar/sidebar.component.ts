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
export const ROUTESCLIENTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'Dashboard-Verde', class: '', active : true },
    { path: '/weather-monitoring', title: 'Monitoreo del clima',  icon:'Graficador-libre-verde', class: '', active : false },
    { path: '/farms', title: 'Campos',  icon:'Campo-Verde', class: '' , active : false},
    { path: '/free-plotter', title: 'Analizador Grafico',  icon:'Graficador-libre-verde', class: '', active : false },
    { path: '/soil-analysis', title: 'Humedad de Suelo',  icon:'Suelo', class: '', active : false },
];
export const ROUTESADMIN: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'Dashboard-Verde', class: '', active : true },
    { path: '/client', title: 'Cuentas',  icon:'Campo-Verde', class: '' , active : false},
    { path: '/weather-monitoring', title: 'Monitoreo del clima',  icon:'Graficador-libre-verde', class: '', active : false },
    { path: '/free-plotter', title: 'Analizador Grafico',  icon:'Graficador-libre-verde', class: '', active : false },
    { path: '/soil-analysis', title: 'Humedad de Suelo',  icon:'Suelo', class: '', active : false },
    { path: '/report-instalacion', title: 'Reporte de Instalación',  icon:'Reporte', class: '', active : false },
    { path: '/configuration', title: 'Configuración',  icon:'Configuracion', class: '', active : false },
    { path: '/users', title: 'Usuarios',  icon: 'Usuario-verde', class: '', active : false },
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
        if(this.user.role.id==1){//admin
          this.menuItems = ROUTESADMIN.filter(menuItem => menuItem);
        }else{
          this.menuItems = ROUTESCLIENTES.filter(menuItem => menuItem);
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
