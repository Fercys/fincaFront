import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//models
import { User } from '../models/user';
//services
import { RoleService } from 'app/services/role.service';
import { UserService } from 'app/services/user.service';
import { WiseconnService } from 'app/services/wiseconn.service';
import { NotificationService } from 'app/services/notification.service';

// elements
import {
  rolesConfigObj,
  accountsConfigObj,
  farmsConfigObj
} from "./selectsconfigs/configs";

import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
	public loading:boolean=false;
	public textBtn:string="Registrar";
	public user = new User();
  	public userLS:any=null;
  	public myUserData:any=null;
	//roles
	public roleConfig = rolesConfigObj;
	public roles: Array<any> = [];
	public selectedRoles: any = null;
	//accounts
	public accountsConfig = accountsConfigObj;
	public accounts: Array<any> = [];
	public selectedAccounts: any = [];
	//farms
	public farmsConfig = farmsConfigObj;
	public farms: Array<any> = [];
	public selectedFarms: Array<any> = [];

  	constructor(
  		public roleService: RoleService,
  		public userService: UserService,
  		public wiseconnService: WiseconnService,
  		public notificationService: NotificationService,
		public router: Router,
    	public route: ActivatedRoute,) {
	}

	ngOnInit() {
		this.getRoles();
		this.getAccounts();
		if(this.route.snapshot.paramMap.get("id")){
			this.getUser(parseInt(this.route.snapshot.paramMap.get("id")));
		}
		if(localStorage.getItem("user")){
        	this.userLS=JSON.parse(localStorage.getItem("user"));
        		if(bcrypt.compareSync(this.userLS.plain, this.userLS.hash)){
	          		this.myUserData=JSON.parse(this.userLS.plain);
	        	}else{
	          		this.router.navigate(['/login']);
	        	}
	    }else{
	        this.router.navigate(['/login']);
	    }
	}
	getUser(id:number){
		this.loading=true;
		this.userService.getUser(id).subscribe((response: any) => {
			this.loading=false;
			this.textBtn="Actualizar";
			this.user = response.data?response.data:response;
			this.getRoleSelected(this.user);
			this.getFarmsByUser(this.user.id);
		},
	   	error => {
	   		console.log("error:",error)
			this.loading=false;
	    });
	}
	getRoleSelected(user:any){
		this.selectedRoles=this.roles.find(element => element.id == user.role.id);
	}
	getFarmsByUser(id:number){
		this.loading=true;
		this.userService.getFarmsByUser(id).subscribe((response: any) => {
			this.loading=false;
			let selectedFarms=response.data?response.data:response;
			if(selectedFarms.length>0){
				let farm_aux =JSON.parse(localStorage.getItem("datafarms")); 
				let accountId=selectedFarms[0].id_account;
				this.selectedAccounts=this.accounts.find(element=>element.id==accountId);
				this.farms=farm_aux.filter(function(element){
					if(element['account']['id'] == accountId){
						return {id:element.id,name:element.name};
					}
				}); 	
			}
			for (var i = 0; i < selectedFarms.length; i++) {
				this.selectedFarms=[...this.selectedFarms,this.farms.find(element => element.id == selectedFarms[i].id)];
			}
		},
	   	error => {
	   		console.log("error:",error)
			this.loading=false;
	    });
	}
	getRoles(){
		this.loading=true;
		this.roleService.getRoles().subscribe((response: any) => {
			this.loading=false;
			let roles = response.data?response.data:response;
        	let options = [];
	        for (let i = 0; i < roles.length; i++) {
	          options.push({
	            id: roles[i].id,
	            description: roles[i].description
	          });
	        }
	        this.roles=options;
		},
	   	error => {
	   		console.log("error:",error)
			this.loading=false;
	    });
	}
	getAccounts(){
		this.loading=true;
	   	this.wiseconnService.getAccounts().subscribe((response: any) => {
			this.loading=false;
	   		let accounts = response.data?response.data:response;
        	let options = [];
	        for (let i = 0; i < accounts.length; i++) {
	          options.push({
	            id: accounts[i].id,
	            name: accounts[i].name
	          });
	        }
	        this.accounts=options;
	   	},
	   	error => {
	   		console.log("error:",error)
			this.loading=false;
	    });
	}
  	selectionChanged(event,select){
		switch (select) {
			case "role":
	  			this.user.id_role=event.value?event.value.id:null;
				break;
			case "farm":
	  			this.selectedFarms=event.value;
				break;
			case "account":
	  			this.selectedAccounts=event.value;
	 			if(JSON.parse(localStorage.getItem("datafarms"))){
					let farm_aux =JSON.parse(localStorage.getItem("datafarms")); 
					let accountId=this.selectedAccounts.id;
					this.farms=farm_aux.filter(function(element){
						if(element['account']['id'] == accountId){
							return {id:element.id,name:element.name};
						}
					}); 
					this.selectedFarms=[];
				}
			default:
				// code...
				break;
		}
	}
	registerFarms(user){
		this.loading=true;
		this.userService.registerFarms(user.id,this.selectedFarms).subscribe((response: any) => {
			this.loading=false;
			this.notificationService.showSuccess('Operación realizada',response.message)
			this.router.navigate(['/users']);
		},error => {
	   		console.log("error:",error)
			this.loading=false;
			this.notificationService.showError('Error',error.error)
		});
	}
	changeToggle(event,toggle){
	    switch (toggle) {
	      	case "status":
	        	this.user.active=event.checked?1:0;
	        	break;   
	      	default:
	        	// code...
	        	break;
	    }
	}
	save(){
		this.loading=true;
		if(this.user.id){
			this.userService.update(this.user).subscribe((response: any) => {
				this.loading=false;
		   		let data = response.data?response.data:response;
		   		this.registerFarms(data);
		   	},
		   	error => {
	   			console.log("error:",error)
				this.loading=false;
		   		this.notificationService.showError('Error',error.error)
		    });
	    } 
	    else{
	      	this.userService.create(this.user).subscribe((response: any) => {
				this.loading=false;
		   		let data = response.data?response.data:response;
		   		this.registerFarms(data);
		   	},
		   	error => {
	   			console.log("error:",error)
				this.loading=false;
		   		this.notificationService.showError('Error',error.error)
		    });
	    }		
	}
}
