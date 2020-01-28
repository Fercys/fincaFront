import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FarmZoneService {

  farmsBaseUrl = environment.baseUrl + '/zones/';
  private header = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    "api_key": '9Ev6ftyEbHhylMoKFaok',
    "Accept": "application/json"

  });
  
  constructor(private http: HttpClient) {
  }

  getZone(id): Observable <any> {
    const config = { headers: this.header};
    console.log(this.header)
    let zoneUrl = this.farmsBaseUrl = `${id}/measures`
    return this.http.get(zoneUrl, config);
  }
}
