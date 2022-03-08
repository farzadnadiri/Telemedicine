import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CreditService } from 'src/app/services/credit.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { VisitService } from 'src/app/services/visit.service';
import { Util } from 'src/app/utils/util';

@Component({
  selector: 'app-doctorcard',
  templateUrl: './doctorcard.component.html',
  styleUrls: ['./doctorcard.component.scss']
})
export class DoctorcardComponent implements OnInit {
  doctorId:any;
  doctorData:any;
  doctorSchedule:any;
  date: string = '';
  loading = false;
  items = [];
  constructor(private activatedRoute: ActivatedRoute ,private visitService: VisitService, private creditService: CreditService, public util:Util , private service: DoctorService , private toastr: ToastrService) { }
  datePickerConfig = {
    drops: 'down',
    dir: 'rtl',
    min: moment(),
    max: moment().add(30, 'd'),
  };
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.doctorId = params.id;
    });
    this.loadDoctorCard(this.doctorId);
    this.loadDoctorSchedule(this.doctorId);
  }

  loadDoctorCard(id) {
    this.service.doctorCard(id).subscribe(
      (response) => {
        this.doctorData = response;
      },
      (error) => {
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      }
    );
  }

  loadDoctorSchedule(id) {
    this.service.doctorSchedule(id).subscribe(
      (response) => {
        this.doctorSchedule = response;
      },
      (error) => {
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      }
    );
  }

  
  reserve(item){
    this.loading = true;
    this.visitService.patientReserve(item) .subscribe(
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
    this.visitService.patientCancel(item) .subscribe(
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
    if (this.doctorId && this.date) {
      this.visitService.patientFilter({doctorId: this.doctorId, date: this.date})
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

}
