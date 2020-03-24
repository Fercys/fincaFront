import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  searchTable:any;
  loading:boolean=false;
  users:any[]=[{
  	name:"reinaldo",
  	last_name:"gonzalez"
  }];
  constructor(private usersService: UsersService,) { }

  ngOnInit() {
    this.getUsers();
  }
  getUsers(){
    this.loading = true;
  	this.usersService.getUsers().subscribe((response: any) => {
      this.users = response.data?response.data:response;
      console.log("users:",this.users)      
      this.loading = false;
    });
  }
}
