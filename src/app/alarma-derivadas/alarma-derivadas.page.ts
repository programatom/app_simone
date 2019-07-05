import { Component, OnInit } from '@angular/core';
import { EntregasLogicService, EntregasHttpService, CommonService } from '../services/services.index';
import { ObjEntrega } from 'src/interfaces/interfaces';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-alarma-derivadas',
  templateUrl: './alarma-derivadas.page.html',
  styleUrls: ['./alarma-derivadas.page.scss'],
})
export class AlarmaDerivadasPage implements OnInit {

  entregas = [];
  pedidosDisplay = [];
  pedidosTotales = [];
  constructor(private entregasLogic: EntregasLogicService,
              private entregasHttp: EntregasHttpService,
              private commonServ: CommonService,
              private router: Router) {
                this.routeEvent(this.router);
              }
  routeEvent(router: Router){
    router.events.subscribe(e => {
      if(e instanceof NavigationEnd){
        if(e.url == "/tabs/alarma-derivadas"){
          if(this.entregasLogic.entregaModificadaYProcesada){
            //this.inicializarEntregasAMostrar();
            this.entregasLogic.entregaModificadaYProcesada = false;
          }
        }
      }
    });
  }
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
      // Aca me llegan los pedidos con (habitual y alarma) y excepcional de este usuario.
      // Yo de esto quiero las entregas que no están procesadas y las derivadas de las excepcionales.

      let entregasDerivadas = this.entregasLogic.filtrarEntregas(respuesta.data.excepcionales,[0],[1],["sin procesar"],[respuesta.id_empleado]);
      let pedidosConAlarma = this.entregasLogic.filtrarEntregas(respuesta.data.habituales_alarma,[0, 1],[0],["sin procesar"],[],[1]);
      let concat = entregasDerivadas.concat(pedidosConAlarma);
      console.log(pedidosConAlarma);
      console.log(entregasDerivadas);
      if(concat.length > 20){
        concat = concat.splice(0, 20);
        this.pedidosTotales = concat;
      }
      this.pedidosDisplay = JSON.parse(JSON.stringify(concat));
      this.pedidosTotales = concat;
      return;
    });
  }

  entregarSinModificaciones(pedido:ObjEntrega, index_pedido, index_entrega){
    this.entregasLogic.entregasSinModifYSpliceLista(pedido, index_pedido, index_entrega, this.pedidosDisplay)
                      .then(()=>{

                      });
  }

  modificar(pedido, index_pedido, index_entrega){
    this.entregasLogic.previousDisplayObjArray.index_pedido = index_pedido;
    this.entregasLogic.previousDisplayObjArray.index_pedido = index_entrega;
    this.entregasLogic.previousDisplayObjArray.array = this.pedidosDisplay;
    this.entregasLogic.modificarEntrega(pedido, index_entrega);
  }

  verInfo(pedido, index_entrega){
    this.entregasLogic.verInfoPedido(pedido,index_entrega);
  }

  filtrarEntregas(event){
    let filtro = event.detail.value;

    let pedidosCopy = JSON.parse(JSON.stringify(this.pedidosTotales));
    let results = this.commonServ.filtroArrayObjsOfObjs(pedidosCopy, filtro);
    this.pedidosDisplay = results;
  }

}
