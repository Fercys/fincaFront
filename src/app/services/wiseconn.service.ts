import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { farmModels } from '../models/farmModels';

@Injectable({
  providedIn: 'root'
})
export class WiseconnService {

  baseurl = 'https://cors-anywhere.herokuapp.com/https://apiv2.wiseconn.com';

  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'api_key':'9Ev6ftyEbHhylMoKFaok'
    })
  }

  constructor(private http: HttpClient) { }
  
  getFarms(): Observable<farmModels> { console.log( this.httpOptions);
    return this.http.get<farmModels>(this.baseurl + '/farms', this.httpOptions)
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

