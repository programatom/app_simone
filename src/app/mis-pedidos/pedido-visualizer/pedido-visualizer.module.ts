import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PedidoVisualizerPage } from './pedido-visualizer.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: PedidoVisualizerPage
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
  declarations: [PedidoVisualizerPage]
})
export class PedidoVisualizerPageModule {}
