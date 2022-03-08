import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionSettlementService {
  public pageSize: number;
  private transactionApi: string;
  private settlementApi: string;
  constructor(private http: HttpClient, private config: ConfigService) {
    this.pageSize = this.config.get('PageSize');
    this.transactionApi = 'TRANSACTION';
    this.settlementApi = 'SETTLEMENT';
  }

  increaseCredit(model) {
    return this.http
      .post(
        this.config.getApi(this.transactionApi) + '/increaseCredit',
        JSON.stringify(model)
      )
      .map((response) => response)
      .catch(this.handleError);
  }

  getMyTransactions(page: number, filter?: string) {
    return this.http
      .get(this.config.getApi(this.transactionApi), {
        params: new HttpParams()
          .set('pageNumber', page.toString())
          .set('pageSize', this.pageSize.toString())
          .set('filter', filter),
      })
      .map((response) => response)
      .catch(this.handleError);
  }

  getUserTransactions(id: any, page: number, filter?: string) {
    return this.http
      .get(this.config.getApi(this.transactionApi) + '/' + id, {
        params: new HttpParams()
          .set('pageNumber', page.toString())
          .set('pageSize', this.pageSize.toString())
          .set('filter', filter),
      })
      .map((response) => response)
      .catch(this.handleError);
  }

  getUserSettlements(id: any, page: number, filter?: string) {
    return this.http
      .get(this.config.getApi(this.settlementApi) + '/' + id, {
        params: new HttpParams()
          .set('pageNumber', page.toString())
          .set('pageSize', this.pageSize.toString())
          .set('filter', filter),
      })
      .map((response) => response)
      .catch(this.handleError);
  }

  sendSettlement() {
    return this.http
      .post(
        this.config.getApi(this.settlementApi) + '/settlementRequest',
        JSON.stringify({})
      )
      .map((response) => response)
      .catch(this.handleError);
  }

  getMySettlements(page: number, filter?: string) {
    return this.http
      .get(this.config.getApi(this.settlementApi), {
        params: new HttpParams()
          .set('pageNumber', page.toString())
          .set('pageSize', this.pageSize.toString())
          .set('filter', filter),
      })
      .map((response) => response)
      .catch(this.handleError);
  }

  getAllSettlements(page: number, filter?: string) {
    return this.http
      .get(this.config.getApi(this.settlementApi) + '/admin/all', {
        params: new HttpParams()
          .set('pageNumber', page.toString())
          .set('pageSize', this.pageSize.toString())
          .set('filter', filter),
      })
      .map((response) => response)
      .catch(this.handleError);
  }

  changeSettlementStatus(item) {
    return this.http
      .post(
        this.config.getApi(this.settlementApi) + '/admin/changeStatus',
        JSON.stringify(item)
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
