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
  farmsConfigObj
} from "./selectsconfigs/configs";


@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
	loading:boolean=false;
	textBtn:string="Registrar";
	user = new User();
	//roles
	roleConfig = rolesConfigObj;
	roles: Array<any> = [];
	selectedRoles: any = null;
	//farms
	farmsConfig = farmsConfigObj;
	farms: Array<any> = [];
	selectedFarms: Array<any> = [];

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
		this.getFarms();
		if(this.route.snapshot.paramMap.get("id")){
			this.getUser(parseInt(this.route.snapshot.paramMap.get("id")));
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
			let selectedFarms = response.data?response.data:response;
        	for (var i = 0; i < selectedFarms.length; i++) {
	 		  this.selectedFarms=[...this.selectedFarms,this.farms.find(element => element.id == selectedFarms[i].id_farm)];
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
	getFarms(){
		this.loading=true;
	   	this.wiseconnService.getFarms().subscribe((response: any) => {
			this.loading=false;
	   		let farms = response.data?response.data:response;
        	let options = [];
	        for (let i = 0; i < farms.length; i++) {
	          options.push({
	            id: farms[i].id,
	            name: farms[i].name
	          });
	        }
	        this.farms=options;
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
