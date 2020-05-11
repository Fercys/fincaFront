import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as bcrypt from 'bcryptjs';
//services
import { WiseconnService } from '../services/wiseconn.service';
import { NotificationService } from 'app/services/notification.service';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-farms',
  templateUrl: './farms.component.html',
  styleUrls: ['./farms.component.scss']
})
export class FarmsComponent implements OnInit {
  public farms;
  public loading = false;
  public searchTable:any;
  public userLS:any=null;
  public user:any=null;
  constructor(
    private wiseconnService: WiseconnService,
    public notificationService:NotificationService,
    private userService:UserService,
    private router: Router,
  ) { }

  ngOnInit() {
    if(localStorage.getItem("user")){
        this.userLS=JSON.parse(localStorage.getItem("user"));
        if(bcrypt.compareSync(this.userLS.plain, this.userLS.hash)){
          this.user=JSON.parse(this.userLS.plain);
          if(this.user.role.id==1){//admin
            this.getFarms();
          }else{
            this.getFarmsByUser();
          }
        }else{
          this.router.navigate(['/login']);
        }
      }else{
        this.router.navigate(['/login']);
      }
  }
  getFarms(){      
    this.loading = true;
    this.wiseconnService.getFarms().subscribe((response: any) => {
      this.farms = response.data?response.data:response;
      this.loading = false;
    },
    error=>{            
      this.loading = false;
      
      if(error.error)
      this.notificationService.showError('Error',error.error)
      console.log("error:",error)
    });
  }
  getFarmsByUser(){      
    this.loading = true;
    this.userService.getFarmsByUser(this.user.id).subscribe((response: any) => {
      this.farms = response.data?response.data:response;      
      this.loading = false;
    },
    error=>{
      this.loading = false;      
      if(error.error)
        this.notificationService.showError('Error',error.error)
      console.log("error:",error)
    });
  }
  navigateTo(route:any[]){
    if(localStorage.getItem("lastFarmId")){
      if(parseInt(route[1])!=parseInt(localStorage.getItem("lastFarmId"))){
        this.setLocalStorageItem("lastFarmId",route[1]);
        if(localStorage.getItem("lastZones")){
          localStorage.removeItem('lastZones');
        }
        if(localStorage.getItem("lastWeatherStation")){
            localStorage.removeItem('lastWeatherStation');
        }
      }
    }
    this.router.navigate(route);
  }
  activeCloning(id:number){
    this.loading = true;
    this.wiseconnService.activeCloning(id).subscribe((response: any) => {
      this.loading = false;
      if(response.data){
        this.farms=this.farms.map(element=>{
          if(response.data.id==element.id){
            element.active_cloning=response.data.active_cloning;
          }
          return element;
        })
      }
      if(response.message){
       this.notificationService.showSuccess('Operación realizada',response.message)
      }
    },
    error=>{            
      this.loading = false;      
      if(error.error)
      this.notificationService.showError('Error',error.error)
      console.log("error:",error)
    });
  }
  setLocalStorageItem(key,value){
    localStorage.setItem(key,value);
  }  
}
