import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FarmService } from 'app/services/farm-service/farm.service';

@Component({
  selector: 'app-farm-zones',
  templateUrl: './farm-zones.component.html',
  styleUrls: ['./farm-zones.component.scss']
})
export class FarmZonesComponent implements OnInit {

  zones = [
    {
      id:1,
      name:'epe',
      description:'pepe'
    },
    {
      id:2,
      name:'e2pe',
      description:'pep2e'
    },
    {
      id:3,
      name:'epe3',
      description:'pep3e'
    }
  ];
  constructor(private farmService: FarmService, private route: ActivatedRoute) { }

  ngOnInit() {
    let id
    this.route.params.subscribe(params => {
      id = params.id
    });
    this.farmService.getZones(id).toPromise().then(result => {
      this.zones = result
    })
  }

}
