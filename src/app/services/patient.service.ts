import { DataService } from './data.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientService extends DataService {
  constructor(
    private httpProvider: HttpClient,
    private configProvider: ConfigService
  ) {
    super('PATIENTS', httpProvider, configProvider);
  }

  updateInfo(resource) {
    return this.httpProvider
      .post(this.configProvider.getApi('PATIENTS') + '/info/update', JSON.stringify(resource))
      .map((response) => response)
      .catch(this.customHandleError);
  }

  loadInfo() {
    return this.httpProvider
      .get(this.configProvider.getApi('PATIENTS') + '/info/load')
      .map((response) => response)
      .catch(this.customHandleError);
  }
  
  loadProfile(patientId) {
    return this.httpProvider
      .get(this.configProvider.getApi('PATIENTS') + '/info/loadProfile', {params: new HttpParams()
          .set('patientId', patientId)
      })
      .map((response) => response)
      .catch(this.customHandleError);
  }

  infoStatus() {
    return this.httpProvider
      .get(this.configProvider.getApi('PATIENTS') + '/info/status')
      .map((response) => response)
      .catch(this.customHandleError);
  }

  
  validDoctors() {
    return this.httpProvider
      .get(this.configProvider.getApi('PATIENTS') + '/validDoctors/load')
      .map((response) => response)
      .catch(this.customHandleError);
  }

  updatevalidDoctor(resource) {
    return this.httpProvider
      .post(this.configProvider.getApi('PATIENTS') + '/validDoctors/update', JSON.stringify(resource))
      .map((response) => response)
      .catch(this.customHandleError);
  }


  private customHandleError(error: Response) {
    return Observable.throwError(error);
  }
}
