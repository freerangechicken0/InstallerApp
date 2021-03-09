import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async, tick, fakeAsync } from '@angular/core/testing';

import { MenuController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('AppComponent', () => {

  let statusBarSpy;
  let splashScreenSpy;
  let platformSpy;
  let menuController;

  beforeEach(async(() => {
    statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
    splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
    platformSpy = jasmine.createSpyObj('Platform', { ready: Promise.resolve(), is: true });
    menuController = jasmine.createSpyObj('MenuController', ['enable']);
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
          provide: MenuController,
          useValue: menuController
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
  }));

  it('logout logs out', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');
    app.logout();
    expect(routerSpy).toHaveBeenCalledWith(['/login']);
    
  });

  // TODO: add more tests!

});
