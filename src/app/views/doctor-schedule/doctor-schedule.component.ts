import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ISelectedDay } from 'src/app/interfaces/ISelectedDay';
import { ConfigService } from 'src/app/services/config.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { Util } from 'src/app/utils/util';

@Component({
  selector: 'app-doctor-schedule',
  templateUrl: './doctor-schedule.component.html',
  styleUrls: ['./doctor-schedule.component.scss'],
})
export class DoctorScheduleComponent implements OnInit {
  public isLoading = false;
  schedule = [];

  startTime = new FormControl('', (control: FormControl) => {
    const value = control.value;
    if (!value) {
      return null;
    }
    if (this.checkConflict()) {
      return { conflict: true };
    }
    if (
      this.util.timeInMins(value) > this.util.timeInMins(this.endTime.value)
    ) {
      return { period: true };
    }
    return null;
  });

  endTime = new FormControl('', (control: FormControl) => {
    const value = control.value;
    if (!value) {
      return null;
    }
    if (this.checkConflict()) {
      return { conflict: true };
    }
    if (
      this.util.timeInMins(value) < this.util.timeInMins(this.startTime.value)
    ) {
      return { period: true };
    }
    return null;
  });

  closeResult = '';
  toDeleteRange = '';
  selectedDay: ISelectedDay;

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private service: DoctorService,
    private config: ConfigService,
    private util: Util
  ) {}

  ngOnInit(): void {
    this.service.loadSchedule().subscribe((result: any) => {
      this.schedule = result;
    });
  }

  open(content, index) {
    this.selectedDay = {
      index: index,
      name: this.util.getDayNameFromIndex(index),
    };
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  checkConflict() {
    const dayIndex = this.selectedDay.index;
    const startUnit = this.util.timeInMins(this.startTime.value);
    const endUnit = this.util.timeInMins(this.endTime.value);
    let day = this.schedule[dayIndex];
    var overlap =
      day.data.filter(
        (obj) => obj.startUnit < endUnit && startUnit < obj.endUnit
      ).length > 0;
    return overlap;
  }

  addRange() {
    if (this.startTime.valid && this.endTime.valid) {
      const dayIndex = this.selectedDay.index;
      const startUnit = this.util.timeInMins(this.startTime.value);
      const endUnit = this.util.timeInMins(this.endTime.value);
      let day = this.schedule[dayIndex];
      day.data.push({
        startTime: this.startTime.value,
        startUnit,
        endTime: this.endTime.value,
        endUnit,
        duration: endUnit - startUnit,
        title:
          this.util.timeToString(this.startTime.value) +
          '-' +
          this.util.timeToString(this.endTime.value),
      });
      this.modalService.dismissAll();
    }
  }

  removeRange() {
    let day = this.schedule[this.selectedDay.index];
    const index = day.data.indexOf(this.toDeleteRange);
    if (index > -1) {
      day.data.splice(index, 1);
    }
    this.modalService.dismissAll();
  }

  save() {
    this.isLoading = true;
    this.service.saveSchedule(this.schedule).subscribe(
      (response) => {
        this.isLoading = false;
        return this.toastr.success('ثبت اطلاعات با موفقیت انجام شد', 'تایید');
      },

      (error) => {
        this.isLoading = false;
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
