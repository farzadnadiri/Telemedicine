import { VisitService } from 'src/app/services/visit.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IPageData } from 'src/app/interfaces/IPageAble';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  @Output() user;
  status: any;
  filterWordPriority = '';
  filterWordScheduled = '';
  filterWordToday = '';
  filterWordDone = '';
  pageSize = this.visitService.pageSize;
  public selectedItem;
  public cancelReason;

  priorityItems = [];
  priorityPage = 1;
  priorityCollectionSize = 0;

  todayItems = [];
  todayPage = 1;
  todayCollectionSize = 0;

  scheduledItems = [];
  scheduledPage = 1;
  scheduledCollectionSize = 0;

  doneItems = [];
  donePage = 1;
  doneCollectionSize = 0;

  constructor(
    private modalService: NgbModal,
    public authService: AuthService,
    private toastr: ToastrService,
    public visitService: VisitService,
  ) {
    this.user = authService.currentUser;
  }

  ngOnInit(): void {
    this.updateStatus();
    this.today();
    this.priority();
    this.scheduled();
    this.done();
  }
  updateStatus() {
    this.visitService.adminStatus().subscribe((result: any) => {
      this.status = result;
    });
  }
  priority() {
    this.visitService
      .adminPriority(this.priorityPage, this.filterWordPriority)
      .subscribe(
        (response: IPageData) => {
          this.priorityItems = response.data;
          this.priorityCollectionSize = response.totalItems;
        },
        (error) => {
          return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
        }
      );
  }

  today() {
    this.visitService
      .adminToday(this.todayPage, this.filterWordToday)
      .subscribe(
        (response: IPageData) => {
          this.todayItems = response.data;
          this.todayCollectionSize = response.totalItems;
        },
        (error) => {
          return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
        }
      );
  }

  scheduled() {
    this.visitService
      .adminScheduled(this.scheduledPage, this.filterWordScheduled)
      .subscribe(
        (response: IPageData) => {
          this.scheduledItems = response.data;
          this.scheduledCollectionSize = response.totalItems;
        },
        (error) => {
          return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
        }
      );
  }

  done() {
    this.visitService
      .adminDone(this.donePage, this.filterWordDone)
      .subscribe(
        (response: IPageData) => {
          this.doneItems = response.data;
          this.doneCollectionSize = response.totalItems;
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
    this.priorityPage = 1;
    this.priority();
  }
  onFilterChangeToday(val) {
    this.filterWordToday = val;
    this.todayPage = 1;
    this.today();
  }
  onFilterChangeScheduled(val) {
    this.filterWordScheduled = val;
    this.scheduledPage = 1;
    this.scheduled();
  }
  onFilterChangeDone(val) {
    this.filterWordDone = val;
    this.donePage = 1;
    this.done();
  }
}
