import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  notifications ={
    message: { active : false},
    alert: { active : false},
    zone: { active: false}
  }
  
  constructor(    private _location: Location) { }

  ngOnInit() {
  }

  toggle(e){
    switch (e) {
      case "message":
        
        break;
    
      default:
        break;
    }
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
