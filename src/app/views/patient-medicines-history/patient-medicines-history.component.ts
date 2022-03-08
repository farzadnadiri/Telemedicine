import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IPageData } from 'src/app/interfaces/IPageAble';
import { PrescriptionService } from 'src/app/services/prescription.service';

@Component({
  selector: 'app-patient-medicines-history',
  templateUrl: './patient-medicines-history.component.html',
  styleUrls: ['./patient-medicines-history.component.scss']
})
export class PatientMedicinesHistoryComponent implements OnInit {

  constructor(private prescriptionService: PrescriptionService, private toastr: ToastrService) { }
  pageSize = this.prescriptionService.pageSize;
  profileMedicineItems = [];
  profileMedicinePage = 1;
  profileMedicineCollectionSize = 0;
  isLoading=false;

  ngOnInit(): void {
    this.loadMedicines();
  }

  loadMedicines() {
    this.isLoading=true;
    this.prescriptionService.getMyMedicines(this.profileMedicinePage).subscribe(
      (response: IPageData) => {
        this.isLoading=false;
        this.profileMedicineItems = response.data;
        this.profileMedicineCollectionSize = response.totalItems;
      },
      (error) => {
        this.isLoading=false;
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      }
    );
  }

}
