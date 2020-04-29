import { Component, OnInit } from '@angular/core';
import { AccountSettingsService } from 'app/services/account-settings.service';
import { NotificationService } from 'app/services/notification.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit {
  searchTable:any;
  loading:boolean=false;
  accountSettings:any[]=[];
  constructor(
    private accountSettingsService: AccountSettingsService,
    private notificationService: NotificationService,) { }

  ngOnInit() {
    this.getAccountSettings();
  }  
  getAccountSettings(){
    this.loading = true;
  	this.accountSettingsService.getAccountSettings().subscribe((response: any) => {
      this.accountSettings = response.data?response.data:response;
      this.loading = false;
    });
  }
  delete(id:number){
    this.loading = true;
    this.accountSettingsService.delete(id).subscribe((response: any) => {
      this.loading = false;
      this.notificationService.showSuccess('Operación realizada',response.message)
      this.getAccountSettings();
    });
  }

}
