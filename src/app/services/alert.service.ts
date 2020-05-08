import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { farmModels } from '../models/farmModels';

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  baseurl = environment.base_url;
  prodEnv = environment.production;

  httpOptions:any=null;

  constructor(private http: HttpClient) { 
    let httpHeaders:any=null;
    if(this.baseurl=="https://cors-anywhere.herokuapp.com/https://apiv2.wiseconn.com"){
      httpHeaders={
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "api_key":"9Ev6ftyEbHhylMoKFaok"
      };
    }else{
      httpHeaders={
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      };
    }
    this.httpOptions={
      headers: new HttpHeaders(httpHeaders)
    }
  }
  getAlerts(id:number,dateRange:any): Observable<any> {
    return this.http.post<any>(this.baseurl + "/farms/"+id+"/alarms/triggered",{
      initTime:dateRange.initTime,
      endTime:dateRange.endTime
    }, this.httpOptions)
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
    console.log(errorMessage); console.log(error);
    return throwError(errorMessage);
 }
}