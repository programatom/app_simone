import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MisPedidosPage } from './mis-pedidos.page';
import { PipesModule } from '../pipes/pipes.module';
import { DiaPipe } from '../pipes/dia.pipe';

const routes: Routes = [
  {
    path: '',
    component: MisPedidosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipesModule
  ],
  declarations: [MisPedidosPage],
  providers:[DiaPipe]
})
export class MisPedidosPageModule {}
