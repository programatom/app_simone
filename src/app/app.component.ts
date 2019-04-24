import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { LocalStorageService } from './services/services.index';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private localStorageServ: LocalStorageService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.localStorageServ.searchAndInstantiateKey("token").then((respuesta:any)=>{
        if(respuesta.status == "success"){
          this.router.navigateByUrl("");
          this.statusBar.styleDefault();
          this.splashScreen.hide();
        }else{
          this.router.navigateByUrl("/login");
          this.statusBar.styleDefault();
          this.splashScreen.hide();
        }
      })

    });
  }
}
