import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthenticationService } from '../_services/authentication.service';

import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authenticationService;

  beforeEach(() => {
    authenticationService = jasmine.createSpyObj('AuthenticationService', ['getToken', 'getUser']);
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        {
          provide: AuthenticationService,
          useValue: authenticationService
        }
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('returns true for a valid token', () => {
    authenticationService.getToken.and.returnValue('somevalidtoken');
    expect(guard.canActivate()).toBeTrue();
  });

  it('redirect if no token', () => {
    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');
    authenticationService.getToken.and.returnValue('');
    expect(guard.canActivate()).toBeFalse();
    expect(routerSpy).toHaveBeenCalledWith(['/login']);
  });
});
