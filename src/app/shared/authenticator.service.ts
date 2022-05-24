// This is no longer used. It was just a stub put in to plan/show initial login capabilities.

import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatorService {
  loginDataChanged = new Subject<boolean>();
  private isUserLoggedIn:boolean;
  private loggedInUserName: string;
  //authorization variables
  private canViewSectors: boolean = false;
  private canViewMyStockList: boolean = false;

  login(userName: string, password: string): boolean {
      // based on the username and password, authorize and authenticat them.
     if (userName == 'admin' && password == 'admin') {
          //set to true
          this.isUserLoggedIn = true;
          this.canViewMyStockList = false;
          this.canViewSectors = true;
        }
        if (userName == 'guest' && password == 'guest') {
        //set to true
        this.isUserLoggedIn = true;
        this.canViewMyStockList = true;
        this.canViewSectors = false;
      }
      if ((userName == 'user' && password == 'user') ||
          (userName == 'roger' && password == 'roger')) {
        //set to true
        this.isUserLoggedIn = true;
        this.canViewMyStockList = true;
        this.canViewSectors = true;
      }

      // let subscribers know of a login change
      if (this.isUserLoggedIn) {
        this.loggedInUserName = userName;
        this.loginDataChanged.next(this.isUserLoggedIn);
      }
      // console.log('userName ' + userName);
      // console.log('password ' + password);
      // console.log('isUserLoggedIn ' + this.isUserLoggedIn);
      return this.isUserLoggedIn;

    //  this.isUserLoggedIn = userName == 'admin' && password == 'admin';
    //  localStorage.setItem('isUserLoggedIn', this.isUserLoggedIn ? "true" : "false");

  }

  logout(): void {
    this.canViewMyStockList = false;
    this.canViewSectors = false;
    this.isUserLoggedIn = false;
    this.loggedInUserName = "";
    //  localStorage.removeItem('isUserLoggedIn');
    // let subscribers know of a login change
    this.loginDataChanged.next(this.isUserLoggedIn);
  }

  userIsLoggedIn(): boolean {
    return this.isUserLoggedIn;
  }

  getLoggedInUserName():string {
    return this.loggedInUserName;
  }

  canAccessSectors(): boolean {
    return this.canViewSectors;
  }

  canAccessStockList(): boolean {
    return this.canViewMyStockList;

  }
  constructor() { }
}
