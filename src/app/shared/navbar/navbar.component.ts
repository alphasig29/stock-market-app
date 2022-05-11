import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticatorService } from '../authenticator.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  userIsLoggedIn: boolean = false;
  loggedInUserName: string = "";
  hasSectorAccess: boolean = false;
  hasStockListAccess: boolean = false;
  private loginChangeSub: Subscription; // getting notifications when the data changes


  constructor(private authService: AuthenticatorService) { }

  ngOnInit(): void {
    this.loginChangeSub = this.authService.loginDataChanged.subscribe(
      (isLoggedIn: boolean) => {
        this.userIsLoggedIn = isLoggedIn;
        this.loggedInUserName = this.authService.getLoggedInUserName();
        this.hasSectorAccess = this.authService.canAccessSectors();
        this.hasStockListAccess = this.authService.canAccessStockList();

      }
    );
  }

  ngOnDestroy(): void {
    this.loginChangeSub.unsubscribe();
  }

  onLogOutRequested(){
    this.authService.logout();
    this.loggedInUserName = "";
    this.hasSectorAccess = false;
    // this.hasStockListAccess = false;
  }

}
