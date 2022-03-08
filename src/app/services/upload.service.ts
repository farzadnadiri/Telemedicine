import { RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(
    private httpProvider: HttpClient,
    private configProvider: ConfigService
  ) { }

  uploadImage(file) {
    const formData: FormData = new FormData();
    formData.append('image', file);

    return this.httpProvider
      .post(
        this.configProvider.getApi('UPLOAD') + '/image',
        formData,
        {headers: {'Content-Type': 'multipart/form-data'}})
      .map((response) => response)
      .catch(this.customHandleError);
  }

  uploadAvatar(file) {
    const formData: FormData = new FormData();
    formData.append('avatar', file);

    return this.httpProvider
      .post(
        this.configProvider.getApi('UPLOAD') + '/avatar',
        formData,
        {headers: {'Content-Type': 'multipart/form-data'}})
      .map((response) => response)
      .catch(this.customHandleError);
  }

  uploadPdf(file) {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.httpProvider
      .post(
        this.configProvider.getApi('UPLOAD') + '/pdf',
        formData,
        {headers: {'Content-Type': 'multipart/form-data'}})
      .map((response) => response)
      .catch(this.customHandleError);
  }

  private customHandleError(error: Response) {
    return Observable.throwError(error);
  }


}
