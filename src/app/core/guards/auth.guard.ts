import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(): boolean {
    return this.verifyLogin();
  }

  verifyLogin(): boolean {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/']);
      return false;
    } else if (this.isLoggedIn()) {
       return true;
    }
  }

  public isLoggedIn(): boolean {
    let status = false;
    if (window.localStorage.getItem('is_loggedin') !== undefined && window.localStorage.getItem('is_loggedin') === 'true') {
      status = true;
    } else {
      status = false;
    }
    return status;
  }

}
