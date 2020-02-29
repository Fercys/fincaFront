import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
@Component({
  selector: 'app-report-instalation',
  templateUrl: './report-instalation.component.html',
  styleUrls: ['./report-instalation.component.scss']
})
export class ReportInstalationComponent implements OnInit {

  constructor(   private _location: Location) { }

  ngOnInit() {
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
