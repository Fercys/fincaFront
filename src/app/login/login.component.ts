import { Component, OnInit, ViewChild, ElementRef, OnDestroy,AfterViewInit} from '@angular/core';
import { FormBuilder,FormGroup, FormArray,  Validators,FormControl } from '@angular/forms';
import { UserService } from 'app/services/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as bcrypt from 'bcryptjs';
@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	host: {
		'(window:resize)': 'onResize($event)'
	}
})

export class LoginComponent implements OnInit,OnDestroy,AfterViewInit {
	loading:boolean=false;
	myForm: FormGroup;
	name = new FormControl('');
	Validator: Validators;
	disablesavebutton = true;
    screenHeight: number;
    screenWidth: number;
	login = document.getElementsByClassName('login-background') as HTMLCollectionOf<HTMLElement>;
	user:any=null;
	onResize(event) {
		this.screenHeight = window.innerHeight;
		this.screenWidth = window.innerWidth;
		this.login[0].style.height = this.screenHeight.toString()+'px';
	}


	constructor(
		private _router: Router, 
		private fb: FormBuilder,
		private elementRef: ElementRef,
  		public userService: UserService,
    	) { }

	ngOnInit() {
		localStorage.clear();
		this.screenHeight = window.innerHeight;
		this.login[0].style.height = this.screenHeight.toString()+'px';
		
		this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = './assets/img/backgrounds/2.jpg';
		document.body.className = "selector";

		this.myForm = this.fb.group({
			email:['',[Validators.required,Validators.email]],
			password:['',Validators.required],
		})
		//this.myForm.valueChanges.subscribe(console.log)
	}
	onSubmit() {
		// Adding data values
		// console.log(this.myForm.value)
	}
	ngOnDestroy(){
		document.body.className="";
	}
	ngAfterViewInit(){
		this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = './assets/img/backgrounds/2.jpg';
	}
	LoginUser(event){
		event.preventDefault();
		this.loading=true;
	 	this.userService.login(this.myForm.value).subscribe((response: any) => {
			this.loading=false;
			this.user={
				plain:JSON.stringify(response.user),
				hash:bcrypt.hashSync(JSON.stringify(response.user), 10)
			}
    		this.setLocalStorageItem("user",JSON.stringify(this.user))
			this._router.navigate(['/dashboard']);
		},
	   	error => {
	   		console.log("error:",error)
	   		if(error.error!=undefined){
        		Swal.fire({icon: 'error',title: 'Oops...',text: error.error.error});
	   		}
			this.loading=false;
	    });
	}
	setLocalStorageItem(key:string,value:any){
	    localStorage.setItem(key,value);
	} 
}
