import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from "rxjs/operators"
import { Observable } from 'rxjs';
import { ObjRespuestaServidor } from 'src/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) {

  }
  httpGet(url: string, token:string): Observable<ObjRespuestaServidor> {

    const headerDict = {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token,
    }

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };

    return this.http.get(url, requestOptions)
      .pipe(
        map((respuesta: any) => {
          return respuesta;
        })
      );
  }

  httpPost(url: string, data:any ,token?:string, content_type?:string): Observable<ObjRespuestaServidor> {

    var headerDict;

    if(token == undefined){
      headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }else{
      headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
      }
    }

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };


    return this.http.post(url, data ,requestOptions)
      .pipe(
        map((respuesta: any) => {
          return respuesta;
        })
      );
  }

  httpPut(url: string, data:any ,token?:string, content_type?:string): Observable<ObjRespuestaServidor> {

    var headerDict;

    if(token == undefined){
      headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }else if(content_type == "file"){
      headerDict = {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
      }
    }else{
      headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
      }

    }

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };

    console.log(url, data ,requestOptions)

    return this.http.put(url, data ,requestOptions)
      .pipe(
        map((respuesta: any) => {
          return respuesta;
        })
      );
  }
}
