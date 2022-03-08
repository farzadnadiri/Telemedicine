import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IPageData } from 'src/app/interfaces/IPageAble';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-admin-bank',
  templateUrl: './admin-bank.component.html',
  styleUrls: ['./admin-bank.component.scss']
})
export class AdminBankComponent implements OnInit {
  constructor(public service: TransactionService , private toastr: ToastrService) { }

  status: any;
  filterWord = '';
  pageSize = this.service.pageSize;
  TransactionsItems = [];
  TransactionsPage = 1;
  TransactionsCollectionSize = 0;


  ngOnInit(): void {
    this.loadTransactions();
    this.updateStatus();
  }

  onFilterChange(val) {
    this.filterWord = val;
    this.TransactionsPage = 1;
    this.loadTransactions();
  }
  
  loadTransactions() {
    this.service
      .getAllTransactions(this.TransactionsPage, this.filterWord)
      .subscribe(
        (response: IPageData) => {
          this.TransactionsItems = response.data;
          this.TransactionsCollectionSize = response.totalItems;
        },
        (error) => {
          return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
        }
      );
  }

  updateStatus() {
    this.service.adminStatus().subscribe((result: any) => {
      this.status = result;
    });
  }
  
}
