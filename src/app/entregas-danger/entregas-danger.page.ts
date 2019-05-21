import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { EntregasLogicService, CommonService } from '../services/services.index';
import { ObjEntrega } from 'src/interfaces/interfaces';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-entregas-danger',
  templateUrl: './entregas-danger.page.html',
  styleUrls: ['./entregas-danger.page.scss'],
})
export class EntregasDangerPage implements OnInit {

  pedidosDisplay = [];
  pedidosTotales = [];
  constructor(private navCtrl: NavController,
              private entregasLogic: EntregasLogicService,
              private commonServ: CommonService,
              private router: Router) {

              }
    routeEvent(router: Router){
      router.events.subscribe(e => {
        if(e instanceof NavigationEnd){
          if(e.url == "/tabs/entregas-danger"){
            if(this.entregasLogic.entregaModificadaYProcesada){

              this.entregasLogic.entregaModificadaYProcesada = false;
            }
          }
        }
      });
    }

  ngOnInit() {
    this.pedidosTotales = JSON.parse(JSON.stringify(this.entregasLogic.arrayPedidosEnPeligro));
    this.pedidosDisplay = JSON.parse(JSON.stringify(this.entregasLogic.arrayPedidosEnPeligro));
  }

  dismiss(){
    this.navCtrl.navigateBack("/tabs/entregas-habituales-hoy");
  }

  filtrarEntregas(event){
    let filtro = event.detail.value;
    let pedidosCopy = JSON.parse(JSON.stringify(this.pedidosTotales));
    let results = this.commonServ.filtroArrayObjsOfObjs(pedidosCopy, filtro);
    this.pedidosDisplay = results;
  }

  verInfo(pedido, index_entrega){
    this.entregasLogic.verInfoPedido(pedido,index_entrega)
  }

  entregarSinModificaciones(pedido:ObjEntrega, index_pedido, index_entrega){

    this.entregasLogic.entregasSinModifYSpliceLista(pedido, index_pedido, index_entrega, this.pedidosDisplay)
                      .then(()=>{
                        let id_entrega = pedido.entregas.id;
                        let index_entrega_in_danger_array = this.entregasLogic.danger.findIndex((value)=> value.id == id_entrega);
                        this.entregasLogic.danger.splice(index_entrega_in_danger_array , 1);
                        this.entregasLogic.arrayPedidosEnPeligro[index_pedido].entregas.splice(index_entrega, 1);


                      });
  }

  modificar(pedido, index_pedido, index_entrega){
    this.entregasLogic.previousDisplayObjArray.index_pedido = index_pedido;
    this.entregasLogic.previousDisplayObjArray.index_pedido = index_entrega;
    this.entregasLogic.previousDisplayObjArray.array = this.pedidosDisplay;
    this.entregasLogic.modificarEntrega(pedido, index_pedido);
  }

}
