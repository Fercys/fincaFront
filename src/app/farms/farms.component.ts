import { Component, OnInit } from '@angular/core';
import { FarmService } from 'app/services/farm-service/farm.service';

@Component({
  selector: 'app-farms',
  templateUrl: './farms.component.html',
  styleUrls: ['./farms.component.scss']
})
export class FarmsComponent implements OnInit {

  farms = [
    {id: 1}
  ];
  constructor(private farmService: FarmService) { }

  ngOnInit() {
    this.farmService.getFarms().toPromise().then(result => {
      this.farms = result
    })
  }

}
