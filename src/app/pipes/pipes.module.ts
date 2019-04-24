import { NgModule } from '@angular/core';
import { DiaPipe } from './dia.pipe';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [
        DiaPipe
    ],
    imports: [IonicModule],
    exports: [
        DiaPipe
    ]
})
export class PipesModule {}
