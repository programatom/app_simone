import { Component, OnInit } from '@angular/core';
import { EntregasLogicService } from '../services/entregas/entregas-logic.service';
import { ObjEntrega } from 'src/interfaces/interfaces';
import { NavController } from '@ionic/angular';
import { ToastService } from '../services/services.index';
import { PedidosService } from '../services/pedidos/pedidos.service';

@Component({
  selector: 'app-modificar-pedido',
  templateUrl: './modificar-pedido.page.html',
  styleUrls: ['./modificar-pedido.page.scss'],
})
export class ModificarPedidoPage implements OnInit {

  entrega = new Object as ObjEntrega;

  pagaCon:number = 0;
  montoAPagar:number = 0;
  productos = [];
  productosDeLaEmpresa = [];
  observaciones = "";
  entregasAdelantadas:number = 0;
  descuento = 0;

  constructor(public entregasLogic: EntregasLogicService,
              private navCtrl: NavController,
              private toastServ: ToastService,
              private pedidosServ: PedidosService) {
                this.entrega.entrega = {};
                this.entrega.rol = {};
                this.entrega.pedido = {};
                this.entrega.productos = [];
                this.entrega.usuario = {};
              }

  ngOnInit() {
  }

  ionViewWillEnter(){
    console.log(this.entregasLogic.isScheduled)

    if(this.entregasLogic.isScheduled){
      this.scheduledLogic();
    }else{
      this.newUnscheduledLogic();
    }
  }

  newUnscheduledLogic(){
    this.descuento = this.pedidosServ.pedidoSeleccionado.descuento;
    this.productosDeLaEmpresa = this.entregasLogic.productos;

  }

  scheduledLogic(){
    console.log("ScheduledLogic")
    this.entrega = this.entregasLogic.entregaSeleccionada;
    this.descuento = this.entrega.pedido.descuento;
    this.montoAPagar = this.entregasLogic.calcularMontoAPagar(this.entrega.productos, this.descuento);
    if(this.entrega.entrega.estado != "sin procesar"){
      this.pagaCon = this.entrega.entrega.paga_con;
      this.entregasAdelantadas = this.entrega.entrega.entregas_adelantadas;
    }else{
      this.pagaCon = this.montoAPagar;
    }
    this.productos = JSON.parse(JSON.stringify(this.entrega.productos));
    this.productosDeLaEmpresa = this.entregasLogic.productos;
  }

  dismiss(){
    this.navCtrl.navigateBack(this.entregasLogic.modificarPedidoDismissUrl)
  }

  agregar(i){
    this.productos[i].cantidad = this.productos[i].cantidad + 1;
    this.actualizarDatosDePago();
  }

  actualizarDatosDePago(){
    this.montoAPagar = this.entregasLogic.calcularMontoAPagar(this.productos, this.descuento);
    this.pagaCon = this.montoAPagar;
    return;
  }

  eliminar(i){
    if(this.productos[i].cantidad == 1){
      this.productos.splice(i, 1);
      this.actualizarDatosDePago();
      return;
    }
    this.productos[i].cantidad = this.productos[i].cantidad - 1;
    this.actualizarDatosDePago();
  }

  fieldValidation(){
    if(this.observaciones == ""){
      return "Observaciones";
    }

    return true;
  }


  cancelar(){
    if(this.fieldValidation() != true){
      this.toastServ.presentToast("El campo: " + this.fieldValidation() + " es requerido");
      return;
    };
    let header = "Cancelar entrega";
    let buttons = [
      {
        text:"Cancelar",
        role:"cancel"
      },
      {
        text:"Aceptar",
        handler:()=>{
          this.entregasLogic.procesar(this.entrega, [], this.observaciones, "cancelada",0,0).then((respuesta)=>{
            this.entregasLogic.entregaModificadaYProcesada = true;
            this.dismiss();
          });
        }
      }
    ];
    this.toastServ.presentAlert(header, undefined, undefined, buttons);
  }

  derivar(){
    if(this.fieldValidation() != true){
      this.toastServ.presentToast("El campo: " + this.fieldValidation() + " es requerido");
      return;
    };
    let header = "Derivar entrega";
    let buttons = [
      {
        text:"Cancelar",
        role:"cancel"
      },
      {
        text:"Aceptar",
        handler:()=>{
          this.entregasLogic.entregaAReintentarODerivar(this.entrega, 1, 0, this.observaciones).then((respuesta)=>{
            this.entregasLogic.entregaModificadaYProcesada = true;
            this.dismiss();
          });
        }
      }
    ];
    this.toastServ.presentAlert(header, undefined, undefined, buttons);
  }

  procesar(){
    if(this.observaciones == ""){
      this.observaciones = "Procesado sin comentarios"
    }

    let header = "Procesar entrega";
    let buttons = [
      {
        text:"Cancelar",
        role:"cancel"
      },
      {
        text:"Aceptar",
        handler:()=>{
          this.entregasLogic.procesar(this.entrega, this.productos, this.observaciones, "entregada",this.entregasAdelantadas,this.pagaCon).then((respuesta)=>{
            this.entregasLogic.entregaModificadaYProcesada = true;
            this.dismiss();
          });
        }
      }
    ];
    this.toastServ.presentAlert(header, undefined, undefined, buttons);
  }

  seleccionProducto(evento){
    let producto = evento.detail.value;
    this.productos.push({
      "nombre":producto.nombre,
      "precio":producto.precio,
      "cantidad":1,
      "id":producto.id
    });
    this.actualizarDatosDePago();
  }



}
