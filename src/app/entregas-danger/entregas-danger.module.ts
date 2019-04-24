import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EntregasDangerPage } from './entregas-danger.page';

const routes: Routes = [
  {
    path: '',
    component: EntregasDangerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EntregasDangerPage]
})
export class EntregasDangerPageModule {}
