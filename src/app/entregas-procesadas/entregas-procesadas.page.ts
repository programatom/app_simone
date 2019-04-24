import { Component, OnInit } from '@angular/core';
import { EntregasHttpService, CommonService, ToastService } from '../services/services.index';
import { EntregasLogicService } from '../services/entregas/entregas-logic.service';
import { ObjEntrega } from 'src/interfaces/interfaces';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-entregas-procesadas',
  templateUrl: './entregas-procesadas.page.html',
  styleUrls: ['./entregas-procesadas.page.scss'],
})
export class EntregasProcesadasPage implements OnInit {

  fechaDesde:string;
  fechaHasta:string;
  hoy:string;

  entregasDisplay = [];
  entregas = [];

  isHoyScreen = true;

  constructor(private entregasHttp: EntregasHttpService,
              private entregasLogic: EntregasLogicService,
              private navCtrl: NavController,
              private commonServ: CommonService,
              private toastServ: ToastService) { }

  ngOnInit() {
    this.buscarFechaDeHoyYInicializarPantalla();
  }

  async buscarFechaDeHoyYInicializarPantalla(){
    let hoy = new Date();
    this.fechaDesde = hoy.getFullYear() + "/" + this.addCeroToNumber(hoy.getMonth() + 1) + "/" + this.addCeroToNumber(hoy.getDate());
    this.hoy = this.fechaDesde;
    hoy.setDate(hoy.getDate() + 1);
    this.fechaHasta = hoy.getFullYear() + "/" + this.addCeroToNumber(hoy.getMonth() + 1) + "/" + this.addCeroToNumber(hoy.getDate());
    this.inicializarEntregasConReintentarYSinProcesar().then(()=>{
      return;
    });
  }

  inicializarEntregasConReintentarYSinProcesar(){
    this.entregasDisplay = [];
    return new Promise((resolve)=>{
      this.buscarEntregas().then((entregas:Array<any>)=>{
        entregas.filter((value)=>{
          if(value.entrega.reintentar == 1){
            this.entregas.push(value);
            this.entregasDisplay.push(value);
          }

          if(value.entrega.estado != "sin procesar"){
            this.entregas.push(value);
            this.entregasDisplay.push(value);
          }
        })
      });
      resolve();
    })

  }

  // HISTORIAL, MUESTRA TODAS LAS ENTREGAS != SIN PROCESAR
  // HOY, MUESTRA TODAS LAS ENTREGAS DE HOY A REINTENTAR Y SIN PROCESAR

  addCeroToNumber(number) {

  if (parseInt(number) < 10) {
    return "0" + parseInt(number);
  } else {
    return number.toString();
  }
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

 buscarEntregas(){
   return new Promise((resolve)=>{
     let data = {
       "desde": this.fechaDesde,
       "hasta": this.fechaHasta
     }
     console.log(data);
     this.entregasHttp.getEntregasDateFilter(data).subscribe((respuesta)=>{
       console.log(respuesta)
       resolve(respuesta.data);
     });
   });
 }

 buscarEntregasDistintasAHoy(){
   this.isHoyScreen = false;
   this.buscarEntregas().then((entregas:any)=>{
     entregas = this.entregasLogic.filtrarEntregas(entregas, [0,1], [0,1], ["cancelada", "entregada"]);
     if(entregas.length > 20){
       this.entregas = JSON.parse(JSON.stringify(entregas));
       this.entregasDisplay = entregas.splice(0, 20);
       return;
     }
     this.entregas = JSON.parse(JSON.stringify(entregas));
     this.entregasDisplay = entregas;
   })
 }

 async refresh(event){
   this.isHoyScreen = true;
   await this.buscarFechaDeHoyYInicializarPantalla();
   event.target.complete();
 }

 entregarSinModificaciones(entrega:ObjEntrega, index){
   this.entregasLogic.entregarSinModificaciones(entrega).then(()=>{
     this.entregas.splice(index, 1);
     this.entregasDisplay.splice(index, 1);
   });
 }


 verInfo(entrega){
   this.entregasLogic.entregaSeleccionada = entrega;
   this.entregasLogic.infoPedidoDismissUrl = "/tabs/entregas-procesadas";
   this.navCtrl.navigateForward("/tabs/info-pedido");
 }

 filtroAdelantadas(entrega){
   if(entrega.entrega.adelanta == 1){
     let fechaPotencialEntrega = entrega.entrega.fecha_de_entrega_potencial;
     if(fechaPotencialEntrega == this.hoy){
       return;
     }else{
       this.toastServ.presentToast("No se puede modificar entregas que adelantan otras entregas en un dia distinto a su fecha de entrega. Cancele la entrega y genere una entrega nueva en el pedido correspondiente",
     "error", "middle", 10000);
     }
   }
 }

 modificar(entrega){
   this.filtroAdelantadas(entrega);
   this.entregasLogic.entregaSeleccionada = entrega;
   this.entregasLogic.modificarPedidoDismissUrl = "/tabs/entregas-procesadas";
   this.entregasLogic.isScheduled = true;
   this.navCtrl.navigateForward("/modificar-pedido");
 }

 ionViewWillEnter(){
   console.log("asd")
   if(this.entregasLogic.entregaModificadaYProcesada){
     this.entregasLogic.entregaModificadaYProcesada = false;
     console.log("Se modifico una entrgga")
     if(this.isHoyScreen){
       console.log("Se reestablece la pantalla de hoy")
       this.buscarFechaDeHoyYInicializarPantalla();
     }else{
       console.log("Se reestablece la pantalla de disintas de hoy")
       this.buscarEntregasDistintasAHoy();
     }
   }
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
