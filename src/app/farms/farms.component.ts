import { Component, OnInit } from '@angular/core';
import { FarmService } from 'app/services/farm-service/farm.service';

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
