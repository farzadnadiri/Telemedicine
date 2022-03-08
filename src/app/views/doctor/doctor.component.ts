import { Util } from 'src/app/utils/util';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IPageData } from 'src/app/interfaces/IPageAble';
import { PatientService } from 'src/app/services/patient.service';
import { VisitService } from 'src/app/services/visit.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { TransactionSettlementService } from 'src/app/services/transactionSettlement.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss'],
})
export class DoctorComponent implements OnInit {
  id: string;
  profile: any;
  pageSize = this.service.pageSize;

  profileTransactionsItems = [];
  profileTransactionsPage = 1;
  profileTransactionsCollectionSize = 0;

  profileVisitsItems = [];
  profileVisitsPage = 1;
  profileVisitsCollectionSize = 0;

  profileSettlementItems = [];
  profileSettlementPage = 1;
  profileSettlementCollectionSize = 0;

  constructor(
    private route: ActivatedRoute,
    private transService: TransactionSettlementService,
    private service: DoctorService,
    private visitService: VisitService,
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
    this.loadTransactions();
    this.loadSettlements();
  }

  loadVisits() {
    this.visitService.doctorProfile(this.profileVisitsPage, this.id).subscribe(
      (response: IPageData) => {
        this.profileVisitsItems = response.data;
        this.profileVisitsCollectionSize = response.totalItems;
      },
      (error) => {
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      }
    );
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

  loadSettlements() {
    this.transService
      .getUserSettlements(this.id, this.profileSettlementPage)
      .subscribe(
        (response: IPageData) => {
          this.profileSettlementItems = response.data;
          this.profileSettlementCollectionSize = response.totalItems;
        },
        (error) => {
          return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
        }
      );
  }
}
