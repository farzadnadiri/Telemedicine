import { Injectable, Injector } from '@angular/core';

import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) { }

  private get toastrService(): ToastrService {
    return this.injector.get(ToastrService);
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token: string = localStorage.getItem('token');

    if (token) {
      request = request.clone({
        headers: request.headers.set('x-auth-token', token),
      });
    }

    if (!request.headers.has('Content-Type')) {
      request = request.clone({
        headers: request.headers.set('Content-Type', 'application/json'),
      });
    } else if (request.headers.get('Content-Type') === 'multipart/form-data') {

      request = request.clone({
        headers: request.headers.delete('Content-Type'),
      });

    }

    request = request.clone({
      headers: request.headers.set('Accept', 'application/json'),
    });

    return next.handle(request).pipe(
     retry(3), // retry 3 times after request failed
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
      //     console.log('event--->>>', event);
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        let data = {};
        data = {
          reason:
            error && error.error && error.error.reason
              ? error.error.reason
              : '',
          status: error.status,
        };

        return throwError(error);
      })
    );
  }
}
