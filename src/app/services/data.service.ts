import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable()
export class DataService {
  public pageSize: number;

  constructor(
    @Inject(String) private apiName: string,
    private http: HttpClient,
    private config: ConfigService
  ) {
    this.pageSize = this.config.get('PageSize');
  }

  getPage(page: number, filter?: string) {
    return this.http
      .get(this.config.getApi(this.apiName), {
        params: new HttpParams()
          .set('pageNumber', page.toString())
          .set('pageSize', this.pageSize.toString())
          .set('filter', filter),
      })
      .map((response) => response)
      .catch(this.handleError);
  }

  search(term: string) {
    return this.http
      .get(this.config.getApi(this.apiName) + '/filter/search', {
        params: new HttpParams().set('term', term),
      })
      .map((response) => response)
      .catch(this.handleError);
  }

  create(resource) {
    return this.http
      .post(this.config.getApi(this.apiName), JSON.stringify(resource))
      .map((response) => response)
      .catch(this.handleError);
  }

  update(id, resource) {
    return this.http
      .put(
        this.config.getApi(this.apiName) + '/' + id,
        JSON.stringify(resource)
      )
      .map((response) => response)
      .catch(this.handleError);
  }

  get(id) {
    return this.http
      .get(this.config.getApi(this.apiName) + '/' + id)
      .map((response) => response)
      .catch(this.handleError);
  }
  delete(id) {
    return this.http
      .delete(this.config.getApi(this.apiName) + '/' + id)
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
