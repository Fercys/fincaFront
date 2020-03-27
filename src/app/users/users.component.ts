import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { NotificationService } from 'app/services/notification.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  searchTable:any;
  loading:boolean=false;
  users:any[]=[];
  constructor(
    private userService: UserService,
    private notificationService: NotificationService,) { }

  ngOnInit() {
    this.getUsers();
  }  
  getUsers(){
    this.loading = true;
  	this.userService.getUsers().subscribe((response: any) => {
      this.users = response.data?response.data:response;
      this.loading = false;
    });
  }
  delete(id:number){
    this.loading = true;
    this.userService.delete(id).subscribe((response: any) => {
      this.loading = false;
      this.notificationService.showSuccess('Operación realizada',response.message)
      this.getUsers();
    });
  }
}
