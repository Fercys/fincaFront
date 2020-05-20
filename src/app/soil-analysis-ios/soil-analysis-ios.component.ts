import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WiseconnService } from 'app/services/wiseconn.service';
import { AccountSettingsService } from 'app/services/account-settings.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-soil-analysis-ios',
  templateUrl: './soil-analysis-ios.component.html',
  styleUrls: ['./soil-analysis-ios.component.scss']
})
export class SoilAnalysisIosComponent implements OnInit {	
  public url:string=null;
  public farm:any=null;
  public loading:boolean = true;
  public accountSetting:any=null;
  constructor(
    public router: Router,
    public wiseconnService: WiseconnService,
    public accountSettingsService:AccountSettingsService
    ) { }

  ngOnInit() {
    this.loading = true;
    if(localStorage.getItem("lastFarmId")){
      this.getFarm(parseInt(localStorage.getItem("lastFarmId")));
    }else{
      this.loading = false;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debe estar seleccionado un campo.'
      });
    }
  }
  getFarm(id:number){
    this.loading = true;
    this.wiseconnService.getFarm(id).subscribe((response) => {
      this.loading = false;
      this.farm = response.data?response.data:response;
      if(this.farm){
        this.getAccountSettingByFarm()
      }
      
    });
  }
  processUrlText(text:string){
    return text.replace(" ", "%20")
  }
  getAccountSettingByFarm(){
    this.loading = true;
    this.accountSettingsService.getAccountSettingByFarm(this.farm.id).subscribe((response) => {
      this.loading = false;
      this.accountSetting=response.data;
      let username=this.processUrlText(this.accountSetting.name);
      let password=this.processUrlText(this.accountSetting.password);
      let accountName=this.processUrlText(this.farm.name);
      let idUser=this.processUrlText(this.accountSetting.id_user);
      this.url = "https://cdtec.irrimaxlive.com/?cmd=signin&username="+username+"&password="+password+"#/u:"+idUser+"/Campos:l/"+accountName+":f";
      window.open(this.url, "nuevo", "directories=no, location=no, menubar=no, scrollbars=yes, statusbar=no, tittlebar=no, width=400, height=400");
    });
  }

}
