import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

import { LoginPage } from './login.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthenticationService } from 'src/app/core/_services/authentication.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authenticationService;
  let menuController;

  beforeEach(async(() => {
    authenticationService = jasmine.createSpyObj('AuthenticationService', ['login']);
    menuController = jasmine.createSpyObj('MenuController', ['enable']);
    TestBed.configureTestingModule({
      declarations: [LoginPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        IonicModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: AuthenticationService,
          useValue: authenticationService
        },
        {
          provide: MenuController,
          useValue: menuController
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("logs in and redirect to home with correct credentials", () => {
    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');
    component.loginForm.controls.email.patchValue('somevalid@email.com');
    component.loginForm.controls.password.patchValue('somevalidpassword');
    authenticationService.login.and.returnValue(of({}));
    component.onSubmit({ srcElement: [{ value: 'somevalid@email.com' }, { value: 'somevalidpassword' }] });
    expect(routerSpy).toHaveBeenCalledWith(['/home']);
  });

  it("doesn't log in if password and email is empty", () => {
    component.loginForm.controls.email.patchValue('');
    component.loginForm.controls.password.patchValue('');
    component.onSubmit({ srcElement: [{ value: '' }, { value: '' }] });
    expect(component.error).toEqual('Please fill in both email and password');
  });

  it("doesn't log in if password is empty", () => {
    component.loginForm.controls.email.patchValue('somevalid@email.com');
    component.loginForm.controls.password.patchValue('');
    component.onSubmit({ srcElement: [{ value: 'somevalid@email.com' }, { value: '' }] });
    expect(component.error).toEqual('Please fill in your password');
  });

  it("doesn't log in if email is empty", () => {
    component.loginForm.controls.email.patchValue('');
    component.loginForm.controls.password.patchValue('somevalidpassword');
    component.onSubmit({ srcElement: [{ value: '' }, { value: 'somevalidpassword' }] });
    expect(component.error).toEqual('Please fill in your email address');
  });

  it("doesn't log in if email is invalid", () => {
    component.loginForm.controls.email.patchValue('someinvalidemail');
    component.loginForm.controls.password.patchValue('somevalidpassword');
    component.onSubmit({ srcElement: [{ value: 'someinvalidemail' }, { value: 'somevalidpassword' }] });
    expect(component.error).toEqual('Invalid email address');
  });

  it('displays error from api: invalid credentials', () => {
    component.loginForm.controls.email.patchValue('somevalid@email.com');
    component.loginForm.controls.password.patchValue('somevalidpassword');
    authenticationService.login.and.returnValue(throwError({ error: { "status": "error", "error": "Invalid Credentials." } }));
    component.onSubmit({ srcElement: [{ value: 'somevalid@email.com' }, { value: 'somevalidpassword' }] });
    expect(component.error).toEqual('Invalid Credentials.');
  });

  it('disable side menu', () => {
    component.ionViewWillEnter();
    expect(menuController.enable).toHaveBeenCalledWith(false);
  });
});
