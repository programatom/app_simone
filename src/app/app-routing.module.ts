import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'modificar-pedido', loadChildren: './modificar-pedido/modificar-pedido.module#ModificarPedidoPageModule' },
  { path: 'entregas-danger', loadChildren: './entregas-danger/entregas-danger.module#EntregasDangerPageModule' },
  { path: 'pedido-visualizer', loadChildren: './mis-pedidos/pedido-visualizer/pedido-visualizer.module#PedidoVisualizerPageModule' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
