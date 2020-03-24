import { Component, OnInit } from '@angular/core';
import { RolesService } from 'app/services/roles.service';
import { WiseconnService } from 'app/services/wiseconn.service';

// elements
import {
  rolesConfigObj,
  farmsConfigObj,
} from "./selectsconfigs/configs";
@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
	//roles
	roleConfig = rolesConfigObj;
	roles: Array<any> = [];
	selectedRoles: any = null;
	//farms
	farmsConfig = farmsConfigObj;
	farms: Array<any> = [];
	farmsSelected: Array<any> = [];
	selectedFarms: any = null;

  	constructor(
  		public rolesService: RolesService,
  		public wiseconnService: WiseconnService) {
	}

	ngOnInit() {
		this.getRoles();
		this.getFarms();
	}
	getRoles(){
		this.rolesService.getRoles().subscribe((response: any) => {
			let roles = response.data?response.data:response;
        	let options = [];
	        for (let i = 0; i < roles.length; i++) {
	          options.push({
	            id: roles[i].id,
	            description: roles[i].description
	          });
	        }
	        this.roles=options;
		    console.log("roles:",this.roles)
		});
	}
	getFarms(){
	   	this.wiseconnService.getFarms().subscribe((response: any) => {
	   		let farms = response.data?response.data:response;
        	let options = [];
	        for (let i = 0; i < farms.length; i++) {
	          options.push({
	            id: farms[i].id,
	            name: farms[i].name
	          });
	        }
	        this.farms=options;
		    console.log("farms:",this.farms)
	   	});
	}
  	selectionChanged(event,select){
		switch (select) {
			case "role":
	  			console.log("role:",event.value)
				break;
			case "farm":
				console.log("farm:",event.value)
				break;
			default:
				// code...
				break;
		}
	}

}
