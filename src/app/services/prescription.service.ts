import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class PrescriptionService {
  public pageSize: number;
  private apiName: string;
  constructor(private http: HttpClient, private config: ConfigService) {
    this.pageSize = this.config.get('PageSize');
    this.apiName = 'PRESCRIPTION';
  }

  post(resource) {
    return this.http
      .post(this.config.getApi(this.apiName), JSON.stringify(resource))
      .map((response) => response)
      .catch(this.handleError);
  }

  postMedicines(resource) {
    return this.http
      .post(
        this.config.getApi(this.apiName) + '/Medicines',
        JSON.stringify(resource)
      )
      .map((response) => response)
      .catch(this.handleError);
  }

  postExperiments(resource) {
    return this.http
      .post(
        this.config.getApi(this.apiName) + '/Experiments',
        JSON.stringify(resource)
      )
      .map((response) => response)
      .catch(this.handleError);
  }

  loadPrescriptionMedicines(prescriptionId) {
    return this.http
      .get(
        this.config.getApi(this.apiName) +
          '/prescriptionMedicines/' +
          prescriptionId
      )
      .map((response) => response)
      .catch(this.handleError);
  }

  loadPrescriptionExperiments(prescriptionId) {
    return this.http
      .get(
        this.config.getApi(this.apiName) +
          '/prescriptionExperiments/' +
          prescriptionId
      )
      .map((response) => response)
      .catch(this.handleError);
  }

  loadSimplePrescription(prescriptionId) {
    return this.http
      .get(
        this.config.getApi(this.apiName) +
          '/simplePrescription/' +
          prescriptionId
      )
      .map((response) => response)
      .catch(this.handleError);
  }

  getUserPrescriptions(id: any, page: number) {
    return this.http
      .get(this.config.getApi(this.apiName) + '/prescriptions/' + id, {
        params: new HttpParams()
          .set('pageNumber', page.toString())
          .set('pageSize', this.pageSize.toString()),
      })
      .map((response) => response)
      .catch(this.handleError);
  }

  getUserMedicines(id: any, page: number) {
    return this.http
      .get(this.config.getApi(this.apiName) + '/medicines/' + id, {
        params: new HttpParams()
          .set('pageNumber', page.toString())
          .set('pageSize', this.pageSize.toString()),
      })
      .map((response) => response)
      .catch(this.handleError);
  }

  getUserExperiments(id: any, page: number) {
    return this.http
      .get(this.config.getApi(this.apiName) + '/experiments/' + id, {
        params: new HttpParams()
          .set('pageNumber', page.toString())
          .set('pageSize', this.pageSize.toString()),
      })
      .map((response) => response)
      .catch(this.handleError);
  }

  getMyPrescriptions(page: number) {
    return this.http
      .get(this.config.getApi(this.apiName) + '/getMyPrescriptions', {
        params: new HttpParams()
          .set('pageNumber', page.toString())
          .set('pageSize', this.pageSize.toString()),
      })
      .map((response) => response)
      .catch(this.handleError);
  }

  getMyMedicines(page: number) {
    return this.http
      .get(this.config.getApi(this.apiName) + '/getMyMedicines', {
        params: new HttpParams()
          .set('pageNumber', page.toString())
          .set('pageSize', this.pageSize.toString()),
      })
      .map((response) => response)
      .catch(this.handleError);
  }

  getMyExperiments(page: number) {
    return this.http
      .get(this.config.getApi(this.apiName) + '/getMyExperiments', {
        params: new HttpParams()
          .set('pageNumber', page.toString())
          .set('pageSize', this.pageSize.toString()),
      })
      .map((response) => response)
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    console.log(error);
    return Observable.throwError(error);

    // if (error.status === 400)
    //   return Observable.throw(new BadInput(error.json()));
    // if (error.status === 404)
    //   return Observable.throw(new NotFoundError());
    // return Observable.throw(new AppError(error));
  }
}
