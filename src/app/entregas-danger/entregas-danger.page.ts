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
  entregasDangerDisplay = [];

  constructor(private navCtrl: NavController,
              private entregasLogic: EntregasLogicService,
              private commonServ: CommonService) { }

  ngOnInit() {
    this.entregasDanger = this.entregasLogic.arrayEntregasSeleccionado;
    this.entregasDangerDisplay = JSON.parse(JSON.stringify(this.entregasDanger));
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
    this.entregasDangerDisplay = results;
  }

  entregarSinModificaciones(entrega:ObjEntrega, index){
    this.entregasLogic.entregarSinModificaciones(entrega).then(()=>{
      this.entregasDanger.splice(index, 1);
      this.entregasDangerDisplay.splice(index, 1);
    })

  }

  modificar(entrega){
    this.entregasLogic.entregaSeleccionada = entrega;
    this.entregasLogic.modificarPedidoDismissUrl = "/entregas-danger";
    this.entregasLogic.isScheduled = true;
    this.navCtrl.navigateForward("/modificar-pedido");
  }

}
