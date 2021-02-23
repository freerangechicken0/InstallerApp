import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    service = TestBed.inject(AuthenticationService);
    expect(service).toBeTruthy();
  });

  it('should be created with sensible defaults', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresAt');
    const service = TestBed.inject(AuthenticationService);
    expect(service.getToken()).toEqual('');
    expect(service.getExpiresAt()).toEqual(0);
});

  it('restores existing token', () => {
    localStorage.setItem('token', 'somevalidtoken');
    const expiresAt = Math.floor(Date.now() / 1000) + 1209600;
    localStorage.setItem('expiresAt', expiresAt.toString());
    service = TestBed.inject(AuthenticationService);
    expect(service.getToken()).toEqual('somevalidtoken');
    expect(service.getExpiresAt()).toEqual(expiresAt);
  });

  it('deletes the token if its expired', () => {
    localStorage.setItem('token', 'somevalidtoken');
    const expiresAt = Math.floor(Date.now() / 1000) - 1209600;
    localStorage.setItem('expiresAt', expiresAt.toString());
    service = TestBed.inject(AuthenticationService);
    expect(service.getToken()).toEqual('');
    expect(service.getExpiresAt()).toEqual(0);
  });

  it('removes token on logout', () => {
    localStorage.setItem('token', 'somevalidtoken');
    const expiresAt = Math.floor(Date.now() / 1000) + 1209600;
    localStorage.setItem('expiresAt', expiresAt.toString());
    service = TestBed.inject(AuthenticationService);
    expect(service.getToken()).toEqual('somevalidtoken');
    expect(service.getExpiresAt()).toEqual(expiresAt);
    service.logout();
    const logoutReq = httpTestingController.expectOne('https://api.uat.milk.levno.com/api/auth/logout');
    logoutReq.flush({"msg":"Successfully logged out"});
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('expiresAt')).toBeNull();
  });

  it('sets new token on login', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresAt');
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('expiresAt')).toBeNull();
    service = TestBed.inject(AuthenticationService);
    const timeSent = Math.floor(Date.now() / 1000);
    service.login('somevalid@email.com', 'somevalidpassword').subscribe();
    const loginReq = httpTestingController.expectOne('https://api.uat.milk.levno.com/api/auth/login');
    loginReq.flush({"authType": "bearer", "expiresIn": 1209600, "token": "somevalidtoken", });
    expect(localStorage.getItem('token')).toEqual('somevalidtoken');
    expect(localStorage.getItem('expiresAt')).toBeGreaterThanOrEqual(timeSent);
  });
});
