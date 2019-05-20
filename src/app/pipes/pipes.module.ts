import { NgModule } from '@angular/core';
import { DiaPipe } from './dia.pipe';
import { IonicModule } from '@ionic/angular';
import { EmpleadoPipe } from './empleado.pipe';

@NgModule({
    declarations: [
        DiaPipe,
        EmpleadoPipe
    ],
    imports: [IonicModule],
    exports: [
        DiaPipe,
        EmpleadoPipe
    ]
})
export class PipesModule {}
