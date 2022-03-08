import { ILoginData } from './../../interfaces/ILoginUtilities';
import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';
import { passwordStrength } from 'check-password-strength'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginForm: FormGroup;
  public passwordStrong;
  public passwordText;
  public passwordValue=0;
  public passwordClass="bg-danger";
  public isAuthLoading = false;

  constructor(
    private renderer: Renderer2,
    private toastr: ToastrService,
    private authService: AuthService,
    protected router: Router
  ) {}

  ngOnInit() {
    this.renderer.addClass(document.querySelector('app-root'), 'login-page');
    this.loginForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
  }
  
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  get password() {
    return this.loginForm.get('password');
  }

  onSearchChange(searchValue: string): void {  
    this.passwordStrong=passwordStrength(searchValue);

    if(searchValue.length==0){
      this.passwordText="";
      this.passwordClass="bg-danger";
      this.passwordValue=0;
    }
    else if(this.passwordStrong.id==0){
      this.passwordText="رمز عبور خیلی ضعیف";
      this.passwordClass="bg-danger";
      this.passwordValue=30;
    }
    else if(this.passwordStrong.id==1){
      this.passwordText="رمز عبور ضعیف";
      this.passwordClass="bg-warning";
      this.passwordValue=50;
    }
    else if(this.passwordStrong.id==2){
      this.passwordText="رمز عبور متوسط";
      this.passwordClass="bg-success";
      this.passwordValue=75;
    }
    else{
      this.passwordText="رمز عبور قوی";
      this.passwordClass="bg-success";
      this.passwordValue=100;
    }
    
  }

  login() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        (response) => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);

            const jwt = new JwtHelper();
            this.authService.currentUser = jwt.decodeToken(
              localStorage.getItem('token')
            );
            this.router.navigate(['/']);
            window.location.href = '/';
          } else {
            this.toastr.error('درخواست صحیح نیست', 'خطا');
          }
        },
        (error) => {
          if (
            error.status === 400 &&
            error.error === 'Invalid username or password.'
          ) {
            return this.toastr.error('نام کاربری یا رمز عبور صحیح نیست', 'خطا');
          }
          return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
        }
      );
    } else {
      this.toastr.error(
        'اطلاعات صحیح نیست',
        'نام کاربری یا رمز عبور صحیح نیست'
      );
    }
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.querySelector('app-root'), 'login-page');
  }
}
