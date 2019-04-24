import { Component, OnInit } from '@angular/core';
import { PedidosService } from '../services/pedidos/pedidos.service';
import { DiaPipe } from "../pipes/dia.pipe";
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-mis-pedidos',
  templateUrl: './mis-pedidos.page.html',
  styleUrls: ['./mis-pedidos.page.scss'],
})
export class MisPedidosPage implements OnInit {


  pedidos = [];
  pedidosDisplay = [];

  constructor(private pedidosServ: PedidosService,
              private navCtrl: NavController,
              private diaPipe: DiaPipe) { }

  ngOnInit() {
    this.inicializarPedidos();
  }

  inicializarPedidos(){
    this.pedidosServ.getPedidos().subscribe((respuesta)=>{
      console.log(respuesta);
      let pedidos = respuesta.data;
      this.pedidos = pedidos;
      this.pedidosDisplay = this.spliceResults(pedidos);
    });
  }

  spliceResults(array){
    if(array.length > 20){
      var result = array.splice(0,20);
      return result;
    }
    return array;
  }



  filtrarPedidos(event){
    let filtro = event.detail.value;
    console.log(filtro)
    filtro = filtro.toString().toLowerCase();
    let results = [];
    let match = false;
    let matchKey;
    for(let i = 0; i < this.pedidos.length; i ++){
      let pedido = this.pedidos[i];
      let pedidoKeys = Object.keys(pedido);

      for (let j = 0; j < pedidoKeys.length; j ++){
        let key = pedidoKeys[j];
        let objectValue;
        if(key == "dia_de_entrega"){
          objectValue = this.diaPipe.transform(pedido[key]).toLowerCase();

          console.log(objectValue, pedido[key]);
        }else if(typeof(pedido[key]) == "object"){
          objectValue = pedido[key][0].name;
        }else{
          objectValue = pedido[key].toString().toLowerCase();
        }
        if(objectValue.search(filtro) != -1){
          matchKey = key;
          match = true;
          break;
        }
      }
      if(match){
        console.log(match, matchKey)
        results.push(pedido);
      }else{
        let usuarioNombre = pedido.usuario[0].name;
        if(usuarioNombre.toString().toLowerCase().search(filtro) != -1){
          results.push(pedido);
        }
      }
    }
    this.pedidosDisplay = this.spliceResults(results);
  }

  irAPedido(pedido){
    this.pedidosServ.getPedidosShowAdmin(pedido.id).subscribe((respuesta)=>{
      console.log(respuesta);
      this.pedidosServ.pedidoSeleccionado = respuesta.data;
      this.navCtrl.navigateForward("/pedido-visualizer");
    });
  }

}
