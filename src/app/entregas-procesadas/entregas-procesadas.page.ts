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
    this.fechaDesde = this.commonServ.hoy();
    this.hoy = this.fechaDesde;
    //hoy.setDate(hoy.getDate() + 1);
    //this.fechaHasta = hoy.getFullYear() + "/" + this.addCeroToNumber(hoy.getMonth() + 1) + "/" + this.addCeroToNumber(hoy.getDate());
    this.fechaHasta = this.hoy;
    this.inicializarEntregasConReintentarYProcesadasHoy().then(()=>{
      console.log(this.hastafilter);
      this.hastafilter = this.hoy;

      return;
    });
  }

  inicializarEntregasConReintentarYProcesadasHoy(){
    this.pedidosDisplay = [];
    this.pedidosTotales = [];
    return new Promise((resolve)=>{
      this.buscarPedidos().then((pedidos:Array<any>)=>{
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

  // HISTORIAL, MUESTRA TODAS LAS ENTREGAS != SIN PROCESAR
  // HOY, MUESTRA TODAS LAS ENTREGAS DE HOY A REINTENTAR Y SIN PROCESAR



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

 buscarPedidos(){
   return new Promise((resolve)=>{
     let data = {
       "desde": this.fechaDesde,
       "hasta": this.fechaHasta
     }
     this.entregasHttp.getEntregasDateFilter(data).subscribe((respuesta)=>{
       console.log(respuesta)
       resolve(respuesta.data);
     });
   });
 }

 buscarEntregasDistintasAHoy(){
   this.isHoyScreen = false;
   this.buscarPedidos().then((pedidos:any)=>{
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

   this.entregasLogic.modificarEntrega(pedido, index_pedido);
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
