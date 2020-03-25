import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry } from 'rxjs/operators';
import { User } from '../models/user'

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseurl = environment.base_url;
  prodEnv = environment.production;

  httpOptions:any=null;

  constructor(private http: HttpClient) { 
    this.httpOptions={
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    }
  }  
  getUsers(): Observable<any> { 
    return this.http.get<any>(this.baseurl + '/users', this.httpOptions)
    .pipe(
      retry(1),
    )
  }
  getUser(id:number): Observable<any> { 
    return this.http.get<any>(this.baseurl + '/users/get/'+id, this.httpOptions)
    .pipe(
      retry(1),
    )
  }
  getFarmsSelected(id:number): Observable<any> { 
    return this.http.get<any>(this.baseurl + '/users/'+id+'/getfarms', this.httpOptions)
    .pipe(
      retry(1),
    )
  }
  create(user_data: User,farms_data:Array<any>): Observable<any> {
    return this.http.post<any>(this.baseurl + '/users/store', {
            user_data,
            farms_data
        }, this.httpOptions)
    .pipe(
      retry(1),
    );
  }
}
