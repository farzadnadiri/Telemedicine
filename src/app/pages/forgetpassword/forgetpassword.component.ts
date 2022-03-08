import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';
import { passwordStrength } from 'check-password-strength'

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.scss']
})
export class ForgetpasswordComponent implements OnInit, OnDestroy {
  public resetPassForm: FormGroup;
  public passwordStrong;
  public passwordText;
  public passwordValue=0;
  public passwordClass="bg-danger";
  public firstStepPassed=false;
  constructor(
    private renderer: Renderer2,
    private toastr: ToastrService,
    private authService: AuthService,
    protected router: Router
  ) {
    
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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
  
  ngOnInit() {
    this.renderer.addClass(document.querySelector('app-root'), 'register-page');
    this.resetPassForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      retypePassword: new FormControl(null, Validators.required),
      code: new FormControl(null),
    });
  }


  submitFunc(){
    if(!this.firstStepPassed){
    this.forgetPassword();
    }
    else{
      this.resetPassword();
    }
  }
  goback(){
    this.firstStepPassed=false;
    this.pauseTimer();
  }
  forgetPassword() {
  
    // todo validate phone number using  installed libphone number 
      const data = this.resetPassForm.value;
      delete data.retypePassword;
      this.firstStepPassed=true;
      this.authService.forgetPass(data).subscribe(
        (response) => {
          this.startTimer();
          this.firstStepPassed=true;
        },
        (error) => {
          this.pauseTimer();
          this.firstStepPassed=false;
          if (error.status === 400 &&
            error.error === 'User not found.') {
            return this.toastr.error('کاربر یافت نشد', 'خطا');
          }
  
        }
      );

  }

  resetPassword() {
    if (this.resetPassForm.valid) {
      const data = this.resetPassForm.value;
      delete data.retypePassword;

      this.authService.resetPass(data).subscribe(
        (response) => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);

            const jwt = new JwtHelper();
            this.authService.currentUser = jwt.decodeToken(
              localStorage.getItem('token')
            );
            this.router.navigate(['/']);
          } else {
            this.toastr.error('درخواست صحیح نیست', 'خطا');
          }
        },
        (error) => {
          if (error.status === 400 &&
            error.error === 'User already registered.') {
            return this.toastr.error('نام کاربری تکراری است', 'خطا');
          }
          if (error.status === 400 &&
            error.error === 'verification code expired.') {
            return this.toastr.error('اعتبار کد به پایان رسیده، لطفا مجددا تلاش نمایید', 'خطا');
          }
          if (error.status === 400 &&
            error.error === 'verification code is not true') {
            return this.toastr.error('کد احراز هویت صحیح نمی باشد', 'خطا');
          }
          return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
        }
      );
    } else {
      this.toastr.error('اطلاعات ورودی صحیح نیست', 'خطا');
    }
  }
  timeLeft: number = 120;
  interval;

startTimer() {
  this.timeLeft = 120;
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.pauseTimer();
      }
    },1000)
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  ngOnDestroy() {
    this.renderer.removeClass(
      document.querySelector('app-root'),
      'register-page'
    );
  }
}
