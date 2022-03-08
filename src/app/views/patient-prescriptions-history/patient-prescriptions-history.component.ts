import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IPageData } from 'src/app/interfaces/IPageAble';
import { PrescriptionService } from 'src/app/services/prescription.service';

@Component({
  selector: 'app-patient-prescriptions-history',
  templateUrl: './patient-prescriptions-history.component.html',
  styleUrls: ['./patient-prescriptions-history.component.scss']
})
export class PatientPrescriptionsHistoryComponent implements OnInit {

  constructor(private prescriptionService: PrescriptionService, private toastr: ToastrService) { }
  profilePrescriptionItems = [];
  profilePrescriptionPage = 1;
  profilePrescriptionCollectionSize = 0;
  pageSize = this.prescriptionService.pageSize;
  isLoading=false;
  ngOnInit(): void {
    this.loadPrescriptions();
  }

  loadPrescriptions() {
    this.isLoading=true;
    this.prescriptionService.getMyPrescriptions(this.profilePrescriptionPage).subscribe(
      (response: IPageData) => {
        this.isLoading=false;
        this.profilePrescriptionItems = response.data;
        this.profilePrescriptionCollectionSize = response.totalItems;
      },
      (error) => {
        this.isLoading=false;
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      }
    );
  }


}
