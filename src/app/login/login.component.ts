import { Component, OnInit, ViewChild, ElementRef, OnDestroy,AfterViewInit} from '@angular/core';
import { FormBuilder,FormGroup, FormArray,  Validators,FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	host: {
		'(window:resize)': 'onResize($event)'
	}
})

export class LoginComponent implements OnInit,OnDestroy,AfterViewInit {
	myForm: FormGroup;
	name = new FormControl('');
	Validator: Validators;
	disablesavebutton = false;
    screenHeight: number;
    screenWidth: number;
	login = document.getElementsByClassName('login-background') as HTMLCollectionOf<HTMLElement>;
	onResize(event) {
		this.screenHeight = window.innerHeight;
		this.screenWidth = window.innerWidth;
		console.log(this.screenHeight, this.screenWidth);
		this.login[0].style.height = this.screenHeight.toString()+'px';
	}


	constructor(private fb: FormBuilder,private elementRef: ElementRef, private router: Router) { }

	ngOnInit() {
		this.screenHeight = window.innerHeight;
		console.log('este es mi height inicial: '+this.screenHeight.toString())
		this.login[0].style.height = this.screenHeight.toString()+'px';
		
		this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = './assets/img/backgrounds/2.jpg';
		document.body.className = "selector";

		this.myForm = this.fb.group({
			user:['',[Validators.required,Validators.email]],
			password:['',Validators.required],
		})
		this.myForm.valueChanges.subscribe(console.log)
	}
	onSubmit() {
		// Adding data values
		console.log(this.myForm.value)
		if(this.myForm.value.user = 'admin' && this.myForm.value.password == '12345678'){
			this.router.navigate(['/dashboard'])
		} else {
			Swal.fire(
				'Error!',
				'Credenciales invalidas',
				'error'
			)
		}
	}
	ngOnDestroy(){
		document.body.className="";
	}
	ngAfterViewInit(){
		this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = './assets/img/backgrounds/2.jpg';
	}

	LoginUser(event){
		event.preventDefault();
		const target = event.target;
		const usuario= target.querySelector('#usuario').value;
		const password= target.querySelector('#password').value;
	  
		if (usuario == 'Admin' && password == '12345678') {
			console.log('entre');
			this._router.navigate(['/dashboard']);
		}else{
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Usuario o Contraseña Equivocada!'
			})
		}
	  }
}
