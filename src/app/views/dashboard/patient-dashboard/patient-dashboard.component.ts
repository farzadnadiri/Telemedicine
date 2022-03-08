import { VisitService } from './../../../services/visit.service';
import { Component, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { PatientService } from 'src/app/services/patient.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { Util } from 'src/app/utils/util';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.scss']
})
export class PatientDashboardComponent implements OnInit {
  @Output() user;
  patientActiveItems = [];
  status: any;
  pageSize = this.patientsService.pageSize;
  patientUnload = false;
  loading = false;
  market:any;
  marketFilter='';

  constructor(
    public authService: AuthService,
    public util: Util,
    private toastr: ToastrService,
    public visitService: VisitService,
    public doctorService: DoctorService,
    public patientsService: PatientService) {
    this.user = authService.currentUser;
  }

  ngOnInit(): void {
    this.updateStatus();
    this.patientActive();
    this.loadPatientData();
    this.loadMarket();
  }

  loadMarket() {
    this.doctorService.market(this.marketFilter).subscribe((result: any) => {
      this.market = result;
    });
  }
  

  updateStatus() {
    this.visitService.patientStatus().subscribe((result: any) => {
      this.status = result;
    });
  }
  
  loadPatientData() {
    this.patientsService.loadInfo().subscribe(
      (response: any) => {
       if (!response.nationalId || !response.dateOfBirth){
        this.patientUnload = true;
       }
      },
      (error) => {
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      });
  }
  patientActive() {
    this.visitService.patientActive().subscribe(
      (response: []) => {
        this.patientActiveItems = response;
      },
      (error) => {
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      });
  }

  patientCancel(item) {
    this.loading = true;
    this.visitService.patientCancel(item).subscribe(
      (response) => {
        this.loading = false;
        this.patientActive();
      },
      (error) => {
        this.loading = false;
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      });
  }

  onFilterChange(val) {
    this.marketFilter = val;
    this.loadMarket();
  }

}
