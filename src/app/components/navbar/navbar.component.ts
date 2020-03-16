import { Component, OnInit, ElementRef } from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { Router } from '@angular/router';

import { ROUTES } from '../sidebar/sidebar.component';


declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    active: boolean
}

export const SidebarRoute: RouteInfo[] = [
    { path: '/user-profile', title: 'Ver Perfil',  icon: 'Profile', class: '', active : false },
    { path: '/', title: 'Cerrar sesión',  icon:'Logout', class: '' , active : false},
];
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    private listTitles: any[];
    location: Location;
      mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;
    public username:string=null;
    activeHover = false;

    constructor(location: Location,  private element: ElementRef, private router: Router) {
      this.location = location;
          this.sidebarVisible = false;
    }

    ngOnInit(){
      //this.username=localStorage.getItem("username");
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
      }else{
        this.router.navigate(['/login']);
      }
      this.listTitles = SidebarRoute.filter(listTitle => listTitle);
      const navbar: HTMLElement = this.element.nativeElement;
      this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
      this.router.events.subscribe((event) => {
        this.sidebarClose();
         var $layer = document.getElementsByClassName('close-layer')[0];
         if ($layer) {
           $layer.remove();
           this.mobile_menu_visible = 0;
         }
     });
    }

    sidebarOpen() {      
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        const sidebar = document.getElementsByClassName('sidebar')[0];
        const mainPanel = document.getElementsByClassName('main-panel')[0];
        console.log("sidebar:",sidebar)

        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);

        body.classList.add('nav-open');

        sidebar.classList.add('sidebar-close');

        mainPanel.classList.add('w-100');
    };
    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');

        body.classList.remove('nav-open');

        const sidebar: any = document.getElementsByClassName('sidebar sidebar-close')[0];
        if (sidebar) {
          sidebar.classList.remove('sidebar-close');
        }

        const mainPanel: any = document.getElementsByClassName('main-panel')[0];
        if (mainPanel) {
          mainPanel.classList.remove('w-100');
        }
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        var $toggle = document.getElementsByClassName('navbar-toggler')[0];

        if (this.sidebarVisible) {
            this.sidebarClose();
        } else {
            this.sidebarOpen();
        }
        this.sidebarVisible = !this.sidebarVisible;

        const body = document.getElementsByTagName('body')[0];

        if (this.mobile_menu_visible == 1) {
            // $('html').removeClass('nav-open');
            body.classList.remove('nav-open');
            var $layer:any = document.getElementsByClassName('close-layer')[0];
            if ($layer) {
                $layer.remove();
            }
            setTimeout(function() {
                $toggle.classList.remove('toggled');
            }, 400);

            this.mobile_menu_visible = 0;
        } else {
            setTimeout(function() {
                $toggle.classList.add('toggled');
            }, 430);

            var $layer: any = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');


            if (body.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            }else if (body.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }

            setTimeout(function() {
                $layer.classList.add('visible');
            }, 100);

            $layer.onclick = function() { //asign a function
              body.classList.remove('nav-open');
              this.mobile_menu_visible = 0;
              $layer.classList.remove('visible');
              setTimeout(function() {
                  $layer.remove();
                  $toggle.classList.remove('toggled');
              }, 400);
            }.bind(this);

            body.classList.add('nav-open');
            this.mobile_menu_visible = 1;

        }
    };

    getTitle(){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      if(titlee.charAt(0) === '#'){
          titlee = titlee.slice( 1 );
      }

      for(var item = 0; item < this.listTitles.length; item++){
          if(this.listTitles[item].path === titlee){
              return this.listTitles[item].title;
          }
      }
      return 'Dashboard';
    }
}
