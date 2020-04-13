import { Component, OnInit } from '@angular/core';
import { WiseconnService } from 'app/services/wiseconn.service';
import { UserService } from 'app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
  public accounts:any[]=[];
  public loading = false;
  public searchTable:any;
  public userLS:any=null;
  public user:any=null;
  constructor(
    private wiseconnService: WiseconnService,
    private userService:UserService,
    private router: Router) { }
  
  ngOnInit() {
    if(localStorage.getItem("user")){
      this.userLS=JSON.parse(localStorage.getItem("user"));
      if(bcrypt.compareSync(this.userLS.plain, this.userLS.hash)){
        this.user=JSON.parse(this.userLS.plain);
        if(this.user.role.id==1){//admin
          this.getAccounts();
        }else{
          this.getAccountsByUser();
        }
      }else{
        this.router.navigate(['/login']);
      }
    }else{
      this.router.navigate(['/login']);
    }

    
  }
  getAccounts(){
    this.loading=true;
    this.wiseconnService.getAccounts().subscribe((response: any) => {
      this.loading=false;
      this.accounts = response.data?response.data:response;
    })
  }
  getAccountsByUser(){
    this.loading=true;
    this.userService.getAccountsByUser(this.user.id).subscribe((response: any) => {
      this.loading=false;
      this.accounts = response.data?response.data:response;
    })
  }

}
