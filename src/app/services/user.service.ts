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

  httpOptions: any = null;
  httpOptionsGet: any = null;

  constructor(private http: HttpClient) {
    let httpHeaders: any = null;
    httpHeaders = {
      'Accept': 'application/json',
    };
    this.httpOptions = {
      headers: new HttpHeaders(httpHeaders)
    }

    let httpHeadersget: any = null;
    httpHeadersget = {
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*'
    };
    this.httpOptionsGet = {
      headers: new HttpHeaders(httpHeadersget)
    }
  }

  login(credentials): Observable<any> {     
    return this.http.post<any>(this.baseurl + '/auth/login', credentials, this.httpOptions)
    .pipe(
      retry(1),
    )
  }
  getUsers(): Observable<any> { 
    return this.http.get<any>(this.baseurl + '/users')
    .pipe(
      retry(1),
    )
  }
  getUser(id:number): Observable<any> {     
    return this.http.get<any>(this.baseurl + '/users/get/'+id)
    .pipe(
      retry(1),
    )
  }
  getFarmsByUser(id:number): Observable<any> {     
    return this.http.get<any>(this.baseurl + '/users/'+id+'/getfarms')
    .pipe(
      retry(1),
    )
  }
  getAccountsByUser(id:number): Observable<any> { 
    return this.http.get<any>(this.baseurl + '/users/'+id+'/getaccounts')
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
  profile(user_data: User): Observable<any> {
    return this.http.post<any>(this.baseurl + '/profile/'+user_data.id+'/update', user_data , this.httpOptions)
    .pipe(
      retry(1),
    );
  }
}

