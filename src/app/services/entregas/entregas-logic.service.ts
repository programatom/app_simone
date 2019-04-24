import { Injectable } from '@angular/core';
import { ObjEntrega, ObjProcesamientoEntrega, DataProcesamiento } from 'src/interfaces/interfaces';
import { EntregasHttpService } from './entregas-http.service';
import { ToastService } from '../toast/toast.service';

@Injectable({
    providedIn: 'root'
})
export class EntregasLogicService {

    entregaSeleccionada = {} as ObjEntrega;
    arrayEntregasSeleccionado:Array<ObjEntrega> = [];
    entregaModificadaYProcesada = false;
    productos = [];

    isScheduled = true;
    modificarPedidoDismissUrl = "";
    infoPedidoDismissUrl = "";

    constructor(private entregasHttp: EntregasHttpService,
        private toastServ: ToastService) { }



    entregarSinModificaciones(entrega) {

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
                        this.procesar(entrega, entrega.productos, "Entregada sin modificaciones", "entregada", 0).then((respuesta) => {
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

    calcularMontoAPagar(productos, descuento) {
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
            peticion.entrega_id = pedido.entrega.id;
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

    procesar(entrega, productosEntregados, observaciones, estado, entregas_adelantadas, pagaCon?) {
        return new Promise((resolve) => {
            let peticion = new Object() as ObjProcesamientoEntrega;

            peticion.entrega_id = entrega.entrega.id;
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

            peticion.data.monto_a_pagar = this.calcularMontoAPagar(productosEntregados, entrega.pedido.descuento);

            if (pagaCon == undefined) {
                peticion.data.paga_con = peticion.data.monto_a_pagar;
            } else {
                peticion.data.paga_con = pagaCon;
            }

            peticion.data.productos_entregados = productosEntregados;

            console.log("SE ENVÍA LA PETICÓN: ", peticion)
            this.entregasHttp.procesarEntrega(peticion).subscribe((respuesta) => {
                console.log(respuesta);
                resolve(respuesta);
            });
        });
    }

    filtrarEntregas(entregas, reintentar:Array<number>, derivada:Array<number>, estado:Array<string>, repartidor_excepcional = [], alarma = [0,1], danger = [0,1]) {
        let entregas_crudas = [];
        entregas.filter((value) => {
            let entrega = value.entrega;
            let pedido = value.pedido;
            if (entrega == null) {
                return;
            }

            if(repartidor_excepcional.length == 0){
              repartidor_excepcional.push(pedido.repartidor_excepcional);
            }

            /*
            console.log("------")
            console.log(pedido.id)
            console.log(reintentar.includes(entrega.reintentar));
            console.log(derivada.includes(entrega.derivada))
            console.log(estado.includes(entrega.estado))
            console.log(repartidor_excepcional.includes(pedido.repartidor_excepcional));
            console.log(alarma.includes(pedido.alarma));
            console.log(danger.includes(pedido.danger));

            console.log("------")
            */
            if (reintentar.includes(entrega.reintentar)
                && derivada.includes(entrega.derivada)
                && estado.includes(entrega.estado)
                && repartidor_excepcional.includes(pedido.repartidor_excepcional)
                && alarma.includes(pedido.alarma)
                && danger.includes(pedido.danger)
                ) {
                entregas_crudas.push(value);
            }
        });
        return entregas_crudas;
    }


}
