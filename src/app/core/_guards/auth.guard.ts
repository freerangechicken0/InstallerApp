import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
  }

  canActivate() {
    if (this.authenticationService.getToken()) {
      this.authenticationService.getUser();
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
