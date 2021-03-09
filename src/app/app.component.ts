import { Component } from '@angular/core';

import { MenuController, Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private menuController: MenuController,
    private router: Router,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      setTimeout(async () => {
        await SplashScreen.hide();
      }, 1000);

      this.menuController.enable(true);
    });
  }

  public logout() {
    this.router.navigate(['/login']);
  }
}
