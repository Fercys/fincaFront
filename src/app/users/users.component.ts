import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  searchTable:any;
  loading:boolean=false;
  users:any[]=[];
  constructor(private userService: UserService,) { }

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
}
