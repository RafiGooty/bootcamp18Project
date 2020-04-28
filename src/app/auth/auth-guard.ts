import {  CanActivate,
          ActivatedRouteSnapshot,
          RouterStateSnapshot,
          UrlTree,
          Router} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate{
  constructor(private authService:AuthService,private route:Router){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree{
    if(!this.authService.getIsAuthorized()){
        this.route.navigate(['login'])
    }
    return this.authService.getIsAuthorized()
  }
}
