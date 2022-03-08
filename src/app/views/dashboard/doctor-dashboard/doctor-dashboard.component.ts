import { VisitService } from './../../../services/visit.service';
import { Component, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IPageData } from 'src/app/interfaces/IPageAble';
import { AuthService } from 'src/app/services/auth.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.scss'],
})
export class DoctorDashboardComponent implements OnInit {
  @Output() user;
  status: any;
  filterWordPriority = '';
  filterWordScheduled = '';
  filterWordToday = '';
  filterWordDone = '';
  pageSize = this.doctorsService.pageSize;
  public selectedItem;
  public cancelReason;

  doctorPriorityItems = [];
  doctorPriorityPage = 1;
  doctorPriorityCollectionSize = 0;

  doctorTodayItems = [];
  doctorTodayPage = 1;
  doctorTodayCollectionSize = 0;

  doctorScheduledItems = [];
  doctorScheduledPage = 1;
  doctorScheduledCollectionSize = 0;

  doctorDoneItems = [];
  doctorDonePage = 1;
  doctorDoneCollectionSize = 0;

  constructor(
    private modalService: NgbModal,
    public authService: AuthService,
    private toastr: ToastrService,
    public visitService: VisitService,
    public doctorsService: DoctorService
  ) {
    this.user = authService.currentUser;
  }

  ngOnInit(): void {
    this.updateStatus();
    this.doctorToday();
    this.doctorPriority();
    this.doctorScheduled();
    this.doctorDone();
  }
  updateStatus() {
    this.visitService.doctorStatus().subscribe((result: any) => {
      this.status = result;
    });
  }
  doctorPriority() {
    this.visitService
      .doctorPriority(this.doctorPriorityPage, this.filterWordPriority)
      .subscribe(
        (response: IPageData) => {
          this.doctorPriorityItems = response.data;
          this.doctorPriorityCollectionSize = response.totalItems;
        },
        (error) => {
          return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
        }
      );
  }

  doctorToday() {
    this.visitService
      .doctorToday(this.doctorTodayPage, this.filterWordToday)
      .subscribe(
        (response: IPageData) => {
          this.doctorTodayItems = response.data;
          this.doctorTodayCollectionSize = response.totalItems;
        },
        (error) => {
          return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
        }
      );
  }

  doctorScheduled() {
    this.visitService
      .doctorScheduled(this.doctorScheduledPage, this.filterWordScheduled)
      .subscribe(
        (response: IPageData) => {
          this.doctorScheduledItems = response.data;
          this.doctorScheduledCollectionSize = response.totalItems;
        },
        (error) => {
          return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
        }
      );
  }

  doctorDone() {
    this.visitService
      .doctorDone(this.doctorDonePage, this.filterWordDone)
      .subscribe(
        (response: IPageData) => {
          this.doctorDoneItems = response.data;
          this.doctorDoneCollectionSize = response.totalItems;
        },
        (error) => {
          return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
        }
      );
  }


  open(content, item) {
    this.selectedItem = item;
    this.cancelReason = '';
    this.modalService.open(content);
  }

  onFilterChangePriority(val) {
    this.filterWordPriority = val;
    this.doctorPriorityPage = 1;
    this.doctorPriority();
  }
  onFilterChangeToday(val) {
    this.filterWordToday = val;
    this.doctorTodayPage = 1;
    this.doctorToday();
  }
  onFilterChangeScheduled(val) {
    this.filterWordScheduled = val;
    this.doctorScheduledPage = 1;
    this.doctorScheduled();
  }
  onFilterChangeDone(val) {
    this.filterWordDone = val;
    this.doctorDonePage = 1;
    this.doctorDone();
  }
}
