import { SocketService } from './../../services/socket.service';
import { VisitService } from 'src/app/services/visit.service';
import { PatientService } from './../../services/patient.service';
import { Component, OnInit, Output } from '@angular/core';
import { IPageData } from 'src/app/interfaces/IPageAble';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-patient-reserve-history',
  templateUrl: './patient-reserve-history.component.html',
  styleUrls: ['./patient-reserve-history.component.scss']
})

export class PatientReserveHistoryComponent implements OnInit {
  @Output() user;
  page = 1;
  collectionSize = 0;
  items: any[];
  isLoading=false;
  date: string = '';
  pageSize = this.service.pageSize;

  constructor(private service: VisitService, private toastr: ToastrService) { }

  load() {
    this.isLoading=true;
    this.service.patientPage(this.page, this.date).subscribe((result: IPageData) => {
      this.isLoading=false;
      this.items = result.data;
      this.collectionSize = result.totalItems;
    },
    (error) => {
      this.isLoading=false;
      return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
    });
  }

  ngOnInit(): void {
    this.load();
  }




}
