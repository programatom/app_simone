import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from "rxjs/operators"
import { Observable } from 'rxjs';
import { ObjRespuestaServidor } from 'src/interfaces/interfaces';
import { LocalStorageService } from './local-storage/local-storage.service';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  token:string;
  constructor(private http: HttpClient,
              private localStorageServ: LocalStorageService,
              private navCtrl: NavController) {
  }
  httpGet(url: string): Observable<ObjRespuestaServidor> {
    this.token = this.localStorageServ.localStorageObj.token;
    const headerDict = {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    }

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };

    return this.http.get(url, requestOptions)
      .pipe(
        map((respuesta: any) => {
          this.unauthorized(respuesta);
          return respuesta;
        })
      );
  }

  httpPost(url: string, data:any, content_type?:string): Observable<ObjRespuestaServidor> {
    this.token = this.localStorageServ.localStorageObj.token;
    var headerDict;

    if(this.token == undefined){
      headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }else{
      headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.token,
      }
    }

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };


    return this.http.post(url, data ,requestOptions)
      .pipe(
        map((respuesta: any) => {
          this.unauthorized(respuesta);
          return respuesta;
        })
      );
  }

  unauthorized(respuesta){
    if(respuesta.status == "unauthorized"){
      console.log("voy aca")
      this.localStorageServ.eliminateAllValuesInStorage().then(()=>{
        this.navCtrl.navigateRoot("/login");
      });

    }else{
      return;
    }
  }
}
