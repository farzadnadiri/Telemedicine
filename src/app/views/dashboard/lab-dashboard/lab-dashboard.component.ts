import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PrescriptionService } from 'src/app/services/prescription.service';
import { Util } from 'src/app/utils/util';

@Component({
  selector: 'app-lab-dashboard',
  templateUrl: './lab-dashboard.component.html',
  styleUrls: ['./lab-dashboard.component.scss']
})
export class LabDashboardComponent implements OnInit {
  prescriptionId: string;
  experiments: any;
  constructor(
    private service: PrescriptionService,
    private router: Router,
    private toastr: ToastrService,
    public util: Util
  ) {}

  ngOnInit(): void {}

  onCodeResult(resultString: string) {
    this.searchPrescription(resultString)
  }
  
  searchPrescription(id) {
    this.service.loadPrescriptionExperiments(id).subscribe(
      (response) => {
        this.experiments = response;
        // todo redirect to other page
        this.router.navigate(['labPreview/' + id]);
      },
      (error) => {
        if (error.status === 404) {
          return this.toastr.error('شناسه نسخه ارائه شده یافت نشد', 'خطا');
        }
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      }
    );
  }
}
