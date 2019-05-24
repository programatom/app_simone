import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  hoy(){
    // PROD
    //let hoy = new Date();

    // TEST

    var hoy = new Date();
    hoy.setDate(hoy.getDate());

    return hoy.getFullYear() + "/" + this.addCeroToNumber(hoy.getMonth() + 1) + "/" + this.addCeroToNumber(hoy.getDate());
  }

  givenDateTimeline(givenDate){
    let hoy = this.hoy();
    givenDate = new Date(givenDate);
    let hoyObj = new Date(hoy);
    if(hoyObj == givenDate){
      return "present";
    }else if (hoyObj > givenDate){
      return "past";
    }else{
      return "future";
    }
  }

  addCeroToNumber(number) {

  if (parseInt(number) < 10) {
    return "0" + parseInt(number);
  } else {
    return number.toString();
  }
}
  filtroArrayObjsOfObjs(array:Array<any>, filtro){
    let results = [];
    if(filtro == ""){
      return array;
    }

    filtro = filtro.toLowerCase();

    for (let i = 0; i < array.length; i ++){
      let pedido = array[i];
      let pedidoArray = [
        pedido.usuario.email,
        pedido.usuario.name.toLowerCase(),
        pedido.usuario.id,
        pedido.rol.calle == null? pedido.rol.calle: pedido.rol.calle.toLowerCase(),
        pedido.rol.localidad == null? pedido.rol.localidad: pedido.rol.localidad.toLowerCase(),
        pedido.rol.provincia == null? pedido.rol.provincia: pedido.rol.provincia.toLowerCase(),
        pedido.rol.observaciones == null? pedido.rol.observaciones: pedido.rol.observaciones.toLowerCase(),
        pedido.pedido.estado.toLowerCase(),
        pedido.pedido.periodicidad.toLowerCase(),
      ];

      if(pedidoArray.includes(filtro)){
        results.push(pedido);
        continue;
      }
      let entregasMatch = [];
      for(let j = 0; j < pedido.entregas.length; j ++){
        let entrega = JSON.parse(JSON.stringify(pedido.entregas[j]));
        let entregaArray = [
          entrega.id.toString(),
          entrega.estado,
          entrega.fecha_de_entrega_potencial,
          entrega.fecha_de_procesamiento_real
        ];
        console.log(entregaArray)
        console.log(filtro)
        if(entregaArray.includes(filtro)){
          entregasMatch.push(entrega);
        }
      }
      if(pedido.entregas.length != 0){
        pedido.entregas = entregasMatch;
        results.push(pedido);
      }
    }

    return results;
  }

}
