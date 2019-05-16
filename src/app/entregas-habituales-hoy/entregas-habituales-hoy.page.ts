import { Component, OnInit } from '@angular/core';
import { EntregasHttpService } from '../services/entregas/entregas-http.service';
import { EntregasLogicService } from '../services/entregas/entregas-logic.service';
import { NavController } from '@ionic/angular';
import { ObjEntrega } from 'src/interfaces/interfaces';
import { ToastService, CommonService } from '../services/services.index';
import { Router, NavigationEnd } from '@angular/router';

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
              private commonServ: CommonService,
              private router: Router) {
                this.routeEvent(this.router);

              }

    routeEvent(router: Router){
      router.events.subscribe(e => {
        if(e instanceof NavigationEnd){
          if(e.url == "/tabs/entregas-habituales-hoy"){
            this.buscarEntregasDeHoyYfiltrar();
            if(this.entregasLogic.entregaModificadaYProcesada){
              this.entregasLogic.entregaModificadaYProcesada = false;
            }
          }
        }
      });
    }
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
      let pedidos = this.entregasLogic.filtrarEntregas(entregas.data, [0], [0], ["sin procesar"]);
      this.pedidosDisplay = JSON.parse(JSON.stringify(pedidos));
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

  verInfo(pedido, index_entrega){
    this.linkEntregaSelectedForNavigation(pedido,index_entrega);
    this.entregasLogic.infoPedidoDismissUrl = "/tabs/entregas-habituales-hoy";
    this.navCtrl.navigateForward("/tabs/info-pedido");
  }

  reintentar(pedido, index_pedido, index_entrega){

    let header = "Re-intentar la entrega mas tarde";
    let buttons = [
      {
        text:"Cancelar",
        role:"cancel"
      },
      {
        text:"Aceptar",
        handler:()=>{
          this.linkEntregaSelectedForNavigation(pedido,index_entrega);

          this.entregasLogic.entregaAReintentarODerivar(this.entregasLogic.pedidoSeleccionado,0,1,"").then((respuesta)=>{
            this.pedidosDisplay[index_pedido].entregas.splice(index_entrega, 1);
          });
        }
      }
    ];

    this.toastServ.presentAlert(header, undefined, undefined, buttons);
  }

  linkEntregaSelectedForNavigation(pedido, index_entrega){
    this.entregasLogic.pedidoSeleccionado = JSON.parse(JSON.stringify(pedido));
    this.entregasLogic.pedidoSeleccionado.entregas = pedido.entregas[index_entrega];
    return;
  }

  entregarSinModificaciones(entrega:ObjEntrega, index_pedido, index_entrega){
    this.linkEntregaSelectedForNavigation(entrega, index_entrega);
    this.entregasLogic.entregarSinModificaciones(this.entregasLogic.pedidoSeleccionado).then(()=>{
      this.pedidosDisplay[index_pedido].entregas.splice(index_entrega, 1);
    });
  }

  modificar(pedido, index_entrega){
    this.linkEntregaSelectedForNavigation(pedido,index_entrega);
    this.entregasLogic.modificarPedidoDismissUrl = "/tabs/entregas-habituales-hoy";
    this.entregasLogic.isScheduled = true;
    this.navCtrl.navigateForward("/modificar-pedido");
  }


}
