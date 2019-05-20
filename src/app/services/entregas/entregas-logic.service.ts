import { Injectable } from '@angular/core';
import { ObjEntrega, ObjProcesamientoEntrega, DataProcesamiento } from 'src/interfaces/interfaces';
import { EntregasHttpService } from './entregas-http.service';
import { ToastService } from '../toast/toast.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CommonService } from '../common/common.service';

@Injectable({
    providedIn: 'root'
})
export class EntregasLogicService {

    pedidoSeleccionado = {} as ObjEntrega;
    arrayEntregasSeleccionado:Array<ObjEntrega> = [];
    entregaModificadaYProcesada = false;
    productos = [];

    isScheduled = true;
    modificarPedidoDismissUrl = "";
    infoPedidoDismissUrl = "";

    constructor(private entregasHttp: EntregasHttpService,
        private toastServ: ToastService,
        private navCtrl: NavController,
        private router: Router,
        private commonServ: CommonService) { }


    linkEntregaSelectedForNavigation(pedido, index_entrega){
      this.pedidoSeleccionado = JSON.parse(JSON.stringify(pedido));
      this.pedidoSeleccionado.entregas = pedido.entregas[index_entrega];
      return;
    }

    verInfoPedido(pedido,index_entrega){
      this.linkEntregaSelectedForNavigation(pedido,index_entrega);
      this.infoPedidoDismissUrl = this.router.url;
      this.navCtrl.navigateForward("/tabs/info-pedido");
    }


    modificarEntrega(pedido, index_entrega, isScheduled = true){
      this.linkEntregaSelectedForNavigation(pedido,index_entrega);
      this.modificarPedidoDismissUrl = this.router.url;
      this.isScheduled = isScheduled;
      this.navCtrl.navigateForward("/modificar-pedido");
    }



    entregasSinModifYSpliceLista(pedido, index_entrega, index_pedido, displayList){
      return new Promise((resolve)=>{
        this.linkEntregaSelectedForNavigation(pedido, index_entrega);
        this.entregarSinModificaciones(this.pedidoSeleccionado).then(()=>{
          displayList[index_pedido].entregas.splice(index_entrega , 1);
          resolve();
        });
      });
    }


    entregarSinModificaciones(pedido) {

        return new Promise((resolve) => {
            let header = "Entregar sin ninguna modificación en los productos entregados ni en el monto a pagar";
            let buttons = [
                {
                    text: "Cancelar",
                    role: "cancel"
                },
                {
                    text: "Aceptar",
                    handler: () => {
                        this.procesar(pedido, pedido.entregas.productos, "Entregada sin modificaciones", "entregada", 0).then((respuesta) => {
                            resolve()
                        });
                    }
                }
            ];
            this.toastServ.presentAlert(header, undefined, undefined, buttons);
        });
    }
    getEntregasArrayFromPedidosArray(pedidosArray: Array<any>) {
        let entregasArray = [];
        pedidosArray.filter((value) => {
            if (value.entregas.length > 0) {
                entregasArray.push(value.entregas[0]);
            }
        });
        return entregasArray;
    }

    calcularMontoAPagar(productos, descuento, expiracion_descuento) {
        console.log(productos, descuento, expiracion_descuento, this.commonServ.hoy());
        console.log(this.commonServ.givenDateTimeline(expiracion_descuento))
        if(this.commonServ.givenDateTimeline(expiracion_descuento) == "past"){
          descuento = 0;
        }
        let monto_a_pagar = 0;
        for (let i = 0; i < productos.length; i++) {
            let producto = productos[i];
            let monto_bruto_producto = producto.precio * producto.cantidad;
            monto_a_pagar = monto_a_pagar + monto_bruto_producto;
        }

        return monto_a_pagar - (monto_a_pagar * descuento / 100);
    }

