import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IPageData } from 'src/app/interfaces/IPageAble';
import { PrescriptionService } from 'src/app/services/prescription.service';

@Component({
  selector: 'app-patient-diagnosis-history',
  templateUrl: './patient-diagnosis-history.component.html',
  styleUrls: ['./patient-diagnosis-history.component.scss']
})
export class PatientDiagnosisHistoryComponent implements OnInit {
  pageSize = this.prescriptionService.pageSize;
  profileExperimentItems = [];
  profileExperimentPage = 1;
  profileExperimentCollectionSize = 0;
  isLoading=false;
  constructor(private prescriptionService: PrescriptionService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadExperiments();
  }


  loadExperiments() {
    this.isLoading=true;
    this.prescriptionService.getMyExperiments(this.profileExperimentPage).subscribe(
      (response: IPageData) => {
        this.isLoading=false;
        this.profileExperimentItems = response.data;
        this.profileExperimentCollectionSize = response.totalItems;
      },
      (error) => {
        this.isLoading=false;
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      }
    );
  }

}
