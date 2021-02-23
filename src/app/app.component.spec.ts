import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async, tick, fakeAsync } from '@angular/core/testing';

import { MenuController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MixpanelService } from './core/_services/mixpanel.service';
import { AuthenticationService } from './core/_services/authentication.service';
import { Router } from '@angular/router';

describe('AppComponent', () => {

  let statusBarSpy;
  let splashScreenSpy;
  let platformSpy;
  let mixpanelService;
  let menuController;
  let authenticationService;

  beforeEach(async(() => {
    statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
    splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
    platformSpy = jasmine.createSpyObj('Platform', { ready: Promise.resolve(), is: true });
    mixpanelService = jasmine.createSpyObj('MixpanelService', ['initialiseMixpanel', 'trackEvent']);
    mixpanelService.initialiseMixpanel.and.returnValue(Promise.resolve(true));
    menuController = jasmine.createSpyObj('MenuController', ['enable']);
    authenticationService = jasmine.createSpyObj('AuthenticationService', ['logout']);
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: StatusBar, useValue: statusBarSpy },
        { provide: SplashScreen, useValue: splashScreenSpy },
        { provide: Platform, useValue: platformSpy },
        {
          provide: MixpanelService,
          useValue: mixpanelService
        },
        {
          provide: MenuController,
          useValue: menuController
        },
        {
          provide: AuthenticationService,
          useValue: authenticationService
        }
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize the app', fakeAsync(() => {
    TestBed.createComponent(AppComponent);
    expect(platformSpy.ready).toHaveBeenCalled();
    tick(1000);
    expect(statusBarSpy.styleDefault).toHaveBeenCalled();
    expect(splashScreenSpy.hide).toHaveBeenCalled();
    expect(menuController.enable).toHaveBeenCalledWith(true);
    expect(mixpanelService.initialiseMixpanel).toHaveBeenCalled();
  }));

  it('logout logs out', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');
    app.logout();
    expect(authenticationService.logout).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['/login']);
    
  });

  // TODO: add more tests!

});
