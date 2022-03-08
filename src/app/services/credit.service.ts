import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class CreditService {
  public credit: number;
  private api: string;
  constructor(private http: HttpClient, private config: ConfigService) {
    this.api = 'TRANSACTION';
  }

  loadCredit() {
    return this.http
      .get(this.config.getApi(this.api) + '/user/credit')
      .map((response) => response)
      .catch(this.handleError)
      .subscribe((result: any) => {
        this.credit = result.credit;
      });
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
