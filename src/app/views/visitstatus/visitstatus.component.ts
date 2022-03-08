import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { IPrescription } from 'src/app/interfaces/IPrescription';
import { AuthService } from 'src/app/services/auth.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { VisitService } from 'src/app/services/visit.service';
import { Util } from 'src/app/utils/util';
import moment from 'jalali-moment';
import { PrescriptionService } from 'src/app/services/prescription.service';

@Component({
  selector: 'app-visitstatus',
  templateUrl: './visitstatus.component.html',
  styleUrls: ['./visitstatus.component.scss']
})
export class VisitstatusComponent implements OnInit {
  public cancelReason;
  public currentVisit;
  id: string;
  public prescription: IPrescription;
  public diagnosis = { status: true, text: '' };
  public medicine = { name: '', usage: '', freq: '', description: '' };
  public experiment = '';
  closeResult = '';
  datePickerConfig = {
    drops: 'up',
    dir: 'rtl',
    min: moment(),
    max: moment().add(365, 'd'),
  };

  datePickerConfig2 = {
    drops: 'down',
    dir: 'rtl',
    min: moment(),
    max: moment().add(365, 'd'),
  };

  public loading = false;
  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    public authService: AuthService,
    private toastr: ToastrService,
    public visitService: VisitService,
    public util: Util,
    private router: Router,
    public prescriptionService: PrescriptionService,
    public doctorsService: DoctorService) { }

  ngOnInit(): void {
    // tslint:disable-next-line: max-line-length
    this.prescription = { directVisit: true, diagnosis: [], medicines: [], experiments: [], note: '', advice: '', nextVisit: '', patient: '', visit: '', visitDone: false };
    this.route.params.subscribe((params) => {
      this.id = params.id;
      this.prescription.visit = this.id;
    });

    this.visitService.doctorVisitItem(this.id).subscribe(
      (response) => {
        this.currentVisit = response;
        this.prescription.patient = this.currentVisit.patient._id;
      },
      (error) => {
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      }
    );
  }

  addDiagnosis() {
    if (this.diagnosis.text) {
      this.prescription.diagnosis.push(this.diagnosis);
      this.diagnosis = { status: true, text: '' };
    }
  }

  removeExperiment(item) {
    const index = this.prescription.experiments.indexOf(item);
    if (index > -1) {
      this.prescription.experiments.splice(index, 1);
    }
  }

  addExperiment() {
    if (this.experiment) {
      this.prescription.experiments.push(this.experiment);
      this.experiment = '';
    }
  }

  removeDiagnosis(item) {
    const index = this.prescription.diagnosis.indexOf(item);
    if (index > -1) {
      this.prescription.diagnosis.splice(index, 1);
    }
  }

  addMedicine() {
    if (this.medicine.name) {
      this.prescription.medicines.push(this.medicine);
      this.medicine = { name: '', usage: '', freq: '', description: '' };
    }
  }

  removeMedicine(item) {
    const index = this.prescription.medicines.indexOf(item);
    if (index > -1) {
      this.prescription.medicines.splice(index, 1);
    }
  }

  doctorstatusDone() {
    this.visitService.visitStatusDone(this.currentVisit).subscribe(
      (response: any) => {
      },
      (error) => {
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      }
    );
  }

  doctorCancel() {
    if (!this.cancelReason) { return; }
    this.currentVisit.cancelReason = this.cancelReason;
    this.visitService.doctorCancel(this.currentVisit).subscribe(
      (response) => { this.cancelReason = ''; },
      (error) => {
        this.cancelReason = '';
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

  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title', keyboard: false, backdrop: 'static' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  // final function and sign the prescription
  sign() {
    if (this.loading) { return; }
    this.loading = true;
    this.prescriptionService.post(this.prescription).subscribe(
      (response) => {
        this.loading = false;
        this.modalService.dismissAll();
        if (this.prescription.visitDone){
        this.router.navigateByUrl('/');
        }
        else{
          return this.ngOnInit();
        }
      },
      (error) => {
        this.loading = false;
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      }
    );

  }
}
