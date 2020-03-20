import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { farmModels } from '../models/farmModels';

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WiseconnService {

  baseurl = environment.base_url;
  prodEnv = environment.production;
  farmId:number=null;

  httpOptions:any=null;

  constructor(private http: HttpClient) { 
    if(this.prodEnv){
      this.httpOptions={
        headers: new HttpHeaders({
          'Accept': 'application/json'
        })
      }
    }else{
      this.httpOptions={
        headers: new HttpHeaders({
          'Accept': 'application/json',
          'api_key':'9Ev6ftyEbHhylMoKFaok'
        })
      }
    }
  }
  
  getFarms(): Observable<any> { 
    return this.http.get<any>(this.baseurl + '/farms', this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getFarm(id): Observable<any> {
    this.farmId=parseInt(id);
    return this.http.get<any>(this.baseurl + '/farms/'+id, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getZones(id): Observable<any> { 
    return this.http.get<any>(this.baseurl + '/farms/'+id+'/zones', this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getIrrigarionsRealOfZones(id): Observable<any> {
    return this.http.get<any>(this.baseurl + "/zones/"+id+"/realIrrigations?initTime=2020-03-01&endTime=2020-03-31", this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getMeasuresOfZones(id): Observable<any> { 
    return this.http.get<any>(this.baseurl + '/zones/'+id+"/measures", this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getMeterogoAgrifut(id): Observable<any> {
    return this.http.get<any>(this.baseurl + "/zones/"+id+"/measures", this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getMeterogoSantaPin(id): Observable<any> { 
    return this.http.get<any>(this.baseurl + '/zones/'+id+"/measures", this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getDataByMeasure(id,dateRange): Observable<any> { 
    return this.http.get<any>(this.baseurl + '/measures/'+id+"/data?initTime="+dateRange.initTime+"T00:00&endTime="+dateRange.endTime+"T00:00", this.httpOptions)
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

