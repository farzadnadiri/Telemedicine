import { Component, OnInit } from '@angular/core';
import { IPageData } from 'src/app/interfaces/IPageAble';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {

  page = 1;
  pageSize = this.service.pageSize;
  collectionSize = 0;
  items: any[];
  constructor(private service: LogService) { }

  ngOnInit(): void {
    this.load();
  }

  load(){
    this.service.getPage(this.page).subscribe((result: IPageData) => {
      this.items = result.data;
      this.collectionSize = result.totalItems;
    });
  }
}
