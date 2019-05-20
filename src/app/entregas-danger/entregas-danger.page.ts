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

  entregasDanger = [];
  pedidosDangerDisplay = [];
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
    this.entregasDanger = this.entregasLogic.arrayEntregasSeleccionado;
    console.log(this.entregasDanger);
    this.pedidosTotales = JSON.parse(JSON.stringify(this.entregasDanger));
    this.pedidosDangerDisplay = JSON.parse(JSON.stringify(this.entregasDanger));
  }

  dismiss(){
    this.navCtrl.navigateBack("/tabs/entregas-habituales-hoy");
  }

  filtrarEntregas(event){
    let filtro = event.detail.value;
    let pedidosCopy = JSON.parse(JSON.stringify(this.pedidosTotales));
    let results = this.commonServ.filtroArrayObjsOfObjs(pedidosCopy, filtro);
    this.pedidosDangerDisplay = results;
  }

  verInfo(pedido, index_entrega){
    this.entregasLogic.verInfoPedido(pedido,index_entrega)
  }

  entregarSinModificaciones(pedido:ObjEntrega, index_pedido, index_entrega){
    this.entregasLogic.entregasSinModifYSpliceLista(pedido, index_pedido, index_entrega, this.pedidosDangerDisplay)
                      .then(()=>{

                      });
  }

  modificar(pedido, index_entrega){
    this.entregasLogic.modificarEntrega(pedido, index_entrega);
  }

}
