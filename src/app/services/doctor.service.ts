import { DataService } from './data.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root',
})
export class DoctorService extends DataService {
  constructor(
    private httpProvider: HttpClient,
    private configProvider: ConfigService
  ) {
    super('DOCTORS', httpProvider, configProvider);
  }

  filter(term: string, cat: string) {
    return this.httpProvider
      .get(this.configProvider.getApi('DOCTORS') + '/filter/search', {
        params: new HttpParams().set('term', term).set('cat', cat),
      })
      .map((response) => response)
      .catch(this.customHandleError);
  }

  
  market(term: string) {
    return this.httpProvider
      .get(this.configProvider.getApi('DOCTORS') + '/load/market', {
        params: new HttpParams().set('filter', term),
      })
      .map((response) => response)
      .catch(this.customHandleError);
  }
  
  doctorCard(doctorId) {
    return this.httpProvider
      .get(this.configProvider.getApi('DOCTORS') + '/load/doctorCard', {
        params: new HttpParams().set('doctorId', doctorId),
      })
      .map((response) => response)
      .catch(this.customHandleError);
  }

  doctorSchedule(doctorId) {
    return this.httpProvider
      .get(this.configProvider.getApi('DOCTORS') + '/load/doctorSchedule', {
        params: new HttpParams().set('doctorId', doctorId),
      })
      .map((response) => response)
      .catch(this.customHandleError);
  }

  loadProfile(doctorId) {
    return this.httpProvider
      .get(this.configProvider.getApi('DOCTORS') + '/info/loadProfile', {
        params: new HttpParams().set('doctorId', doctorId),
      })
      .map((response) => response)
      .catch(this.customHandleError);
  }

  saveSchedule(resource) {
    return this.httpProvider
      .post(
        this.configProvider.getApi('DOCTORS') + '/schedule/update',
        JSON.stringify(resource)
      )
      .map((response) => response)
      .catch(this.customHandleError);
  }

  loadSchedule() {
    return this.httpProvider
      .get(this.configProvider.getApi('DOCTORS') + '/schedule/load')
      .map((response) => response)
      .catch(this.customHandleError);
  }

  updateInfo(resource) {
    return this.httpProvider
      .post(
        this.configProvider.getApi('DOCTORS') + '/info/update',
        JSON.stringify(resource)
      )
      .map((response) => response)
      .catch(this.customHandleError);
  }

  loadInfo() {
    return this.httpProvider
      .get(this.configProvider.getApi('DOCTORS') + '/info/load')
      .map((response) => response)
      .catch(this.customHandleError);
  }

  private customHandleError(error: Response) {
    return Observable.throwError(error);
  }
}
