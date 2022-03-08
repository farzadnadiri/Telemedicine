import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root',
})
export class VisitService {
  public pageSize: number;
  private apiName: string;
  constructor(private http: HttpClient, private config: ConfigService) {
    this.pageSize = this.config.get('PageSize');
    this.apiName = 'VISIT';
  }

  patientActive() {
    return this.http
      .get(this.config.getApi(this.apiName) + '/patient/active')
      .map((response) => response)
      .catch(this.handleError);
  }

  patientStatus() {
    return this.http
      .get(this.config.getApi(this.apiName) + '/patient/status')
      .map((response) => response)
      .catch(this.handleError);
  }

  patientPage(page: number, date: string) {
    return this.http
      .get(this.config.getApi(this.apiName) + '/patient/page', {
        params: new HttpParams()
          .set('date', date.toString())
          .set('pageNumber', page.toString())
          .set('pageSize', this.pageSize.toString()),
      })
      .map((response) => response)
      .catch(this.handleError);
  }

  patientProfile(page: number, patientId: string) {
    return this.http
      .get(this.config.getApi(this.apiName) + '/patient/profile', {
        params: new HttpParams()
          .set('patientId', patientId.toString())
          .set('pageNumber', page.toString())
          .set('pageSize', this.pageSize.toString()),
      })
      .map((response) => response)
      .catch(this.handleError);
  }

  doctorProfile(page: number, patientId: string) {
    return this.http
      .get(this.config.getApi(this.apiName) + '/doctor/profile', {
        params: new HttpParams()
          .set('doctorId', patientId.toString())
          .set('pageNumber', page.toString())
          .set('pageSize', this.pageSize.toString()),
      })
      .map((response) => response)
      .catch(this.handleError);
  }

  patientFilter(resource) {
    return this.http
      .post(
        this.config.getApi(this.apiName) + '/patient/filter',
        JSON.stringify(resource)
      )
      .map((response) => response)
      .catch(this.handleError);
  }

  patientReserve(resource) {
    return this.http
      .post(
        this.config.getApi(this.apiName) + '/patient/reserve',
        JSON.stringify(resource)
      )
      .map((response) => response)
      .catch(this.handleError);
  }

  patientCancel(resource) {
    return this.http
      .post(
        this.config.getApi(this.apiName) + '/patient/cancel',
        JSON.stringify(resource)
      )
      .map((response) => response)
      .catch(this.handleError);
  }

  doctorStatus() {
    return this.http
      .get(this.config.getApi(this.apiName) + '/doctor/status')
      .map((response) => response)
      .catch(this.handleError);
  }

  doctorPriority(page, filter) {
    return this.http
      .get(this.config.getApi(this.apiName) + '/doctor/priority', {
        params: new HttpParams()
          .set('pageNumber', page.toString())
          .set('pageSize', this.pageSize.toString())
          .set('filter', filter),
      })
      .map((response) => response)
      .catch(this.handleError);
  }

  doctorToday(page, filter) {
    return this.http
      .get(this.config.getApi(this.apiName) + '/doctor/today', {
        params: new HttpParams()
          .set('pageNumber', page.toString())
          .set('pageSize', this.pageSize.toString())
          .set('filter', filter),
      })
      .map((response) => response)
      .catch(this.handleError);
  }

  doctorScheduled(page, filter) {
    return this.http
      .get(this.config.getApi(this.apiName) + '/doctor/scheduled', {
        params: new HttpParams()
          .set('pageNumber', page.toString())
          .set('pageSize', this.pageSize.toString())
          .set('filter', filter),
      })
      .map((response) => response)
      .catch(this.handleError);
  }

  doctorDone(page, filter) {
    return this.http
      .get(this.config.getApi(this.apiName) + '/doctor/done', {
        params: new HttpParams()
          .set('pageNumber', page.toString())
          .set('pageSize', this.pageSize.toString())
          .set('filter', filter),
      })
      .map((response) => response)
      .catch(this.handleError);
  }

  doctorVisitItem(id) {
    return this.http
      .get(this.config.getApi(this.apiName) + '/doctor/getSimpleVisit/' + id)
      .map((response) => response)
      .catch(this.handleError);
  }
  
  visitStatusDone(resource) {
    return this.http
      .post(
        this.config.getApi(this.apiName) + '/doctor/done',
        JSON.stringify(resource)
      )
      .map((response) => response)
      .catch(this.handleError);
  }

  doctorCancel(resource) {
    return this.http
      .post(
        this.config.getApi(this.apiName) + '/doctor/cancel',
        JSON.stringify(resource)
      )
      .map((response) => response)
      .catch(this.handleError);
  }

  doctorPage(page, date) {
    return this.http
      .get(this.config.getApi(this.apiName) + '/doctor/page', {
        params: new HttpParams()
          .set('date', date.toString())
          .set('pageNumber', page.toString())
          .set('pageSize', this.pageSize.toString()),
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

  adminPriority(page, filter) {
    return this.http
      .get(this.config.getApi(this.apiName) + '/admin/priority', {
        params: new HttpParams()
          .set('pageNumber', page.toString())
          .set('pageSize', this.pageSize.toString())
          .set('filter', filter),
      })
      .map((response) => response)
      .catch(this.handleError);
  }

  adminToday(page, filter) {
    return this.http
      .get(this.config.getApi(this.apiName) + '/admin/today', {
        params: new HttpParams()
          .set('pageNumber', page.toString())
          .set('pageSize', this.pageSize.toString())
          .set('filter', filter),
      })
      .map((response) => response)
      .catch(this.handleError);
  }

  adminScheduled(page, filter) {
    return this.http
      .get(this.config.getApi(this.apiName) + '/admin/scheduled', {
        params: new HttpParams()
          .set('pageNumber', page.toString())
          .set('pageSize', this.pageSize.toString())
          .set('filter', filter),
      })
      .map((response) => response)
      .catch(this.handleError);
  }

  adminDone(page, filter) {
    return this.http
      .get(this.config.getApi(this.apiName) + '/admin/done', {
        params: new HttpParams()
          .set('pageNumber', page.toString())
          .set('pageSize', this.pageSize.toString())
          .set('filter', filter),
      })
      .map((response) => response)
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    return Observable.throwError(error);
  }
}
