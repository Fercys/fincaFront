import { Component, OnInit } from '@angular/core';

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
  
  constructor() { }

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
}
