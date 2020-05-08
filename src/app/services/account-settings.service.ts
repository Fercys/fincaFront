import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AccountSettingsService {

  baseurl = environment.base_url;
  prodEnv = environment.production;

  httpOptions:any=null;

  constructor(private http: HttpClient) { 
    let httpHeaders:any=null;
    httpHeaders={
      "Content-Type": "application/json",
      //"Accept": "application/json",
    };
    this.httpOptions={
      headers: new HttpHeaders(httpHeaders)
    }
  }  
  getAccountSettings(): Observable<any> { 
    return this.http.get<any>(this.baseurl + '/accountsettings', this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getAccountSetting(id:number): Observable<any> { 
    return this.http.get<any>(this.baseurl + '/accountsettings/get/'+id, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getAccountSettingByFarm(id:number): Observable<any> { 
    return this.http.get<any>(this.baseurl + '/accountsettings/getbyfarm/'+id, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  create(data: any): Observable<any> {
    return this.http.post<any>(this.baseurl + '/accountsettings/store', data , this.httpOptions)
    .pipe(
      retry(1),
    );
  }
  update(data: any): Observable<any> {
    return this.http.post<any>(this.baseurl + '/accountsettings/update/'+ data.id, data, this.httpOptions)
    .pipe(
      retry(1),
    );
  }
  delete(id:number): Observable<any> { 
    return this.http.delete<any>(this.baseurl + '/accountsettings/delete/'+ id, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  generateApiKey(): Observable<any> { 
    return this.http.get<any>(this.baseurl + '/accountsettings/generateapikey', this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  errorHandl(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
 }
}

