import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { URL_SERVICES } from 'src/config/config';

@Injectable({
  providedIn: 'root'
})
export class EntregasHttpService {

  constructor(private http: HttpService) { }

  getEntregasHabitualesHoy(){
    let url = URL_SERVICES + "entregasEmpleadoHabituales";
    return this.http.httpGet(url);
  }

  getEntregasDanger(){
    let url = URL_SERVICES + "entregasDanger";
    return this.http.httpGet(url);
  }

  getEntregasAlarmaYDerivadas(){
    let url = URL_SERVICES + "entregasAlarmaYExcepcionales";
    return this.http.httpGet(url);
  }

  procesarEntrega(data){
    let url = URL_SERVICES + "procesarEntrega";
    return this.http.httpPost(url,data);
  }

  getProductos(){
    let url = URL_SERVICES + "productos";
    return this.http.httpGet(url);
  }

  getEntregasDateFilter(data:{
    "desde":string
    "hasta":string
  }){
    let url = URL_SERVICES + "buscarEntregasFecha";
    return this.http.httpPost(url, data);
  }
}
