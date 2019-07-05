import { Component, OnInit } from '@angular/core';
import { EntregasHttpService, CommonService, ToastService } from '../services/services.index';
import { EntregasLogicService } from '../services/entregas/entregas-logic.service';
import { ObjEntrega } from 'src/interfaces/interfaces';
import { NavController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-entregas-procesadas',
  templateUrl: './entregas-procesadas.page.html',
  styleUrls: ['./entregas-procesadas.page.scss'],
})
export class EntregasProcesadasPage implements OnInit {

  fechaDesde:string;
  fechaHasta:string;
  hoy:string;
  pedidosTotales = [];
  pedidosDisplay = [];

  isHoyScreen = true;
  hastafilter;

  constructor(private entregasHttp: EntregasHttpService,
              private entregasLogic: EntregasLogicService,
              private navCtrl: NavController,
              public commonServ: CommonService,
              private toastServ: ToastService,
              private router: Router) {
                this.routeEvent(this.router);
              }

  routeEvent(router: Router){
    router.events.subscribe(e => {
      if(e instanceof NavigationEnd){
        if(e.url == "/tabs/entregas-procesadas"){
          if(this.entregasLogic.entregaModificadaYProcesada){
            this.refreshCurrentView();
            this.entregasLogic.entregaModificadaYProcesada = false;
          }
        }
      }
    });
  }

  refreshCurrentView(){
    if(this.isHoyScreen){
      this.buscarFechaDeHoyYInicializarPantalla();
    }else{
      this.buscarEntregasDistintasAHoy()
    }
  }


  ngOnInit() {
    this.buscarFechaDeHoyYInicializarPantalla();
  }

  async buscarFechaDeHoyYInicializarPantalla(){
    this.inicializarEntregasConReintentarYProcesadasHoy().then(()=>{
      return;
    });
  }

  inicializarEntregasConReintentarYProcesadasHoy(){
    this.pedidosDisplay = [];
    this.pedidosTotales = [];
    return new Promise((resolve)=>{
      this.buscarEntregas(this.commonServ.hoy(), this.commonServ.hoy()).then((pedidos:Array<any>)=>{
        console.log(pedidos);
        pedidos.filter((pedido)=>{
          let entregasPedido = pedido.entregas;
          let pedidoIn = false;
          entregasPedido.filter((entrega)=>{
            if(entrega.reintentar == 1 || entrega.estado != "sin procesar"){
              if(!pedidoIn){
                pedidoIn = true;
                this.pedidosTotales.push(pedido);
                this.pedidosDisplay.push(pedido);
              }
            }
          });
        })
      });
      resolve();
    });

  }

  elegirFecha(event, tipo){
    console.log(event)
    let fecha:string = event.detail.value;
    fecha = fecha.split("T")[0];
    let fechaSplit = fecha.split("-");
    fecha = fechaSplit[0] + "/" + fechaSplit[1] + "/" + fechaSplit[2];
    console.log(tipo)
    switch(tipo)
    {
      case "desde":
        this.fechaDesde = fecha;
        break;
      case "hasta":
        this.fechaHasta = fecha;
        break;
    }
 }

 buscarEntregas(desde, hasta){
   return new Promise((resolve)=>{
     let data = {
       "desde": desde,
       "hasta": hasta
     }
     console.log("Data enviada a busqueda filtrando fechas: ", data)
     this.entregasHttp.getEntregasDateFilter(data).subscribe((respuesta)=>{
       console.log(respuesta)
       resolve(respuesta.data);
     });
   });
 }

 buscarEntregasDistintasAHoy(){
   this.isHoyScreen = false;
   this.buscarEntregas(this.fechaDesde, this.fechaHasta).then((pedidos:any)=>{
     pedidos = this.entregasLogic.filtrarEntregas(pedidos, [0,1], [0,1], ["cancelada", "entregada"]);
     if(pedidos.length > 20){
       this.pedidosTotales = pedidos.splice(0, 20)
       this.pedidosDisplay = pedidos.splice(0, 20);
       return;
     }
     this.pedidosTotales = pedidos;
     this.pedidosDisplay = pedidos;
   })
 }

 async refresh(event){
   this.isHoyScreen = true;
   await this.buscarFechaDeHoyYInicializarPantalla();
   event.target.complete();
 }

 entregarSinModificaciones(pedido:ObjEntrega, index_pedido, index_entrega){
   this.entregasLogic.previousDisplayObjArray.has_to_eliminate = false;
   this.linkPedidoWithOneEntrega(pedido, index_entrega);
   this.entregasLogic.entregarSinModificaciones(pedido).then(()=>{
     this.pedidosDisplay[index_pedido].entregas.splice(index_entrega, 1);
   });
 }


 verInfo(pedido, index_entrega){
   this.linkPedidoWithOneEntrega(pedido, index_entrega);
   this.entregasLogic.infoPedidoDismissUrl = "/tabs/entregas-procesadas";
   this.navCtrl.navigateForward("/tabs/info-pedido");
 }

 filtroAdelantadas(entrega){
   if(entrega.adelanta == 1){
     let fechaPotencialEntrega = entrega.fecha_de_entrega_potencial;
     if(fechaPotencialEntrega == this.hoy){
       return;
     }else{
       this.toastServ.presentToast("No se puede modificar entregas que adelantan otras entregas en un dia distinto a su fecha de entrega. Cancele la entrega y genere una entrega nueva en el pedido correspondiente",
     "error", "middle", 10000);
     }
   }
 }

 linkPedidoWithOneEntrega(pedido, index_entrega){
   this.entregasLogic.pedidoSeleccionado = JSON.parse(JSON.stringify(pedido));
   this.entregasLogic.pedidoSeleccionado.entregas = pedido.entregas[index_entrega];
   return;
 }

 modificar(pedido, index_pedido, index_entrega){

   this.entregasLogic.previousDisplayObjArray.has_to_eliminate = false;

   this.entregasLogic.modificarEntrega(pedido, index_entrega);
 }

 ionViewWillEnter(){
   if(this.entregasLogic.entregaModificadaYProcesada){
     this.entregasLogic.entregaModificadaYProcesada = false;
     if(this.isHoyScreen){
       this.buscarFechaDeHoyYInicializarPantalla();
     }else{
       this.buscarEntregasDistintasAHoy();
     }
   }
 }

 filtrarEntregas(event){
   let filtro = event.detail.value;

   let pedidosCopy = JSON.parse(JSON.stringify(this.pedidosTotales));
   let results = this.commonServ.filtroArrayObjsOfObjs(pedidosCopy, filtro);
   this.pedidosDisplay = results;
 }



}
