//this service will be used to lock down acces to routes by user typing them in

import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { SiteUser } from "./models/site-user.model";


@Injectable({providedIn: 'root'})
export class RouleGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
  //this will be passed to this method by the route config
  const expectedRole = route.data.expectedRole;
  const siteUserData: SiteUser = this.authService.siteUser.value;
  // only allow routes if the user is authenticated and had the proper role
  // console.log("preCheck for authorization in roleGuard, site-user = ", this.authService.siteUser.value)
  if (this.authService.siteUser.value !== null) {
    // console.log("roleGuardSErvice: requires " + expectedRole, this.authService.siteUser.value.userAuthorizations[expectedRole]);
    if (this.authService.siteUser.value.userAuthorizations[expectedRole] === true &&
      this.authService.siteUser.value.userAuthorizations.enabled === true) {
      // user has the proper role to access this route, return true.
      return true;
    } else {
      return false;
      }

  } else {
    //user is not authenticated, return false (no access); route to login page
    this.router.navigate(['']);  //home page
    return false;
  }


}



}
