import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-farm-client',
  templateUrl: './farm-client.component.html',
  styleUrls: ['./farm-client.component.scss']
})
export class FarmClientComponent implements OnInit {
  public farms;
  public id;
  public url;
  searchTable: any;
  constructor(private _route: ActivatedRoute) {  }

  ngOnInit() { 
    this.id = this._route.snapshot.paramMap.get('id');  
    console.log(this.id);
      
    switch (this.id) { 
      case "63":
        this.url="https://cdtec.irrimaxlive.com/?cmd=signin&username=cdtec&password=l01yliEl7H#/u:3435/Campos/Agrifrut";
        break;
      case "395":
        this.url="https://cdtec.irrimaxlive.com/?cmd=signin&username=cdtec&password=l01yliEl7H#/u:3507/Campos/Agricola%20Santa%20Juana%20de%20Chincolco";
        break;
      default:
        this.url="";
    }   
    let farm_aux = JSON.parse(localStorage.getItem("datafarms")); 
    this.farms = farm_aux.filter(function(element){
      return element['account']['id'] == this.id;
    },this); 
  }
}
