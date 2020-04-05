import { Component, OnInit } from '@angular/core';
import { WiseconnService } from 'app/services/wiseconn.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
  public accounts:any[]=[];
  public loading = false;
  public searchTable:any;
  constructor(private wiseconnService: WiseconnService) { }
  
  ngOnInit() {
    this.loading=true;
    this.wiseconnService.getAccounts().subscribe((response: any) => {
      this.loading=false;
      this.accounts = response.data?response.data:response;
    })
  }

}
