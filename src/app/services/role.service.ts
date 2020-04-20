import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  baseurl = environment.base_url;
  prodEnv = environment.production;

  httpOptions:any=null;

  constructor(private http: HttpClient) { 
    let httpHeaders:any=null;
    httpHeaders={
      'Accept': 'application/json'
    };
    this.httpOptions={
      headers: new HttpHeaders(httpHeaders)
    }
  }  
  getRoles(): Observable<any> { 
    return this.http.get<any>(this.baseurl + '/roles', this.httpOptions)
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

