import { SocketService } from './../../services/socket.service';
import { VisitService } from 'src/app/services/visit.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { Component, OnInit } from '@angular/core';
import { IPageData } from 'src/app/interfaces/IPageAble';

@Component({
  selector: 'app-doctor-reserve-history',
  templateUrl: './doctor-reserve-history.component.html',
  styleUrls: ['./doctor-reserve-history.component.scss']
})
export class DoctorReserveHistoryComponent implements OnInit {
  page = 1;
  dateStart = '';
  dateConfirmed = '';
  collectionSize = 0;
  public items: any[];
  pageSize = this.service.pageSize;
  datePickerConfig = {
    drops: 'down',
    dir: 'rtl',
  };

  constructor(private service: VisitService) { }

  load() {
    this.service.doctorPage(this.page, this.dateConfirmed).subscribe((result: IPageData) => {
      this.items = result.data;
      this.collectionSize = result.totalItems;
    });
  }

  filter(){
    this.page = 1;
    this.dateConfirmed = this.dateStart;
    this.load();
  }

  ngOnInit(): void {
    this.load();
  }

  display(item)
  {
  }


}
