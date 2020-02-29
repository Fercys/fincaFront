import { Component, OnInit } from '@angular/core';
import { WiseconnService } from '../services/wiseconn.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-farms',
  templateUrl: './farms.component.html',
  styleUrls: ['./farms.component.scss']
})
export class FarmsComponent implements OnInit {
  public farms;
  searchTable:any;
  constructor(private wiseconnService: WiseconnService,
    private _location: Location) { }

  ngOnInit() { 
    this.wiseconnService.getFarms().subscribe((data: any) => {
      this.farms = data;
      switch (localStorage.getItem("username").toLowerCase()) {
        case "agrifrut":
          this.farms = this.farms.filter((element) => {
            return element.id == 185 || element.id == 2110 || element.id == 1378 || element.id == 520
          })
          break;
        case "santajuana":
          this.farms = this.farms.filter((element) => {
            return element.id == 719
          })
          break;

        default:
          // code...
          break;
      }
    })
  }


  isMobileMenu() {
    if ($(window).width() > 991) {
        return false;
    }
    return true;
  }

  backClicked() {
    this._location.back();
  }


}
