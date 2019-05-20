import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { URL_SERVICES } from 'src/config/config';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  pedidoSeleccionado;

  constructor(private http: HttpService) { }

  getEmpleados(){
    let url = URL_SERVICES + "empleados";
    return this.http.httpGet(url);
  }

  getPedidos(){
    let url = URL_SERVICES + "pedidosEmpleado";
    return this.http.httpGet(url);
  }

  getPedidosShowAdmin(id){
    let url = URL_SERVICES + "pedidoShowAdmin/" + id;
    return this.http.httpGet(url);
  }
}
