import { ToastrService } from 'ngx-toastr';
import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable()
export class ErrorHandlerService extends ErrorHandler {
  constructor(private injector: Injector) {
    super();
  }

  private get toastrService(): ToastrService {
    return this.injector.get(ToastrService);
  }

  public handleError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      // unexpected error handle
      this.toastrService.error('خطا در برقراری ارتباط با سرور', 'خطا', {
        closeButton: true,
        timeOut: 5000,
        onActivateTick: true,
      });
    } else {
      throwError(error);
      this.toastrService.error('error', error, {
        closeButton: true,
        timeOut: 5000,
        onActivateTick: true,
      });
    }

    super.handleError(error);
  }
}
