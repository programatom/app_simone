import { Component, OnInit } from '@angular/core';
import { EntregasLogicService, EntregasHttpService, CommonService } from '../services/services.index';
import { NavController } from '@ionic/angular';
import { ObjEntrega } from 'src/interfaces/interfaces';

@Component({
  selector: 'app-alarma-derivadas',
  templateUrl: './alarma-derivadas.page.html',
  styleUrls: ['./alarma-derivadas.page.scss'],
})
export class AlarmaDerivadasPage implements OnInit {

  entregas = [];
  entregasDisplay = [];

  constructor(private entregasLogic: EntregasLogicService,
              private entregasHttp: EntregasHttpService,
              private navCtrl: NavController,
              private commonServ: CommonService) { }

  ngOnInit() {
    this.inicializarEntregasAMostrar();
  }

  async refresh(event){
    await this.inicializarEntregasAMostrar();
    event.target.complete();
  }

  async inicializarEntregasAMostrar(){
    this.entregasHttp.getEntregasAlarmaYDerivadas().subscribe((respuesta:any)=>{
      console.log(respuesta);
      let entregasDerivadas = this.entregasLogic.filtrarEntregas(respuesta.data,[0],[1],["sin procesar"],[respuesta.nombre_empleado]);
      let entregasConAlarma = this.entregasLogic.filtrarEntregas(respuesta.data,[0],[0],["sin procesar"],[],[1]);
      console.log(entregasConAlarma);
      let concat = entregasDerivadas.concat(entregasConAlarma);
      if(concat.length > 20){
        concat = concat.splice(0, 20);
      }
      this.entregas = concat;
      this.entregasDisplay = JSON.parse(JSON.stringify(this.entregas));
      return;
    });
  }

  entregarSinModificaciones(entrega:ObjEntrega, index){
    this.entregasLogic.entregarSinModificaciones(entrega).then(()=>{
      this.entregas.splice(index, 1);
      this.entregasDisplay.splice(index, 1);
    });
  }

  modificar(entrega){
    this.entregasLogic.entregaSeleccionada = entrega;
    this.entregasLogic.modificarPedidoDismissUrl = "/tabs/alarma-derivadas";
    this.entregasLogic.isScheduled = true;
    this.navCtrl.navigateForward("/modificar-pedido");
  }

  filtrarEntregas(event){
    let filtro = event.detail.value;

    // ARRAY    OBJs   ENTREGA obj  PEDIDO obj USUARIO ROL obj
    // En cada elemento del array, sacar las keys de cada obj e iterar esas keys
    let searchKeys = ["nombre" , "user_id", "localidad" , "calle", "role", "observaciones" , "estado"];
    let results = this.commonServ.filtroArrayObjsOfObjs(this.entregas, filtro, searchKeys);
    this.entregasDisplay = results;
  }

}
