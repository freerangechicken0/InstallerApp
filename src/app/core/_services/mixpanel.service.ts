import { Injectable } from '@angular/core';
import { Mixpanel, MixpanelPeople } from '@ionic-native/mixpanel';
import { Platform } from '@ionic/angular';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class MixpanelService {

  constructor(
    private platform: Platform,
    private authenticationService: AuthenticationService
  ) { }

  private get isCordova() {
    return this.platform.is('cordova');
  }

  public initialiseMixpanel(): void {
    if (this.isCordova) {
      Mixpanel.init('3c5b8a2b4bce6b689219dbc3bcac3038')
        .then(() => {
          this.authenticationService.user.subscribe((user) => {
            if (user) {
              Mixpanel.registerSuperProperties({ name: user.name });
              Mixpanel.alias(user.id.toString());
              Mixpanel.identify(user.id.toString());
              MixpanelPeople.set({
                $email: user.email,
                $phone: user.phone,
                name: user.name
              });
            }
          });
        });
    }
  }

  public getSuperProperties(): Promise<any> {
    if (this.isCordova) {
      return Mixpanel.getSuperProperties();
    }
  }

  public trackEvent(eventName: string): void {
    if (this.isCordova) {
      Mixpanel.track(eventName);
    }
  }
}
