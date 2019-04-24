import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModificarPedidoPage } from './modificar-pedido.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarPedidoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ModificarPedidoPage]
})
export class ModificarPedidoPageModule {}
