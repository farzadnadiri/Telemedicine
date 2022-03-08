import { IPeer } from './../interfaces/IPeer';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { ILoginResponse, ILoginData } from '../interfaces/ILoginUtilities';
import {
  IRegisterResponse,
  IRegisterData,
} from '../interfaces/IRegisterUtilities';
import { ConfigService } from './config.service';
import { Router } from '@angular/router';
import { IUser } from '../interfaces/IUserData';
import { IRequestResetPassData, IResetPassData, IResetPassResponse } from '../interfaces/IResetPassUtilities';

@Injectable()
export class AuthService {
  public currentUser: IUser;
  token: string;
  public credit: number;
  constructor(
    private http: HttpClient,
    private config: ConfigService,
    protected router: Router
  ) {
    this.token = localStorage.getItem('token');
    if (this.token) {
      const jwt = new JwtHelper();
      if (localStorage.getItem('user')) {
        const imageAndName = JSON.parse(localStorage.getItem('user'));
        const decodedToken = jwt.decodeToken(this.token);
        this.currentUser = {
          _id: decodedToken._id,
          name: imageAndName.name,
          username: imageAndName.username,
          image: imageAndName.image,
          role: decodedToken.role,
        };
      } else {
        this.currentUser = jwt.decodeToken(this.token);
      }
      this.updateMe();
    }
  }

  login(credentials: ILoginData) {
    return this.http.post<ILoginResponse>(
      this.config.getApi('LOGIN'),
      JSON.stringify(credentials)
    );
  }

  register(registerData: IRegisterData) {
    return this.http.post<IRegisterResponse>(
      this.config.getApi('REGISTER'),
      JSON.stringify(registerData)
    );
  }

  resetPass(resetPassData: IResetPassData) {
    return this.http.post<IResetPassResponse>(
      this.config.getApi('RESETPASS'),
      JSON.stringify(resetPassData)
    );
  }

  forgetPass(forgetPassData: IRequestResetPassData) {
    return this.http.post<IResetPassResponse>(
      this.config.getApi('FORGETPASS'),
      JSON.stringify(forgetPassData)
    );
  }

  requestCode(registerData: IRegisterData) {
    return this.http.post<IRegisterResponse>(
      this.config.getApi('REQUESTCODE'),
      JSON.stringify(registerData)
    );
  }
 
  peer(value: string) {
    const object = { peer: value };

    return this.http.post<IPeer>(
      this.config.getApi('PEER'),
      JSON.stringify(object),
      { responseType: 'text' as 'json' }
    );
  }

  updateMe() {
    this.http
      .get(this.config.getApi('ME'))
      .map((response) => response)
      .subscribe(
        (response: any) => {
          localStorage.setItem('user', JSON.stringify(response));
          this.currentUser.name = response.name;
          this.currentUser.image = response.image;
        },
        (error) => {}
      );
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser = null;
    this.router.navigate(['/login']);
    window.location.href = '/login';
  }

  isLoggedIn() {
    return tokenNotExpired('token');
  }
}
