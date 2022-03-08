import { Injectable, APP_INITIALIZER } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: object;
  constructor(private http: HttpClient) {}
  load() {
    return new Promise((resolve, reject) => {
      this.http.get('./assets/config.json').subscribe((response) => {
        this.config = response;
        resolve(true);
      });
    });
  }
  getApi(key: string): string {
    const serverUrl = 'ServerUrl';
    const apiCategories = 'API_ENDPOINTS';
    return this.config[serverUrl] + this.config[apiCategories][key];
  }
  // Gets a value of specified property in the configuration file
  get(key: any) {
    return this.config[key];
  }
  getUploadRoute(): string {
    const serverUrl = 'ServerUrl';
    const uploadRoute = 'UploadRoute';
    return this.config[serverUrl] + this.config[uploadRoute];
  }
}

export function ConfigFactory(config: ConfigService) {
  return () => config.load();
}

export function init() {
  return {
    provide: APP_INITIALIZER,
    useFactory: ConfigFactory,
    deps: [ConfigService],
    multi: true,
  };
}

const ConfigModule = {
  init,
};

export { ConfigModule };
