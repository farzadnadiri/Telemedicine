import { Injectable } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  Router,
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { userRole } from 'src/app/interfaces/IUserData';

@Injectable({
  providedIn: 'root',
})
export class AdminDoctorGuard implements CanActivate, CanActivateChild {
  constructor(protected router: Router, protected authService: AuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.authService.currentUser.role === userRole.Doctor || this.authService.currentUser.role === userRole.Admin) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true;
  }
}
