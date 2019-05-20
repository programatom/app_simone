import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { EntregasLogicService, CommonService } from '../services/services.index';
import { ObjEntrega } from 'src/interfaces/interfaces';

@Component({
  selector: 'app-entregas-danger',
  templateUrl: './entregas-danger.page.html',
  styleUrls: ['./entregas-danger.page.scss'],
})
export class EntregasDangerPage implements OnInit {

  entregasDanger = [];
  pedidosDangerDisplay = [];

  constructor(private navCtrl: NavController,
              private entregasLogic: EntregasLogicService,
              private commonServ: CommonService) { }

  ngOnInit() {
    this.entregasDanger = this.entregasLogic.arrayEntregasSeleccionado;
    console.log(this.entregasDanger);
    this.pedidosDangerDisplay = JSON.parse(JSON.stringify(this.entregasDanger));
  }

  dismiss(){
    this.navCtrl.navigateBack("/tabs/entregas-habituales-hoy");
  }

  filtrarEntregas(event){
    let filtro = event.detail.value;

    // ARRAY    OBJs   ENTREGA obj  PEDIDO obj USUARIO ROL obj
    // En cada elemento del array, sacar las keys de cada obj e iterar esas keys
    let searchKeys = ["nombre" , "user_id", "localidad" , "calle", "role", "observaciones" , "estado"];
    let results = this.commonServ.filtroArrayObjsOfObjs(this.entregasDanger, filtro, searchKeys);
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
