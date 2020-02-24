import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { farmModels } from '../models/farmModels';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  
   baseurl = 'https://api.worldweatheronline.com/premium/v1/weather.ashx?';
//   HTTP: http://api.worldweatheronline.com/premium/v1/weather.ashx
//   HTTPS: https://api.worldweatheronline.com/premium/v1/weather.ashx
  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'api_key':'7da96f2f52f54be7a1b123737202102',
    })
  }


  constructor(private http: HttpClient) { }
  

  getWeather(q, key): Observable<any> { 
    console.log(this.baseurl+"q="+key+"&"+"Key="+q+'&'+'format='+'json&num_of_days=5&tp=24')
    return this.http.get(this.baseurl+"q="+key+"&"+"Key="+q+'&'+'format='+'json&num_of_days=5&tp=24'
    , this.httpOptions)
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

