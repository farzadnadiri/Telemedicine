import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { IPageData } from 'src/app/interfaces/IPageAble';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  page = 1;
  pageSize = this.service.pageSize;
  collectionSize = 0;
  items: any[];
  constructor(private service: NotificationService) { }

  ngOnInit(): void {
    this.load();
  }

  load(){
    this.service.getPage(this.page).subscribe((result: IPageData) => {
      this.items = result.data;
      this.collectionSize = result.totalItems;
    });
  }
  dateString(date) {
    return moment(date).fromNow();
  }
}
