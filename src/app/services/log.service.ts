import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  public pageSize: number;
  private apiName: string;
  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
    this.apiName = 'LOG',
    this.pageSize = this.config.get('PageSize');
  }

  getPage(page: number) {
    return this.http
      .get(this.config.getApi(this.apiName), {
        params: new HttpParams()
          .set('pageNumber', page.toString())
          .set('pageSize', this.pageSize.toString()),
      })
      .map((response) => response)
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    return Observable.throwError(error);
  }
}
