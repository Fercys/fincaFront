import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-farms',
  templateUrl: './farms.component.html',
  styleUrls: ['./farms.component.scss']
})
export class FarmsComponent implements OnInit {
  public farms;
  constructor() { }

  ngOnInit() {
    this.farms=JSON.parse(localStorage.getItem("datafarms"));
    console.log(this.farms);
    
  }

}
