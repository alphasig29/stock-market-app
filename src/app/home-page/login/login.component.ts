import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
// import { AuthenticatorService } from 'src/app/shared/authenticator.service';
// import { AuthResponseData } from 'src/app/shared/models/site-user.model';
// import { ReactiveFormsModule } from '@angular/forms';
// import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  submittedCredentials: {userdata: {username: string, password: string}};
  userIsLoggedIn:boolean = false;
  credentialsFailed: boolean = false;
  error: string = null;
  formMode = 'login' // 'register' // 'login'; // toggles between login and signUp
  isLoading = false;
  userSub: Subscription;
  userEnabledSub: Subscription;
  userIsEnabled: boolean = true;

  // constructor(private authService: AuthenticatorService) { }
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'userData': new FormGroup({
        'email': new FormControl(null, [Validators.required, Validators.email]),
        'password': new FormControl(null, Validators.required),
        'displayName': new FormControl(null, Validators.required),
      })
    });

    this.userEnabledSub = this.authService.userIsEnabled.subscribe(isEnabled => {
      this.userIsEnabled = isEnabled;
      if (!this.userIsEnabled) {
        this.error = null;
      }
    })
  }


  toggleFormMode() {
    if (this.formMode === 'login') {
      this.formMode = 'register';
    } else {
      this.formMode = 'login';
    }
  }


  onSubmit() {
    // let authObservable: Observable<AuthResponseData>;
    const email = this.loginForm.value.userData.email;
    const password = this.loginForm.value.userData.password;
    if(this.formMode === 'register') {
      // create a new user in the sytem
      const displayName = this.loginForm.value.userData.displayName;
      this.isLoading = true;

      this.userSub = this.authService.signUp(email, password, displayName).subscribe(resData => {
        if (!!this.authService.siteUser.value) {
          this.userIsLoggedIn = true;
          this.isLoading = false;
          this.credentialsFailed = false;
          this.error = null;
          this.userIsEnabled = true;
        }

    }, errorMessage => {
      console.log('error Signing up :' + errorMessage);
        this.credentialsFailed = true;
        this.isLoading = false;
    });
    } else {
      //user is logging in
      const displayName = '';
      this.isLoading = true;
      this.userSub = this.authService.login(email, password).subscribe(resData => {
        if (this.authService.siteUser.value !== null) {
          this.isLoading = false;
          this.credentialsFailed = false;
          this.error = null;
        }

      }, errorMessage => {
        console.log('error logging in :' + errorMessage);
        this.error = errorMessage;
        this.credentialsFailed = true;
        this.isLoading = false;
      });
      this.isLoading = false;
    }

  }


  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.userEnabledSub.unsubscribe();
  }
}
