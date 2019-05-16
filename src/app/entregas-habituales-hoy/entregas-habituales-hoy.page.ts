import { Component, OnInit } from '@angular/core';
import { EntregasHttpService } from '../services/entregas/entregas-http.service';
import { EntregasLogicService } from '../services/entregas/entregas-logic.service';
import { NavController } from '@ionic/angular';
import { ObjEntrega } from 'src/interfaces/interfaces';
import { ToastService, CommonService } from '../services/services.index';

@Component({
  selector: 'app-entregas-habituales-hoy',
  templateUrl: './entregas-habituales-hoy.page.html',
  styleUrls: ['./entregas-habituales-hoy.page.scss'],
})
export class EntregasHabitualesHoyPage implements OnInit {

  entregas = [];
  pedidosDisplay = [];

  danger = [];

  constructor(private entregasHttp: EntregasHttpService,
              private entregasLogic: EntregasLogicService,
              private navCtrl: NavController,
              private toastServ: ToastService,
              private commonServ: CommonService) { }

  ngOnInit() {
    this.buscarEntregasDeHoyYfiltrar();
    this.actualizarEInstanciarProductos();
    this.buscarEntregasDanger();
  }

  irADanger(){
    if(this.danger.length == 0){
      this.toastServ.presentToast("No hay entregas en estado de peligro!");
      return;
    }
    this.entregasLogic.arrayEntregasSeleccionado = this.danger;
    this.navCtrl.navigateForward("/entregas-danger");
  }

  buscarEntregasDanger(){
    this.entregasHttp.getEntregasDanger().subscribe((respuesta:any)=>{
      let entregas = respuesta.data;
      console.log(respuesta);
      let entregasDangerDerivadas = this.entregasLogic
                                           .filtrarEntregas(entregas, [0], [1], ["sin procesar"],[respuesta.nombre],[0],[1]);
      let entregasDangerPropias = this.entregasLogic
                                      .filtrarEntregas(entregas, [0, 1], [0],["sin procesar"],[],[0],[1]);
      console.log(entregasDangerPropias)
      this.danger = entregasDangerDerivadas.concat(entregasDangerPropias);
    });
  }

  actualizarEInstanciarProductos(){
    this.entregasHttp.getProductos().subscribe((productos)=>{
      this.entregasLogic.productos = productos.data;
    });
  }

  buscarEntregasDeHoyYfiltrar(){
    this.entregasHttp.getEntregasHabitualesHoy().subscribe((entregas)=>{
      console.log(entregas);
      this.entregas = this.entregasLogic.filtrarEntregas(entregas.data, [0], [0], ["sin procesar"]);
      this.pedidosDisplay = JSON.parse(JSON.stringify(this.entregas));
    });
  }

  buscarEntrega(event){
    let filtro = event.detail.value;

    // ARRAY    OBJs   ENTREGA obj  PEDIDO obj USUARIO ROL obj
    // En cada elemento del array, sacar las keys de cada obj e iterar esas keys
    let searchKeys = ["nombre" , "user_id", "localidad" , "calle", "role"];
    let results = this.commonServ.filtroArrayObjsOfObjs(this.entregas, filtro, searchKeys);
    this.pedidosDisplay = results;
  }

  verInfo(entrega, index_entrega){
    this.entregasLogic.entregaSeleccionada = JSON.parse(JSON.stringify(entrega));
    this.entregasLogic.entregaSeleccionada.entregas = entrega.entregas[index_entrega];
    console.log(this.entregasLogic.entregaSeleccionada)
    this.entregasLogic.infoPedidoDismissUrl = "/tabs/entregas-habituales-hoy";
    this.navCtrl.navigateForward("/tabs/info-pedido");
  }

  reintentar(entrega, index){

    let header = "Re-intentar la entrega mas tarde";
    let buttons = [
      {
        text:"Cancelar",
        role:"cancel"
      },
      {
        text:"Aceptar",
        handler:()=>{
          this.entregasLogic.entregaAReintentarODerivar(entrega,0,1,"").then((respuesta)=>{
            this.entregas.splice(index, 1);
            this.pedidosDisplay.splice(index, 1);
          });
        }
      }
    ];

    this.toastServ.presentAlert(header, undefined, undefined, buttons);
  }

  entregarSinModificaciones(entrega:ObjEntrega, index){
    this.entregasLogic.entregarSinModificaciones(entrega).then(()=>{
      this.entregas.splice(index, 1);
      this.pedidosDisplay.splice(index, 1);
    })

  }

  modificar(entrega){
    this.entregasLogic.entregaSeleccionada = entrega;
    this.entregasLogic.modificarPedidoDismissUrl = "/tabs/entregas-habituales-hoy";
    this.entregasLogic.isScheduled = true;
    this.navCtrl.navigateForward("/modificar-pedido");
  }

  ionViewWillEnter(){
    if(this.entregasLogic.entregaModificadaYProcesada){
      this.entregasLogic.entregaModificadaYProcesada = false;
      this.checkearCambiosEnLasEntregasHabituales();
    }
  }



  checkearCambiosEnLasEntregasHabituales(){
    this.buscarEntregasDeHoyYfiltrar();
  }

}
