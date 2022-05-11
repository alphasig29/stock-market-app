import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticatorService } from '../shared/authenticator.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, OnDestroy {
  userIsLoggedIn:boolean = false;
  private loginChangeSub: Subscription; // getting notifications when the data changes

  constructor(private authService: AuthenticatorService) { }

  ngOnInit(): void {
    //first set the local property to know if there is a user logged in
    this.userIsLoggedIn = this.authService.userIsLoggedIn();

    //subscribe to changes
    // console.log('onInit- home page: userIsLoggedIn = ' + this.userIsLoggedIn);
    this.loginChangeSub = this.authService.loginDataChanged.subscribe(
      (isLoggedIn: boolean) => {
        this.userIsLoggedIn = isLoggedIn;
        // console.log('home page: userIsLoggedIn = ' + this.userIsLoggedIn);
      }
    );
    // console.log("checking if the auth service has data " + this.authService.userIsLoggedIn());
  }

  ngOnDestroy(): void {
    this.loginChangeSub.unsubscribe();
  }

}
