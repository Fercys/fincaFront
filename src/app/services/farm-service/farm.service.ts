import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FarmService {

  farmsBaseUrl = environment.baseUrl + 'farms';
  private header = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    "api_key": '9Ev6ftyEbHhylMoKFaok',
    "Accept": "application/json"

  });
  
  constructor(private http: HttpClient) {
  }

  getFarms(): Observable <any> {
    const config = { headers: this.header};
    console.log(this.header)
    return this.http.get(this.farmsBaseUrl, config);
  }

  getZones(id): Observable <any> {
    const config = { headers: this.header};
    console.log(this.header)
    let zoneUrl = this.farmsBaseUrl = `${id}/zones`
    return this.http.get(zoneUrl, config);
  }
}
