import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginRequestPayload } from './login-request.payload';
import { AuthService } from '../shared/auth.service';
import { throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginRequestPayLoad: LoginRequestPayload;
  isError: boolean;
  registerSuccessMessage: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {
    this.loginRequestPayLoad = {
      username: '',
      password: '',
    };
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });

    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.registered !== undefined && params.registered === 'true') {
        this.toastr.success('Signup successful');
        this.registerSuccessMessage =
          'Please check your inbox for activation email .Activate your account before login';
      }
    });
  }

  login() {
    this.loginRequestPayLoad.username = this.loginForm.get('username').value;
    this.loginRequestPayLoad.password = this.loginForm.get('password').value;

    this.authService.login(this.loginRequestPayLoad).subscribe(
      (data) => {
        console.log('login successful');
        this.isError = false;
        this.router.navigateByUrl('/');
        this.toastr.success('Login Sucessful');
      },
      (error) => {
        this.isError = true;
        throwError(error);
      }
    );
  }
}
