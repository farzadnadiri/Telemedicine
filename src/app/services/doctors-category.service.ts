import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class DoctorsCategoryService extends DataService {
  constructor(http: HttpClient, config: ConfigService) {
    super('DOCTORSCATEGORY', http, config);
  }
}
