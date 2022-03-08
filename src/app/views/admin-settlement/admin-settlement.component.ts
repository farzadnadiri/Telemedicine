import { Component, OnInit } from '@angular/core';
import { IPageData } from 'src/app/interfaces/IPageAble';
import { ConfigService } from 'src/app/services/config.service';
import { TransactionSettlementService } from 'src/app/services/transactionSettlement.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-settlement',
  templateUrl: './admin-settlement.component.html',
  styleUrls: ['./admin-settlement.component.scss'],
})
export class AdminSettlementComponent implements OnInit {
  page = 1;
  collectionSize = 0;
  public selectedItem;
  items: any[];
  filterWord = '';
  pageSize = this.service.pageSize;
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

  onFilterChange(val) {
    this.filterWord = val;
    this.page = 1;
    this.load();
  }
  load() {
    this.service
      .getAllSettlements(this.page, this.filterWord)
      .subscribe((result: IPageData) => {
        this.items = result.data;
        this.collectionSize = result.totalItems;
      });
  }

  ChangeStatus(item) {
    this.isLoading = true;
    this.service.changeSettlementStatus(item).subscribe(
      (response) => {
        this.isLoading = false;
        this.modalService.dismissAll();
        return this.ngOnInit();
      },

      (error) => {
        this.isLoading = false;
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      }
    );
  }

  open(content, item?) {
    this.selectedItem = item;
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
