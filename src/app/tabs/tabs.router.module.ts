import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'info-pedido',
        loadChildren: '../info-pedido/info-pedido.module#InfoPedidoPageModule'
      },
      {
        path: 'modificar-pedido',
        loadChildren: '../modificar-pedido/modificar-pedido.module#ModificarPedidoPageModule'
      },
      {
        path: 'entregas-habituales-hoy',
        children: [
          {
            path: '',
            loadChildren: '../entregas-habituales-hoy/entregas-habituales-hoy.module#EntregasHabitualesHoyPageModule'
          }
        ]
      },
      {
        path: 'mis-pedidos',
        children: [
          {
            path: '',
            loadChildren: '../mis-pedidos/mis-pedidos.module#MisPedidosPageModule'
          },
          {
            path: 'pedidos-visualizer',
            loadChildren: '../mis-pedidos/pedido-visualizer/pedido-visualizer.module#PedidoVisualizerPageModule'
          }
        ]
      },
      {
        path: 'entregas-procesadas',
        children: [
          {
            path: '',
            loadChildren: '../entregas-procesadas/entregas-procesadas.module#EntregasProcesadasPageModule'
          }
        ]
      },
      {
        path: 'alarma-derivadas',
        children: [
          {
            path: '',
            loadChildren: '../alarma-derivadas/alarma-derivadas.module#AlarmaDerivadasPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/entregas-habituales-hoy',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/entregas-habituales-hoy',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
