import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { WiseconnService } from '../services/wiseconn.service';
import { HttpClient, HttpHeaders, HttpHandler,HttpClientModule  } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import * as Chartist from 'chartist';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userLS:any=null;
  user:any=null;
  constructor(private router: Router) { }  
  ngOnInit() {
    if(localStorage.getItem("user")){
      this.userLS=JSON.parse(localStorage.getItem("user"));
      this.user=JSON.parse(this.userLS.plain);
    }else{
      this.router.navigate(['/login']);
    }   
  }
}
