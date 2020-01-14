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
      'api_key':'67a49d3ba5904bef87441658192312'
    })
  }

  constructor(private http: HttpClient) { }
  

  getWeather(q, key): Observable<any> { 
    return this.http.get(this.baseurl+"q="+key+"&"+"Key="+q, this.httpOptions)
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

