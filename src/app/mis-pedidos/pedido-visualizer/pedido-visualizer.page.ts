import { Component, OnInit } from '@angular/core';
import { PedidosService } from 'src/app/services/pedidos/pedidos.service';
import { NavController } from '@ionic/angular';
import { EntregasLogicService } from 'src/app/services/services.index';

@Component({
  selector: 'app-pedido-visualizer',
  templateUrl: './pedido-visualizer.page.html',
  styleUrls: ['./pedido-visualizer.page.scss'],
})
export class PedidoVisualizerPage implements OnInit {

  pedido;
  monto_a_pagar = 0;

  constructor(private pedidosServ: PedidosService,
              private navCtrl: NavController,
              private entregasLogic: EntregasLogicService) { }

  ngOnInit() {
    this.pedido = this.pedidosServ.pedidoSeleccionado;
    this.monto_a_pagar = this.entregasLogic.calcularMontoAPagar(this.pedido.pedido.productos, this.pedido.pedido.descuento, this.pedido.pedido.expiracion_descuento);
  }

  nuevaEntrega(){
    this.entregasLogic.pedidoSeleccionado = this.pedido;
    this.entregasLogic.isScheduled = false;
    this.entregasLogic.modificarPedidoDismissUrl = "/pedido-visualizer"
    this.navCtrl.navigateForward("/modificar-pedido");
  }

  dismiss(){
    this.navCtrl.navigateBack("/tabs/mis-pedidos");
  }

}
