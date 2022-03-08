import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PrescriptionService } from 'src/app/services/prescription.service';
import { Util } from 'src/app/utils/util';

@Component({
  selector: 'app-pharm-preview',
  templateUrl: './pharm-preview.component.html',
  styleUrls: ['./pharm-preview.component.scss'],
})
export class PharmPreviewComponent implements OnInit {
  medicines: any;
  selectedItems: any[];
  prescriptionId: any;
  loading: boolean;

  constructor(
    private service: PrescriptionService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    public util: Util,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.prescriptionId = params.id;
    });
    this.searchPrescription(this.prescriptionId);
  }

  searchPrescription(id) {
    this.service.loadPrescriptionMedicines(id).subscribe(
      (response) => {
        this.medicines = response;
      },
      (error) => {
        if (error.status === 404) {
          return this.toastr.error('شناسه نسخه ارائه شده یافت نشد', 'خطا');
        }
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      }
    );
  }

  open(content) {
    this.selectedItems = [];
    if (!this.medicines && this.medicines.length < 1) {
      return;
    }

    this.medicines.forEach((element) => {
      if (element.selected) {
        this.selectedItems.push(element);
      }
    });
    if (this.selectedItems.length < 1) {
      return this.toastr.warning('هیچ دارویی انتخاب نشده است', 'خطا');
    }
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        keyboard: false,
        backdrop: 'static',
      })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  deliver() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.service.postMedicines(this.selectedItems).subscribe(
      (response) => {
        this.loading = false;
        this.modalService.dismissAll();
        return this.router.navigateByUrl('/');
      },
      (error) => {
        this.loading = false;
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      }
    );
  }
}
