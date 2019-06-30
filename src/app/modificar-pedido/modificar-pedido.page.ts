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

  pedido = new Object as ObjEntrega;

  pagaCon:number = 0;
  montoAPagar:number = 0;
  productos = [];
  productosDeLaEmpresa = [];
  observaciones = "";
  entregasAdelantadas:number = 0;
  descuento = 0;
  productoSeleccionado;

  constructor(public entregasLogic: EntregasLogicService,
              private navCtrl: NavController,
              private toastServ: ToastService,
              private pedidosServ: PedidosService) {
                this.pedido.entregas = {};
                this.pedido.rol = {};
                this.pedido.pedido = {};
                this.pedido.productos = [];
                this.pedido.usuario = {};
              }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.pedido = this.entregasLogic.pedidoSeleccionado;
    this.productosDeLaEmpresa = this.entregasLogic.productos;
    if(!this.entregasLogic.isEntregaCreation){
      this.scheduledLogic();
    }else{
      this.entregasLogic.isEntregaCreation = false;
    }
  }

  scheduledLogic(){

    this.descuento = this.pedido.pedido.descuento;
    this.observaciones = this.pedido.entregas.observaciones;
    this.montoAPagar = this.entregasLogic.calcularMontoAPagar(this.pedido.entregas.productos, this.descuento,this.pedido.pedido.expiracion_descuento);

    if(this.pedido.entregas.estado != "sin procesar"){
      this.pagaCon = this.pedido.entregas.paga_con;
      this.entregasAdelantadas = this.pedido.entregas.entregas_adelantadas;
    }else{
      this.pagaCon = this.montoAPagar;
    }
    this.productos = JSON.parse(JSON.stringify(this.pedido.entregas.productos));
    this.productosDeLaEmpresa = this.entregasLogic.productos;
  }

  dismiss(){
    this.navCtrl.navigateRoot(this.entregasLogic.modificarPedidoDismissUrl)
  }

  agregar(i){
    this.productos[i].cantidad = this.productos[i].cantidad + 1;
    this.actualizarDatosDePago();
  }

  actualizarDatosDePago(){
    this.montoAPagar = this.entregasLogic.calcularMontoAPagar(this.productos, this.pedido.pedido.descuento, this.pedido.pedido.expiracion_descuento);
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
          // En este punto, al procesarse una entrega, se debería sacar la entrega
          // del display de la pantalla anterior. Debería generar una variable en el
          // servicio logico para tratarlo.

          this.entregasLogic.procesar(this.pedido, [], this.observaciones, "cancelada",0,0).then((respuesta)=>{
            this.entregasLogic.entregaModificadaYProcesada = true;
            this.dismiss();
          }).catch((err) => {
            console.log("No se pudo procesar la entrega")
          });;
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
          this.entregasLogic.procesar(this.pedido, this.productos, this.observaciones, "entregada",this.entregasAdelantadas,this.pagaCon).then((respuesta)=>{
            this.entregasLogic.entregaModificadaYProcesada = true;
            this.dismiss();
          }).catch((err) => {
            console.log("No se pudo procesar la entrega")
          });;
        }
      }
    ];
    this.toastServ.presentAlert(header, undefined, undefined, buttons);
  }

  seleccionProducto(evento, button = "false"){
    console.log(this.productoSeleccionado)
    if(this.productoSeleccionado == undefined){
      this.toastServ.presentToast("Elija un producto");
      return;
    }
    var producto;
    if(button == "false"){
      producto = evento.detail.value;
    }else{
      producto = this.productoSeleccionado;
    }

    if(this.productos.filter((value)=>
      value.id == producto.id
    ).length > 0){
      this.toastServ.presentToast("Ya se ingresó éste producto");
      return;
    }else{
      this.productos.push({
        "nombre":producto.nombre,
        "precio":producto.precio,
        "cantidad":1,
        "id":producto.id
      });
      this.actualizarDatosDePago();

    }
  }
}
