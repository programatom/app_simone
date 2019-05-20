import { Pipe, PipeTransform } from '@angular/core';
import { PedidosService } from '../services/pedidos/pedidos.service';

@Pipe({
  name: 'empleado'
})
export class EmpleadoPipe implements PipeTransform {

  empleados;

  constructor(private pedidosServ: PedidosService){
    this.pedidosServ.getEmpleados().subscribe((respuesta)=>{
      console.log(respuesta);
      this.empleados = respuesta.data;
    });
  }
  transform(value: any, args?: any): any {
    console.log(value)
    let empleadoName = "";
    this.empleados.filter((empleado)=>{
      console.log(empleado)
      if(empleado.id == value){
        empleadoName = empleado.name;
      }
    });
    return empleadoName;
  }

}
