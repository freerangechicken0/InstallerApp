import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Mixpanel } from '@ionic-native/mixpanel';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from './authentication.service';

import { MixpanelService } from './mixpanel.service';

describe('MixpanelService', () => {
  let service: MixpanelService;
  let mixpanel;
  let platform;
  let authenticationService

  beforeEach(() => {
    mixpanel = spyOnAllFunctions(Mixpanel);
    platform = jasmine.createSpyObj('Platform', ['is']);
    authenticationService = jasmine.createSpyObj('AuthenticationService', ['user']);
    authenticationService.user = new BehaviorSubject({ id: 123, name: "somevalidname", email: "somevalid@gmail.com", phone: 12345678 });
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: Platform,
          useValue: platform
        },
        {
          provide: AuthenticationService,
          useValue: authenticationService
        }
      ]
    });
    service = TestBed.inject(MixpanelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should intialise a connection to mixpanel if on a mobile device', fakeAsync(() => {
    platform.is.and.returnValue(true); // platform.is('cordova')
    mixpanel.init.and.returnValue(Promise.resolve(true));
    service.initialiseMixpanel();
    tick(1000);
    expect(mixpanel.init).toHaveBeenCalled();
    expect(mixpanel.registerSuperProperties).toHaveBeenCalledWith({ name: "somevalidname" });
    expect(mixpanel.alias).toHaveBeenCalledWith("123");
    expect(mixpanel.identify).toHaveBeenCalledWith("123");
  }));

  it('should not try to connect to mixpanel if not on the cordova platform', () => {
    platform.is.and.returnValue(false);
    service.initialiseMixpanel();
    expect(mixpanel.init).not.toHaveBeenCalled();
    expect(mixpanel.registerSuperProperties).not.toHaveBeenCalled();
  });

  it('should return the super properties that were set', async () => {
    platform.is.and.returnValue(true);
    mixpanel.getSuperProperties.and.returnValue(Promise.resolve({ name: "somevalidname" }));
    service.getSuperProperties().then(superProperties => {
      expect(superProperties).toEqual({ name: "somevalidname" });
    });
  });

  it('should log an event to the mixpanel dashboard', () => {
    platform.is.and.returnValue(true);
    mixpanel.track.and.returnValue(Promise.resolve(true));
    const eventName = 'Alert Set';
    service.trackEvent(eventName);
    expect(mixpanel.track).toHaveBeenCalledWith(eventName);
  });
});
