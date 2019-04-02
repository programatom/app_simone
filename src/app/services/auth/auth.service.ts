import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { URL_SERVICES } from 'src/config/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpService) {
  }

  login(data){
    let url = URL_SERVICES + "login";
    return this.http.httpPost(url, data);
  }
}
