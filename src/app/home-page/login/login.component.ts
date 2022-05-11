import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticatorService } from 'src/app/shared/authenticator.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submittedCredentials: {userdata: {username: string, password: string}};
  userIsLoggedIn:boolean = false;
  credentialsFailed: boolean = false;

  constructor(private authService: AuthenticatorService) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'userData': new FormGroup({
        'username': new FormControl(null, Validators.required),
        'password': new FormControl(null, Validators.required),
      })
    });




  }

  onSubmit(){
    this.userIsLoggedIn = this.authService.login(this.loginForm.value.userData.username,
      this.loginForm.value.userData.password)
    if (!this.userIsLoggedIn) {
      this.credentialsFailed = true;
    }
  }

}
