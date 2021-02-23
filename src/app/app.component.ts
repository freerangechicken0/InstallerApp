import { Component } from '@angular/core';

import { MenuController, Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AuthenticationService } from './core/_services/authentication.service';
import { Router } from '@angular/router';
import { MixpanelService } from './core/_services/mixpanel.service';
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
    private authenticationService: AuthenticationService,
    private router: Router,
    private mixpanelService: MixpanelService
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
    this.mixpanelService.initialiseMixpanel();
  }

  public logout() {
    this.authenticationService.logout();
    this.mixpanelService.trackEvent("Logged out");
    this.router.navigate(['/login']);
  }
}
