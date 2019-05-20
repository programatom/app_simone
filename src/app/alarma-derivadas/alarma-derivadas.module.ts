import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AlarmaDerivadasPage } from './alarma-derivadas.page';
import { EmpleadoPipe } from '../pipes/empleado.pipe';
import { PipesModule } from '../pipes/pipes.module';
import { DiaPipe } from '../pipes/dia.pipe';

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
    RouterModule.forChild(routes),
    PipesModule

  ],
  declarations: [AlarmaDerivadasPage],
  providers:[EmpleadoPipe,DiaPipe]
})
export class AlarmaDerivadasPageModule {}
