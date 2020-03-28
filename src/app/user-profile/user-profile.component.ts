import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as bcrypt from 'bcryptjs';
//services
import { UserService } from 'app/services/user.service';
import { NotificationService } from 'app/services/notification.service';
//models
import { User } from '../models/user';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  public user = new User();
  public userLS:any=null;
  public loading:boolean=false;

  public notifications ={
    message: { active : false},
    alert: { active : false},
    zone: { active: false}
  }
  
  constructor(private router: Router,
    public userService:UserService,
    public notificationService: NotificationService) { }

  ngOnInit() {
    if(localStorage.getItem("user")){
      this.userLS=JSON.parse(localStorage.getItem("user"));
      if(bcrypt.compareSync(this.userLS.plain, this.userLS.hash)){
        this.user=JSON.parse(this.userLS.plain);
      }else{
        this.router.navigate(['/login']);
      }
    }else{
      this.router.navigate(['/login']);
    }
  }
  toggle(e){
    switch (e) {
      case "message":        
        break;    
      default:
        break;
    }
  }
  update(){
    this.loading=true;
    this.userService.profile(this.user).subscribe((response: any) => {
      this.loading=false;
      this.notificationService.showSuccess('Operación realizada',response.message);
      const user={
        plain:JSON.stringify(response.user),
        hash:bcrypt.hashSync(JSON.stringify(response.user), 10)
      }
      this.setLocalStorageItem("user",JSON.stringify(user))
     },
     error => {
      console.log("error:",error)
        this.loading=false;
       this.notificationService.showError('Error',error.error)
    });
  }
  setLocalStorageItem(key:string,value:any){
      localStorage.setItem(key,value);
  }
  changeToggle(event,toggle){
    switch (toggle) {
      case "msj":
        this.user.new_msj_notification=event.checked?1:0;
        break;
      case "alert":
        this.user.new_alert_notification=event.checked?1:0;
        break;
      case "zone":
        this.user.new_zone_notification=event.checked?1:0;
        break;        
      default:
        // code...
        break;
    }
  }
}
