import { VisitService } from 'src/app/services/visit.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'jalali-moment';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  tap,
  switchMap,
} from 'rxjs/operators';
import { ConfigService } from 'src/app/services/config.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { DoctorsCategoryService } from 'src/app/services/doctors-category.service';
import { Util } from 'src/app/utils/util';
import dayjs from 'dayjs';
import jalaliday from 'jalaliday';
import { CreditService } from 'src/app/services/credit.service';
dayjs.extend(jalaliday);

@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.scss'],
})
export class ReserveComponent implements OnInit {
  loading = false;
  searchingCategory = false;
  searchFailedCategory = false;
  items = [];
  searching = false;
  searchFailed = false;
  date: string = '';
  doctor;
  category;
  datePickerConfig = {
    drops: 'down',
    dir: 'rtl',
    min: moment(),
    max: moment().add(30, 'd'),
  };

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private service: VisitService,
    private creditService: CreditService,
    private doctorService: DoctorService,
    private categoryService: DoctorsCategoryService,
    private config: ConfigService,
    private fb: FormBuilder,
    private util: Util
  ) {}

  ngOnInit(): void {}

  formatter = (x: { name: string }) => x.name;

  reserve(item){
    this.loading = true;
    this.service.patientReserve(item) .subscribe(
      async (response) => {
        this.loading = false;
        await this.creditService.loadCredit();
        this.filterRanges();
      },
      (error) => {
        this.loading = false;
        if (
          error.status === 400 &&
          error.error === 'user credit is low'
        ) {
          return this.toastr.error('موجودی حساب شما برای رزرو کافی نمی باشد', 'خطا');
        }

        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      });
  }

  cancelReserve(item){
    this.loading = true;
    this.service.patientCancel(item) .subscribe(
      async (response) => {
        this.loading = false;
        await this.creditService.loadCredit();
        this.filterRanges();
      },
      (error) => {
        this.loading = false;
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      });
  }

  filterRanges() {
    if (this.doctor && this.date) {
      this.service.patientFilter({doctorId: this.doctor._id, date: this.date})
      .subscribe(
        (response: []) => {
          this.items = response;
        },
        (error) => {
          return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
        }
      );
    }
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        this.doctorService.filter(term, this.category ? this.category._id : '').pipe(
          tap(() => (this.searchFailed = false)),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        )
      ),
      tap(() => (this.searching = false))
    )

  searchCategory = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searchingCategory = true)),
      switchMap((term) =>
        this.categoryService.search(term).pipe(
          tap(() => (this.searchFailedCategory = false)),
          catchError(() => {
            this.searchFailedCategory = true;
            return of([]);
          })
        )
      ),
      tap(() => (this.searchingCategory = false))
    )
}
