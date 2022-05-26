import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, tap, throwError, map, Subject } from "rxjs";
import { SiteUser, UserCredentials, UserRoles, UserStocks } from "./models/site-user.model";
import { AuthResponseData } from "./models/site-user.model";

import { Constants } from "../config/constants";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class AuthService {
  siteUser = new BehaviorSubject<SiteUser>(null);
  private tokenExpirationTimer: any;
  userIsEnabled = new BehaviorSubject<boolean>(true);

  constructor(private http: HttpClient,
    private config: Constants,
    private router: Router) { }



  signUp(email: string, password: string, displayName: string) {
    // let searchParams = new HttpParams();
    // searchParams = searchParams.append(this.config.API_AUTH_TOKEN_PARAM_NAM, environment.API_FIREBASE_TOKEN);

    return this.http.post<AuthResponseData>(this.config.API_AUTH_ENDPOINT + 'accounts:signUp?key=' + environment.API_FIREBASE_TOKEN,
      { "email": email, "password": password, "returnSecureToken": true}
    ).pipe(catchError(this.handleError), tap<AuthResponseData>(responseData => {
      // figure out the expiration date/time for the user
      const expirationDate = new Date(new Date().getTime() + (+responseData.expiresIn * 1000));
      // create a new uer
      const newSiteUser = new SiteUser(new UserCredentials(responseData.email,
        displayName, responseData.localId, responseData.idToken, expirationDate),
        new UserRoles(true, false, true, true),
        []);
      // push the new user data to the database
      this.pushUserProfileToDB(newSiteUser);
      // emit the new user
      this.siteUser.next(newSiteUser);
      this.userIsEnabled.next(true);
      this.autoLogout(+responseData.expiresIn * 1000)
    }) // end of tap operator
    );
  }

  login(email: string, password: string) {

    return this.http.post<AuthResponseData>(this.config.API_AUTH_ENDPOINT + 'accounts:signInWithPassword?key=' + environment.API_FIREBASE_TOKEN,
      { "email": email, "password": password, "returnSecureToken": true }
    ).pipe(catchError(this.handleError), tap<AuthResponseData>(responseData => {
    // ).subscribe(responseData => {
      // figure out the expiration date/time for the user
      const expirationDate = new Date(new Date().getTime() + (+responseData.expiresIn * 1000));
      // retrieve the user profile from the DB
      this.fetchUserProfileFromDB(responseData.localId).subscribe(userData => {
        //let's only emit the user and allow the login IF the account is enabled
        if (userData.userAuthorizations.enabled === false) {
          //throw error / alsert the user
          // console.log('user is disabled.');

          //braocase that the new user is NOT enabled
          this.userIsEnabled.next(false);

        } else {
          // create a new uer
          const newSiteUser = new SiteUser(new UserCredentials(responseData.email,
          userData.userCredentials.displayName, responseData.localId, responseData.idToken, expirationDate),
            new UserRoles(userData.userAuthorizations.enabled, userData.userAuthorizations.admin,
              userData.userAuthorizations.editor, userData.userAuthorizations.subscriber),
            userData.userStocks);
          //remember that the new user is enabled
          this.userIsEnabled.next(true);
          // emit the new user
          this.siteUser.next(newSiteUser);
          this.autoLogout(+responseData.expiresIn * 1000)
        }

      }, profileError => {
        // if we did not get back a user profile, then create a blank/default one.
        const newSiteUser = new SiteUser(new UserCredentials(responseData.email,
          '', responseData.localId, responseData.idToken, expirationDate),
          new UserRoles(true, false, true, true),
          []);
        // emit the new user
        this.siteUser.next(newSiteUser);
        this.autoLogout(+responseData.expiresIn * 1000)
      })
    }));
  }

  logout() {
    this.siteUser.next(null);
    this.router.navigate(['/']);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
  }

  getDisplayName() {
    if (this.siteUser.value != null) {
      return this.siteUser.value.userCredentials.displayName;
    } else {
      return '';
    }
  }

  isSubscriber() {
    if (!!this.siteUser.value) {
      return this.siteUser.value.userAuthorizations.subscriber;
    } else {
      return false;
    }
  }

  isAdmin() {
    if (!!this.siteUser.value) {
      return this.siteUser.value.userAuthorizations.admin;
    } else {
      return false;
    }
  }

  isEditor() {
    if (!!this.siteUser.value) {
      return this.siteUser.value.userAuthorizations.editor;
    } else {
      return false;
    }
  }

  private pushUserProfileToDB(user: SiteUser) {

    const url = `${environment.FIREBASE_URL}user/${user.userCredentials.userId}/userdata.json`;
    this.http.put(url,
      user).subscribe(response => {
        console.log(response);
    });

  }



  private fetchUserProfileFromDB(userID: string){
    const url = `${environment.FIREBASE_URL}user/${userID}/userdata.json`;
    return this.http.get<SiteUser>(url).pipe(catchError(this.handleError), tap<SiteUser>(userData => {
    return userData;
    }));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!'
    // console.log(errorRes);
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email already exists.';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exists.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
      case 'Too_MANY_ATTEMPTS_TRY_LATER':
        errorMessage = 'Too many attempts, try again later.'
        break;
    }
    return throwError(errorMessage);
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  // retrieve all the stock info for the User's watchlist
  getStockWatchList() {
    if (!!this.siteUser.value) {
      return this.siteUser.value.userStocks;
    } else {
      return null;
    }
  }

  // allow a new stock to be added to the user's profile
  addStockToWatchList(stockSymbol: string) {
    if (!!this.siteUser.value) {
      stockSymbol = stockSymbol.toUpperCase();
      // console.log('adding new stock to watch list', stockSymbol);
      // have a site user, check for existing stocks
      if (this.siteUser.value.userStocks.length === 0) {
        // user has no stocks, add one
        this.siteUser.value.userStocks = [stockSymbol];
        // now push the new data to the backend DB (firebase)
        this.pushUserProfileToDB(this.siteUser.value);

      } else {
        // user has some stocks, add this one if it isn't in the list
        if (this.siteUser.value.userStocks.indexOf(stockSymbol) === -1) {
          // add this new symblo to the user's list
          this.siteUser.value.userStocks.push(stockSymbol);
          // now push the new data to the backend DB (firebase)
          this.pushUserProfileToDB(this.siteUser.value);

        }
       }
    } else {
      // no valid user logged in, do nothing
      // return null;
    }
  }
}
