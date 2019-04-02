import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    constructor(private toastCtrl: ToastController) { }

    async presentToast(message, estado = "neutro", position:any = "top", duration = 3000) {

        const toast = await this.toastCtrl.create({
            message: message,
            position: position,
            duration: duration,
            showCloseButton: true,
            closeButtonText: 'Cerrar',
            cssClass: estado
        });
        toast.present();
    }
}