    entregaAReintentarODerivar(pedido, derivar, reintentar, observaciones) {

        return new Promise((resolve) => {
            let peticion = new Object() as ObjProcesamientoEntrega;
            peticion.entrega_id = pedido.entregas.id;
            peticion.data = new Object() as DataProcesamiento;
            peticion.data.derivada = derivar;
            peticion.data.reintentar = reintentar;
            peticion.data.estado = "sin procesar";
            peticion.data.observaciones = observaciones;
            this.entregasHttp.procesarEntrega(peticion).subscribe((respuesta) => {
                console.log(respuesta);
                resolve(respuesta);
            });
        });
    }

    procesar(pedido, productosEntregados, observaciones, estado, entregas_adelantadas, pagaCon?) {
        return new Promise((resolve) => {
            let peticion = new Object() as ObjProcesamientoEntrega;

            if(!this.isScheduled){
              peticion.pedido_id = pedido.pedido.id;
            }else{
              peticion.entrega_id = pedido.entregas.id;
            }
            peticion.data = new Object() as DataProcesamiento;
            peticion.data.derivada = 0;
            peticion.data.reintentar = 0;
            peticion.data.estado = estado;
            peticion.data.observaciones = observaciones;
            peticion.data.entregas_adelantadas = entregas_adelantadas;

            if (entregas_adelantadas > 0) {
                peticion.data.adelanta = 1;
            } else {
                peticion.data.adelanta = 0;
            }

            peticion.data.monto_a_pagar = this.calcularMontoAPagar(productosEntregados, pedido.pedido.descuento, pedido.pedido.expiracion_descuento);

            if (pagaCon == undefined) {
                peticion.data.paga_con = peticion.data.monto_a_pagar;
            } else {
                peticion.data.paga_con = pagaCon;
            }

            peticion.data.productos_entregados = productosEntregados;

            console.log("SE ENVÍA LA PETICÓN: ", peticion)
            this.entregasHttp.procesarEntrega(peticion).subscribe((respuesta) => {
                this.toastServ.presentToast("Se procesó la entrega con éxito" , "success")
                console.log(respuesta);
                resolve(respuesta);
            });
        });
    }

    filtrarEntregas(pedidos, reintentar:Array<number>, derivada:Array<number>, estado:Array<string>, repartidor_excepcional = [], alarma = [0,1], danger = [0,1]) {
      if(repartidor_excepcional.length == 0){
        pedidos.filter((value)=>{
          repartidor_excepcional.push(value.pedido.repartidor_excepcional_id);
        });
      }
      pedidos.filter((value) => {
            let entregas_a_mostrar = [];
            let pedido = value.pedido;
            let entregas = value.entregas;
            for(let i = 0; i < entregas.length; i ++){
              let entrega = entregas[i];

              /*
              */
              console.log("------")
              console.log("Pedido object: ")
              console.log(value);
              console.log("------")
              console.log(repartidor_excepcional)
              console.log(pedido.repartidor_excepcional_id)
              console.log("Pedido id:")
              console.log(pedido.id)
              console.log("Entrega id:")
              console.log(entrega.id)
              console.log(reintentar.includes(entrega.reintentar));
              console.log(derivada.includes(entrega.derivada))
              console.log(estado.includes(entrega.estado))
              console.log(repartidor_excepcional.includes(pedido.repartidor_excepcional_id));
              console.log(alarma.includes(pedido.alarma));
              console.log(danger.includes(pedido.danger));
              console.log("------")
              if (reintentar.includes(entrega.reintentar)
              && derivada.includes(entrega.derivada)
              && estado.includes(entrega.estado)
              && repartidor_excepcional.includes(pedido.repartidor_excepcional_id)
              && alarma.includes(pedido.alarma)
              && danger.includes(pedido.danger)
            ) {
              console.log("Se encontró una entrega congruente: " , entrega);
              entregas_a_mostrar.push(entrega);
            }
            }
            value.entregas = entregas_a_mostrar;
        });
        return pedidos;
    }


}
