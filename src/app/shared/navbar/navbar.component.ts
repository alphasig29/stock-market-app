import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

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
  hasAdminAccess: boolean = false;
  private siteUserSub: Subscription; // getting notifications when the data changes


  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.siteUserSub = this.authService.siteUser.subscribe(responseData => {
      if (!!this.authService.siteUser.value) {
        this.loggedInUserName = this.authService.getDisplayName();
        this.userIsLoggedIn = true;
        this.hasSectorAccess = this.authService.isSubscriber();
        this.hasStockListAccess = this.authService.isSubscriber();
        this.hasAdminAccess = this.authService.isAdmin();
      } else {
        // no use is logged in
        this.loggedInUserName = '';
        this.userIsLoggedIn = false;
        this.hasSectorAccess = false;
        this.hasStockListAccess = false;
        this.hasAdminAccess = false;
      }
    }
    );
  }

  ngOnDestroy(): void {
    this.siteUserSub.unsubscribe();
  }

  onLogOutRequested(){
    this.authService.logout();
    this.loggedInUserName = "";
  }

}
