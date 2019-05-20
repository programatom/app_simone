import { Component } from '@angular/core';
import { EntregasLogicService } from '../services/entregas/entregas-logic.service';
import { NavController } from '@ionic/angular';
import { ObjEntrega } from 'src/interfaces/interfaces';

@Component({
  selector: 'app-info-pedido',
  templateUrl: './info-pedido.page.html',
  styleUrls: ['./info-pedido.page.scss'],
})
export class InfoPedidoPage {

  pedido = {} as ObjEntrega;

  monto_a_pagar = 0;

  constructor(private entregasLogic: EntregasLogicService,
              private navCtrl: NavController) {
                this.pedido.entregas = {};
                this.pedido.rol = {};
                this.pedido.pedido = {};
                this.pedido.productos = [];
                this.pedido.usuario = {};

              }

  ionViewWillEnter(){
    this.pedido = this.entregasLogic.pedidoSeleccionado;
    let productos = [];
    if(this.entregasLogic.isScheduled){
      productos = this.pedido.entregas.productos;
    }else{
      productos = this.entregasLogic.productos;
    }

    this.monto_a_pagar = this.entregasLogic.calcularMontoAPagar(productos, this.pedido.pedido.descuento,this.pedido.pedido.expiracion_descuento);
  }


  dismiss(){
    this.navCtrl.navigateRoot(this.entregasLogic.infoPedidoDismissUrl);
  }

}
