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
  username:string=null;
  constructor() { }  
  ngOnInit() {
    if(localStorage.getItem("username")){
      this.username=localStorage.getItem("username").toLowerCase();
    }    
  }
}
