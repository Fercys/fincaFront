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

  httpOptions:any=null;

  constructor(private http: HttpClient) { 
    let httpHeaders:any=null;
    if(this.baseurl=="https://cors-anywhere.herokuapp.com/https://apiv2.wiseconn.com"){
      httpHeaders={
        'Accept': 'application/json',
        'api_key':'9Ev6ftyEbHhylMoKFaok'
      };
    }else{
      httpHeaders={
        'Accept': 'application/json'
      };
    }
    this.httpOptions={
      headers: new HttpHeaders(httpHeaders)
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
    localStorage.setItem("lastFarmId",id);
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
  getWeatherStation(id): Observable<any> { 
    return this.http.get<any>(this.baseurl + '/farms/'+id+'/weatherstation', this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getMeasuresOfFarm(id:number): Observable<any> { 
    return this.http.get<any>(this.baseurl + '/farms/'+id+"/measures", this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getSensorTypes(): Observable<any> { 
    return this.http.get<any>(this.baseurl + '/sensortypes', this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getSensorTypesOfFarm(id:number): Observable<any> { 
    return this.http.get<any>(this.baseurl + '/farms/'+id+"/sensortypes", this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getIrrigarionsRealOfZones(id:number,dateRange:any): Observable<any> {
    //prueba con wiseconn
    this.baseurl="https://cors-anywhere.herokuapp.com/https://apiv2.wiseconn.com";
    this.httpOptions={
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'api_key':'9Ev6ftyEbHhylMoKFaok'
      })
    }
    return this.http.get<any>(this.baseurl + "/zones/"+id+"/realIrrigations?initTime="+dateRange.initTime+"&endTime="+dateRange.endTime, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getMeasuresOfZones(id): Observable<any> { 
    return this.http.get<any>(this.baseurl + "/zones/"+id+"/measures", this.httpOptions)
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
    return this.http.get<any>(this.baseurl + "/zones/"+id+"/measures", this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getDataByMeasure(id,dateRange): Observable<any> {
    return this.http.get<any>(this.baseurl + "/measures/"+id+"/data?initTime="+dateRange.initTime+"T00:00&endTime="+dateRange.endTime+"T00:00", this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }  
  // no funciona con http://developers.wiseconn.com/
  getAccounts(): Observable<any> { 
    return this.http.get<any>(this.baseurl + '/accounts/', this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  // no funciona con http://developers.wiseconn.com/
  getAccount(id:number): Observable<any> { 
    return this.http.get<any>(this.baseurl + '/accounts/' +id, this.httpOptions)
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

