import { Component, OnInit } from '@angular/core';
import { WiseconnService } from 'app/services/wiseconn.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
  farms: any = [];
  client: any = [];
  public loading = false;
  constructor(private wiseconnService: WiseconnService,
    private _location: Location) { }
  searchTable:any;
  
  ngOnInit() {
    this.loading=true;
    this.wiseconnService.getFarms().subscribe((data: {}) => {
      let farms: any = [];
      farms = data; 
      var client = farms.filter(function(item,index,array){ 
        if(index == 0){
          return true;
        }else{ 
          return item['account']['id'] == array[--index]['account']['id']? false: true;
        }
      });
      this.client = client;
      this.loading=false;
      console.log(client);
    })
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
        return false;
    }
    return true;
  }

  backClicked() {
    this._location.back();
  }

}
