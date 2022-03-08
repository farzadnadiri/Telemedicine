import { Component, OnInit } from '@angular/core';
import { IPageData } from 'src/app/interfaces/IPageAble';
import { ConfigService } from 'src/app/services/config.service';
import { TransactionSettlementService } from 'src/app/services/transactionSettlement.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-settlement-request',
  templateUrl: './settlement-request.component.html',
  styleUrls: ['./settlement-request.component.scss'],
})
export class SettlementRequestComponent implements OnInit {
  page = 1;
  collectionSize = 0;
  items: any[];
  pageSize = this.service.pageSize;
  filterWord = '';
  closeResult = '';
  public isLoading = false;
  constructor(
    private toastr: ToastrService,
    private modalService: NgbModal,
    private service: TransactionSettlementService,
    private config: ConfigService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.service
      .getMySettlements(this.page, this.filterWord)
      .subscribe((result: IPageData) => {
        this.items = result.data;
        this.collectionSize = result.totalItems;
      });
  }

  send() {
    this.isLoading = true;
    this.service.sendSettlement().subscribe(
      (response) => {
        this.isLoading = false;
        this.modalService.dismissAll();
        return this.ngOnInit();
      },

      (error) => {
        this.isLoading = false;
        if (error.status === 400 && error.error == 'user sheba is invalid') {
          return this.toastr.error(
            'شماره شبا وارد شده معتبر نمی باشد، لطفا شماره شبا خود را در پروفایل خود وارد نمایید',
            'خطا'
          );
        } else if (
          error.status === 400 &&
          error.error == 'user credit is low'
        ) {
          return this.toastr.error(
            'اعتبار حساب کاربری شما از حداقل درخواست تسویه کمتر است، حداقل درخواست تسویه 50 هزار تومان می باشد',
            'خطا'
          );
        } else {
          return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
        }
      }
    );
  }

  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
