import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WiseconnService } from '../services/wiseconn.service';

@Component({
  selector: 'app-farms',
  templateUrl: './farms.component.html',
  styleUrls: ['./farms.component.scss']
})
export class FarmsComponent implements OnInit {
  public farms;
  public loading = false;
  searchTable:any;
  constructor(private wiseconnService: WiseconnService,
    private router: Router,) { }

  ngOnInit() { 
    this.loading = true;
    if(this.wiseconnService.farmId){
      this.wiseconnService.farmId=null;
    }
    this.getFarms();
  }
  getFarms(){
    this.wiseconnService.getFarms().subscribe((response: any) => {
      this.farms = response.data?response.data:response;
      if(localStorage.getItem("username")){  
        switch (localStorage.getItem("username").toLowerCase()) {
          case "agrifrut":
            this.farms = this.farms.filter((element) => {
              let id= element.id_wiseconn?element.id_wiseconn:element.id;
              return id == 185 || id == 2110 || id == 1378 || id == 520
            })
            break;
            case "agrifrut@cdtec.cl":
            this.farms = this.farms.filter((element) => {
              let id= element.id_wiseconn?element.id_wiseconn:element.id;
              return id == 185 || id == 2110 || id == 1378 || id == 520
            })
            break;
          case "santajuana":
            this.farms = this.farms.filter((element) => {
              let id= element.id_wiseconn?element.id_wiseconn:element.id;
              return id == 719
            })
            break;
            case "santajuana@cdtec.cl":
              this.farms = this.farms.filter((element) => {
                let id= element.id_wiseconn?element.id_wiseconn:element.id;
                return id == 719
              })
              break;
          default:
            // code...
            break;
        }
      }else{        
        this.router.navigate(['/login']);
      }
      this.loading = false;
    });
  }
}
