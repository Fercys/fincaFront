import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//models
import { AccountSetting } from '../models/accountsetting';
//services
import { WiseconnService } from 'app/services/wiseconn.service';
import { AccountSettingsService } from 'app/services/account-settings.service';
import { NotificationService } from 'app/services/notification.service';

@Component({
	selector: 'app-account-setting-form',
	templateUrl: './account-setting-form.component.html',
	styleUrls: ['./account-setting-form.component.scss']
})
export class AccountSettingFormComponent implements OnInit {
	public accountSetting = new AccountSetting();
	public account:any=null;
	public accounts:any[]=[];
	public loading:boolean=null;
	constructor(
		private wiseconnService: WiseconnService,
		private accountSettingsService: AccountSettingsService,
		public notificationService: NotificationService,
		public router: Router,
    	public route: ActivatedRoute,) { }

	ngOnInit() {
		this.getAccounts();		
	}
	getAccounts(){
		this.loading = true;
		this.wiseconnService.getAccounts().subscribe((response: any) => {
			this.loading = false;
			this.accounts = response.data?response.data:response;
			if(this.route.snapshot.paramMap.get("id")){
				this.getAccountSetting(parseInt(this.route.snapshot.paramMap.get("id")));
			}else{
				this.generateApiKey();
			}
		});
	}
	getAccount(id:number){
		let account = this.accounts.find(element =>{
			return element.id==id
		});
		return account;
	}
	getAccountSetting(id:number){
		this.loading = true;
		this.accountSettingsService.getAccountSetting(id).subscribe((response: any) => {
			this.loading = false;
			this.accountSetting = response.data?response.data:response;
			this.account=this.getAccount(this.accountSetting.id_account);
		});
	}
	onSelect(select: string, id: number) {
		switch (select) {
			case "account":
			this.account=this.getAccount(id);
			break;
			default:
			break;
		}
	}
	generateApiKey(){
		this.loading=true;
		this.accountSettingsService.generateApiKey().subscribe((response: any) => {
			this.loading=false;
			let data = response.data?response.data:response;
			this.accountSetting.api_key=data;
		},
		error => {
			console.log("error:",error)
			this.loading=false;

			if(error.error)
				this.notificationService.showError('Error',error.error)
		});
	}
	save(){
		this.loading=true;
		this.accountSetting.id_account=this.account?this.account.id:null;
		if(this.accountSetting.id){
			this.accountSettingsService.update(this.accountSetting).subscribe((response: any) => {
				this.loading=false;
				let data = response.data?response.data:response;
				this.notificationService.showSuccess('Operación realizada',response.message)
				this.router.navigate(['/account-settings']);
			},
			error => {
				console.log("error:",error)
				this.loading=false;

				if(error.error)
					this.notificationService.showError('Error',error.error)
			});
		} 
		else{
			this.accountSettingsService.create(this.accountSetting).subscribe((response: any) => {
				this.loading=false;
				let data = response.data?response.data:response;
				this.notificationService.showSuccess('Operación realizada',response.message)
				this.router.navigate(['/account-settings']);
			},
			error => {
				console.log("error:",error)
				this.loading=false;

				if(error.error)
					this.notificationService.showError('Error',error.error)
			});
		}
	}
}
