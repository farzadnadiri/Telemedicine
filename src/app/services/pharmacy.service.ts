import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class PharmacyService extends DataService {
  constructor(http: HttpClient, config: ConfigService) {
    super('PHARMACIES', http, config);
  }
}
