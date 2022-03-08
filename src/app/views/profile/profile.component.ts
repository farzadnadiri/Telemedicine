import { AuthService } from 'src/app/services/auth.service';
import { Util } from 'src/app/utils/util';
import { VisitService } from 'src/app/services/visit.service';
import { PatientService } from './../../services/patient.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IPageData } from 'src/app/interfaces/IPageAble';
import { TransactionSettlementService } from 'src/app/services/transactionSettlement.service';
import { PrescriptionService } from 'src/app/services/prescription.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  id: string;
  profile: any;
  pageSize = this.service.pageSize;
  profileTransactionsItems = [];
  profileTransactionsPage = 1;
  profileTransactionsCollectionSize = 0;

  profileVisitsItems = [];
  profileVisitsPage = 1;
  profileVisitsCollectionSize = 0;

  profilePrescriptionItems = [];
  profilePrescriptionPage = 1;
  profilePrescriptionCollectionSize = 0;

  profileMedicineItems = [];
  profileMedicinePage = 1;
  profileMedicineCollectionSize = 0;

  profileExperimentItems = [];
  profileExperimentPage = 1;
  profileExperimentCollectionSize = 0;

  constructor(
    private route: ActivatedRoute,
    private transService: TransactionSettlementService,
    private service: PatientService,
    private visitService: VisitService,
    private prescriptionService: PrescriptionService,
    private toastr: ToastrService,
    public util: Util,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = params.id;
    });

    this.service.loadProfile(this.id).subscribe(
      (response) => {
        this.profile = response;
      },
      (error) => {
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      }
    );

    this.loadVisits();
    this.loadPrescriptions();
    this.loadMedicines();
    this.loadExperiments();

    if (this.authService.currentUser.role === 0) {
      this.loadTransactions();
    }
  }

  loadTransactions() {
    this.transService
      .getUserTransactions(this.id, this.profileTransactionsPage)
      .subscribe(
        (response: IPageData) => {
          this.profileTransactionsItems = response.data;
          this.profileTransactionsCollectionSize = response.totalItems;
        },
        (error) => {
          return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
        }
      );
  }

  loadVisits() {
    this.visitService.patientProfile(this.profileVisitsPage, this.id).subscribe(
      (response: IPageData) => {
        this.profileVisitsItems = response.data;
        this.profileVisitsCollectionSize = response.totalItems;
      },
      (error) => {
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      }
    );
  }

  loadPrescriptions() {
    this.prescriptionService.getUserPrescriptions(this.id, this.profilePrescriptionPage).subscribe(
      (response: IPageData) => {
        console.log(response);
        this.profilePrescriptionItems = response.data;
        this.profilePrescriptionCollectionSize = response.totalItems;
      },
      (error) => {
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      }
    );
  }
  
  loadMedicines() {
    this.prescriptionService.getUserMedicines(this.id, this.profileMedicinePage).subscribe(
      (response: IPageData) => {
        this.profileMedicineItems = response.data;
        this.profileMedicineCollectionSize = response.totalItems;
      },
      (error) => {
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      }
    );
  }

  loadExperiments() {
    this.prescriptionService.getUserExperiments(this.id, this.profileExperimentPage).subscribe(
      (response: IPageData) => {
        this.profileExperimentItems = response.data;
        this.profileExperimentCollectionSize = response.totalItems;
      },
      (error) => {
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      }
    );
  }

}
