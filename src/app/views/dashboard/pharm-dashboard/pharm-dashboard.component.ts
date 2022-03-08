import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrescriptionService } from 'src/app/services/prescription.service';
import { Util } from 'src/app/utils/util';


@Component({
  selector: 'app-pharm-dashboard',
  templateUrl: './pharm-dashboard.component.html',
  styleUrls: ['./pharm-dashboard.component.scss'],
})
export class PharmDashboardComponent implements OnInit {
  prescriptionId: string;
  medicines: any;
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
    this.service.loadPrescriptionMedicines(id).subscribe(
      (response) => {
        this.medicines = response;
        // todo redirect to other page
        this.router.navigate(['pharmPreview/' + id]);
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
