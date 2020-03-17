import { Component, OnInit } from '@angular/core';
import { WiseconnService } from 'app/services/wiseconn.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
  farms: any = [];
  client: any = [];
  public loading = false;
  constructor(private wiseconnService: WiseconnService) { }
  searchTable:any;
  
  ngOnInit() {
    this.loading=true;
    this.wiseconnService.getFarms().subscribe((response: any) => {
      this.farms = response.data?response.data:response;
      this.client=this.farms.filter(function(item,index,array){ 
        if(index == 0){
          return true;
        }else{ 
          return item['account']['id'] == array[--index]['account']['id']? false: true;
        }
      });
      this.loading=false;
    })
  }

}
