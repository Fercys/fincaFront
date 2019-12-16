import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FarmZoneService } from 'app/services/farm-zones-service/farm-zone.service';

@Component({
  selector: 'app-zone-detail',
  templateUrl: './zone-detail.component.html',
  styleUrls: ['./zone-detail.component.scss']
})
export class ZoneDetailComponent implements OnInit {

  zone_measures = [];
  constructor(private farmZoneService: FarmZoneService, private route: ActivatedRoute) { }

  ngOnInit() {
    let id
    this.route.params.subscribe(params => {
      id = params.id
    });
    this.farmZoneService.getZone(id).toPromise().then(result => {
      this.zone_measures = result
    })
  }

}
