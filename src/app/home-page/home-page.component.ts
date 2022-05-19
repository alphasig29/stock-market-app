import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/auth.service';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, OnDestroy {
  userIsLoggedIn:boolean = false;
  private siteUserSub: Subscription; // getting notifications when the data changes

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    //subscribe to user log ins
    this.siteUserSub = this.authService.siteUser.subscribe(responseData => {
      if (this.authService.siteUser.value !== null) {
        console.log('home page - user is logged in');
        console.log(this.authService.siteUser.value);
        this.userIsLoggedIn = true;
      } else {
        this.userIsLoggedIn = false;
      }
    });

  }

  ngOnDestroy(): void {
    this.siteUserSub.unsubscribe();
  }

}
