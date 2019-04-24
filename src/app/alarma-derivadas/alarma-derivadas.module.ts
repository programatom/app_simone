import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AlarmaDerivadasPage } from './alarma-derivadas.page';

const routes: Routes = [
  {
    path: '',
    component: AlarmaDerivadasPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AlarmaDerivadasPage]
})
export class AlarmaDerivadasPageModule {}
