import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WiseconnService } from 'app/services/wiseconn.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-soil-analysis',
  templateUrl: './soil-analysis.component.html',
  styleUrls: ['./soil-analysis.component.scss']
})
export class SoilAnalysisComponent implements OnInit {	
  public url:string=null;
  public farm:any=null;
  public loading = true;
  constructor(public router: Router,public wiseconnService: WiseconnService) { }

  ngOnInit() {
    this.loading = true;
  	if(this.wiseconnService.farmId){
  		this.getFarm(this.wiseconnService.farmId);
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
  	this.wiseconnService.getFarm(id).subscribe((response) => {
    this.loading = false;
      this.farm = response.data?response.data:response;
      switch (this.farm.name) {
        case "Agrifrut":
          this.url = "https://cdtec.irrimaxlive.com/?cmd=signin&username=cdtec&password=l01yliEl7H#/u:3435/Campos:l/Agrifrut:f";
          break;
        case "Agrifrut II (Nogales y Parrones)":
          this.url = "https://cdtec.irrimaxlive.com/?cmd=signin&username=cdtec&password=l01yliEl7H#/u:3435/Campos:l/Agrifrut%20II%20(Nogales%20y%20Parrones):f";
          break;
        case "Santa Juana de Chincolco":
          this.url = "https://cdtec.irrimaxlive.com/?cmd=signin&username=cdtec&password=l01yliEl7H#/u:3507/Campos:l/Agricola%20Santa%20Juana%20de%20Chincolco%20SA:f";
          break;
        default:
          this.url = "";
      }
  	});
  }

}
