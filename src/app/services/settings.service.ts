import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private http: HttpClient, private config: ConfigService) {}
  private apiName = 'SETTINGS';

  getAdminSettings() {
    return this.http
      .get(this.config.getApi(this.apiName) + '/admin/get')
      .map((response) => response)
      .catch(this.handleError);
  }

  postAdminSettings(resource) {
    return this.http
      .post(
        this.config.getApi(this.apiName) + '/admin/post',
        JSON.stringify(resource)
      )
      .map((response) => response)
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    return Observable.throwError(error);

    // if (error.status === 400)
    //   return Observable.throw(new BadInput(error.json()));
    // if (error.status === 404)
    //   return Observable.throw(new NotFoundError());
    // return Observable.throw(new AppError(error));
  }
}
