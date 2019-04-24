import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EntregasProcesadasPage } from './entregas-procesadas.page';

const routes: Routes = [
  {
    path: '',
    component: EntregasProcesadasPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EntregasProcesadasPage]
})
export class EntregasProcesadasPageModule {}
