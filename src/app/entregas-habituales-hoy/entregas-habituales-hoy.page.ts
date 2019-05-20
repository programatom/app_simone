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
  pedidosTotales = [];
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

    this.navCtrl.navigateForward("/entregas-danger");
  }

  buscarEntregasDanger(){
    this.entregasHttp.getEntregasDanger().subscribe((respuesta:any)=>{
      let pedidos = respuesta.data;
      console.log(respuesta);
      let entregasEnPeligro = [];

      for (let i = 0; i < pedidos.length; i ++){
        let dangerNotFoundInPedido = true;
        let entregas = pedidos[i].entregas;
        for(let j = 0; j < entregas.length; j ++){
          let entrega = entregas[j];
          if(entrega.estado == "sin procesar" && entrega.out_of_schedule == "0"){
            dangerNotFoundInPedido = false;
            entregasEnPeligro.push(entrega);
            pedidos[i].entregas = [];
            pedidos[i].entregas.push(entrega);
          }
        }
        if(dangerNotFoundInPedido){
          pedidos.splice(i, 1);
        }
      }
      this.entregasLogic.arrayEntregasSeleccionado = pedidos;
      this.danger = entregasEnPeligro;
    });
  }

  actualizarEInstanciarProductos(){
    this.entregasHttp.getProductos().subscribe((productos)=>{
      this.entregasLogic.productos = productos.data;
    });
  }

  buscarEntregasDeHoyYfiltrar(){
    this.entregasHttp.getEntregasHabitualesHoy().subscribe((pedidos)=>{
      console.log(pedidos);
      let pedidosSinProcesarHoy = this.entregasLogic.filtrarEntregas(pedidos.data, [0], [0], ["sin procesar"]);
      this.pedidosTotales = JSON.parse(JSON.stringify(pedidosSinProcesarHoy));
      this.pedidosDisplay = JSON.parse(JSON.stringify(pedidosSinProcesarHoy));
    });
  }

  buscarEntrega(event){
    let filtro = event.detail.value;

    let pedidosCopy = JSON.parse(JSON.stringify(this.pedidosTotales));
    let results = this.commonServ.filtroArrayObjsOfObjs(pedidosCopy, filtro);
    this.pedidosDisplay = results;
  }

  verInfo(pedido, index_entrega){
    this.entregasLogic.verInfoPedido(pedido,index_entrega)
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
          this.entregasLogic.linkEntregaSelectedForNavigation(pedido,index_entrega);

          this.entregasLogic.entregaAReintentarODerivar(this.entregasLogic.pedidoSeleccionado,0,1,"").then((respuesta)=>{
            this.pedidosDisplay[index_pedido].entregas.splice(index_entrega, 1);
          });
        }
      }
    ];

    this.toastServ.presentAlert(header, undefined, undefined, buttons);
  }



  entregarSinModificaciones(pedido:ObjEntrega, index_pedido, index_entrega){
    this.entregasLogic.entregasSinModifYSpliceLista(pedido, index_pedido, index_entrega, this.pedidosDisplay)
                      .then(()=>{
                      });
  }

  modificar(pedido, index_entrega){
    this.entregasLogic.modificarEntrega(pedido, index_entrega);
  }


}
