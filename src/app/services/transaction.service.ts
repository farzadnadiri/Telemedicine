import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  public pageSize: number;
  private apiName: string;
  constructor(private http: HttpClient, private config: ConfigService) {
    this.pageSize = this.config.get('PageSize');
    this.apiName = 'TRANSACTION';
  }


  getAllTransactions(page: number, filter?: string) {
    return this.http
      .get(this.config.getApi(this.apiName) + '/admin/all', {
        params: new HttpParams()
          .set('pageNumber', page.toString())
          .set('pageSize', this.pageSize.toString())
          .set('filter', filter),
      })
      .map((response) => response)
      .catch(this.handleError);
  }

  adminStatus() {
    return this.http
      .get(this.config.getApi(this.apiName) + '/admin/status')
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
