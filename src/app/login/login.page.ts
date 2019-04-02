import { Component, OnInit } from '@angular/core';
import { AuthService, LocalStorageService, ToastService } from '../services/services.index';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    email = "";
    password = "";

    constructor(private auth: AuthService,
        private localStorageServ: LocalStorageService,
        private toastServ: ToastService,
        private navCtrl: NavController) { }

    ngOnInit() {
    }

    login() {
        let data = {
            "email": this.email,
            "password": this.password
        }
        this.auth.login(data).subscribe((respuesta) => {
            if (respuesta.status == "success") {
                if(respuesta.data.role != "empleado"){
                  this.toastServ.presentToast("Debe ingresar un usuario de rol empelado" ,"error");
                  return;
                }
                let token = respuesta.data.api_token;
                let nombre = respuesta.data.name;
                this.localStorageServ.insertAndInstantiateValue("token", token).then(() => {
                    this.toastServ.presentToast("Bienvenido " + nombre, "success");
                    this.navCtrl.navigateForward("");

                });
            } else {
                var mensajeError = "El email o la contraseña son incorrectos";
                this.toastServ.presentToast(mensajeError, "error");
            }
        })
    }

}
