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
  login(credentials): Observable<any> { 
    return this.http.post<any>(this.baseurl + '/auth/login',credentials, this.httpOptions)
    .pipe(
      retry(1),
    )
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
  getFarmsByUser(id:number): Observable<any> { 
    return this.http.get<any>(this.baseurl + '/users/'+id+'/getfarms', this.httpOptions)
    .pipe(
      retry(1),
    )
  }
  create(user_data: User): Observable<any> {
    return this.http.post<any>(this.baseurl + '/users/store', user_data , this.httpOptions)
    .pipe(
      retry(1),
    );
  }
  update(user_data: User): Observable<any> {
    return this.http.post<any>(this.baseurl + '/users/update/'+ user_data.id, user_data, this.httpOptions)
    .pipe(
      retry(1),
    );
  }
  registerFarms(id: number,farms_data:Array<any>): Observable<any> {
    return this.http.post<any>(this.baseurl + '/users/'+id+'/registerfarms', farms_data, this.httpOptions)
    .pipe(
      retry(1),
    );
  }
  
  delete(id:number): Observable<any> {
    return this.http.delete<any>(this.baseurl + '/users/delete/'+id, this.httpOptions)
    .pipe(
      retry(1),
    );
  }
}

