import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MenuController } from '@ionic/angular';

import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let menuController;

  beforeEach(async(() => {
    menuController = jasmine.createSpyObj('MenuController', ['enable']);
    TestBed.configureTestingModule({
      declarations: [ HomePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        {
          provide: MenuController,
          useValue: menuController
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('enable side menu', () => {
    component.ionViewWillEnter();
    expect(menuController.enable).toHaveBeenCalledWith(true);
  });

  it('naviagtes to milk install', () => {
    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');
    component.goToMilk();
    expect(routerSpy).toHaveBeenCalledWith(['/assign']);
  })
});
