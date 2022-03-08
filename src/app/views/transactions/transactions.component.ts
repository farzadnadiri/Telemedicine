import { Component, OnInit } from '@angular/core';
import { IPageData } from 'src/app/interfaces/IPageAble';
import { ConfigService } from 'src/app/services/config.service';
import * as moment from 'jalali-moment';
import { TransactionSettlementService } from 'src/app/services/transactionSettlement.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  page = 1;
  collectionSize = 0;
  items: any[];
  pageSize = this.service.pageSize;
  filterWord = '';

  constructor(
    private service: TransactionSettlementService,
    private config: ConfigService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.service
      .getMyTransactions(this.page, this.filterWord)
      .subscribe((result: IPageData) => {
        this.items = result.data;
        this.collectionSize = result.totalItems;
      });
  }
}
