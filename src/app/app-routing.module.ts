import { PharmPreviewComponent } from './views/pharm-preview/pharm-preview.component';
import { LabPreviewComponent } from './views/lab-preview/lab-preview.component';
import { PharmGuard } from './utils/guards/pharm.guard';
import { LabGuard } from './utils/guards/lab.guard';
import { DoctorComponent } from './views/doctor/doctor.component';
import { NotificationsComponent } from './views/notifications/notifications.component';
import { PatieintDoctorGuard } from './utils/guards/patient-doctor.guard';
import { ChatComponent } from './views/chat/chat.component';
import { PatientGuard } from './utils/guards/patient.guard';
import { DoctorGuard } from './utils/guards/doctor.guard';
import { PatientInformationComponent } from './views/patient-information/patient-information.component';
import { PharmaciesComponent } from './views/users/pharmacies/pharmacies.component';
import { LaboratoriesComponent } from './views/users/laboratories/laboratories.component';
import { DoctorsComponent } from './views/users/doctors/doctors.component';
import { PatientsComponent } from './views/users/patients/patients.component';
import { DoctorReserveHistoryComponent } from './views/doctor-reserve-history/doctor-reserve-history.component';
import { PatientReserveHistoryComponent } from './views/patient-reserve-history/patient-reserve-history.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { BlankComponent } from './views/blank/blank.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './views/profile/profile.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { AuthGuard } from './utils/guards/auth.guard';
import { NonAuthGuard } from './utils/guards/non-auth.guard';
import { DoctorsCategoryComponent } from './views/doctors-category/doctors-category.component';
import { DoctorScheduleComponent } from './views/doctor-schedule/doctor-schedule.component';
import { AdminSettingsComponent } from './views/admin-settings/admin-settings.component';
import { ReserveComponent } from './views/reserve/reserve.component';
import { AdminGuard } from './utils/guards/admin.guard';
import { DoctorInformationComponent } from './views/doctor-information/doctor-information.component';
import { AdminDoctorGuard } from './utils/guards/admin-doctor.guard';
import { TransactionsComponent } from './views/transactions/transactions.component';
import { SettlementRequestComponent } from './views/settlement-request/settlement-request.component';
import { AdminSettlementComponent } from './views/admin-settlement/admin-settlement.component';
import { IncCreditComponent } from './views/inc-credit/inc-credit.component';
import { CallComponent } from './views/call/call.component';
import { VisitstatusComponent } from './views/visitstatus/visitstatus.component';
import { PrescriptionComponent } from './views/prescription/prescription.component';
import { ForgetpasswordComponent } from './pages/forgetpassword/forgetpassword.component';
import { PatientDiagnosisHistoryComponent } from './views/patient-diagnosis-history/patient-diagnosis-history.component';
import { AdminDoctorPatientGuard } from './utils/guards/admin-doctor-patient.guard';
import { PatientPrescriptionsHistoryComponent } from './views/patient-prescriptions-history/patient-prescriptions-history.component';
import { PatientMedicinesHistoryComponent } from './views/patient-medicines-history/patient-medicines-history.component';
import { AdminBankComponent } from './views/admin-bank/admin-bank.component';
import { DoctorcardComponent } from './views/doctorcard/doctorcard.component';
import { LogsComponent } from './views/logs/logs.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'profile/:id',
        component: ProfileComponent,
        data: { title: 'پرونده سلامت بیمار' },
        canActivate: [AdminDoctorGuard],
      },
      {
        path: 'doctor/:id',
        component: DoctorComponent,
        data: { title: 'پروفایل پزشک' },
        canActivate: [AdminGuard],
      },
      {
        path: 'visitstatus/:id',
        component: VisitstatusComponent,
        data: { title: 'ویزیت بیمار' },
        canActivate: [DoctorGuard],
      },
      {
        path: 'blank',
        component: BlankComponent,
        data: { title: 'صفحه خالی' },
      },
      {
        path: 'patientInformation',
        component: PatientInformationComponent,
        data: { title: 'تنظیمات' },
        canActivate: [PatientGuard],
      },
      {
        path: 'increasecredit',
        component: IncCreditComponent,
        data: { title: 'افزایش اعتبار' },
        canActivate: [PatientGuard],
      },
      {
        path: 'transactions',
        component: TransactionsComponent,
        data: { title: 'تراکنش ها' },
        canActivate: [PatieintDoctorGuard],
      },
      {
        path: 'settlements',
        component: AdminSettlementComponent,
        data: { title: 'درخواست های تسویه' },
        canActivate: [AdminGuard],
      },
      {
        path: 'settlementrequest',
        component: SettlementRequestComponent,
        data: { title: 'درخواست تسویه' },
        canActivate: [DoctorGuard],
      },
      {
        path: 'doctorInformation',
        component: DoctorInformationComponent,
        data: { title: 'اطلاعات پزشک' },
        canActivate: [DoctorGuard],
      },
      {
        path: 'patients',
        component: PatientsComponent,
        data: { title: 'بیماران' },
        canActivate: [AdminGuard],
      },
      {
        path: 'doctors',
        component: DoctorsComponent,
        data: { title: 'پزشکان' },
        canActivate: [AdminGuard],
      },
      {
        path: 'laboratories',
        component: LaboratoriesComponent,
        data: { title: 'آزمایشگاه ها' },
        canActivate: [AdminGuard],
      },
      {
        path: 'adminbank',
        component: AdminBankComponent,
        data: { title: 'بانک' },
        canActivate: [AdminGuard],
      },
      {
        path: 'pharmacies',
        component: PharmaciesComponent,
        data: { title: 'داروخانه ها' },
        canActivate: [AdminGuard],
      },
      {
        path: 'doctorSchedule',
        component: DoctorScheduleComponent,
        data: { title: 'برنامه هفتگی پزشک' },
        canActivate: [DoctorGuard],
      },
      {
        path: 'doctorsCategory',
        component: DoctorsCategoryComponent,
        data: { title: 'دسته بندی پزشکان' },
        canActivate: [AdminGuard],
      },
      {
        path: 'reserve',
        component: ReserveComponent,
        data: { title: 'رزرو نوبت' },
        canActivate: [PatientGuard],
      },
      {
        path: 'adminSettings',
        component: AdminSettingsComponent,
        data: { title: 'تنظیمات مدیر' },
        canActivate: [AdminGuard],
      },
      {
        path: 'logs',
        component: LogsComponent,
        data: { title: 'مدیریت رخدادها' },
        canActivate: [AdminGuard],
      },
      {
        path: 'patientreserves',
        component: PatientReserveHistoryComponent,
        data: { title: 'ویزیت های من' },
        canActivate: [PatientGuard],
      },
      {
        path: 'patientdiagnosis',
        component: PatientDiagnosisHistoryComponent,
        data: { title: 'آزمایشات من' },
        canActivate: [PatientGuard],
      },
      {
        path: 'patientmedicines',
        component: PatientMedicinesHistoryComponent,
        data: { title: 'داروهای من' },
        canActivate: [PatientGuard],
      },
      {
        path: 'patientprescriptions',
        component: PatientPrescriptionsHistoryComponent,
        data: { title: 'نسخه‌های من' },
        canActivate: [PatientGuard],
      },
      {
        path: 'doctorreservehistory',
        component: DoctorReserveHistoryComponent,
        data: { title: 'تاریخچه ویزیت' },
        canActivate: [DoctorGuard],
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
        data: { title: 'اطلاعیه ها' },
      },
      {
        path: 'chat',
        component: ChatComponent,
        data: { title: 'پیام رسان' },
        canActivate: [PatieintDoctorGuard],
      },
      {
        path: 'chat/:id',
        component: ChatComponent,
        data: { title: 'پیام رسان' },
        canActivate: [DoctorGuard],
      },
      {
        path: 'call/:id',
        component: CallComponent,
        data: { title: 'تماس' },
        canActivate: [PatieintDoctorGuard],
      },
      {
        path: 'prescription/:id',
        component: PrescriptionComponent,
        data: { title: 'نسخه' },
        canActivate: [AdminDoctorPatientGuard],
      },
      {
        path: 'doctorcard/:id',
        component: DoctorcardComponent,
        data: { title: 'اطلاعات پزشک' },
        canActivate: [PatientGuard],
      },
      {
        path: 'labPreview/:id',
        component: LabPreviewComponent,
        data: { title: 'نمایش آزمایشات' },
        canActivate: [LabGuard],
      },
      {
        path: 'pharmPreview/:id',
        component: PharmPreviewComponent,
        data: { title: 'نمایش داروها' },
        canActivate: [PharmGuard],
      },
      {
        path: '',
        component: DashboardComponent,
        data: { title: 'داشبورد' },
      },
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NonAuthGuard],
    data: { title: 'ورود' },
  },
  {
    path: 'forgetPassword',
    component: ForgetpasswordComponent,
    canActivate: [NonAuthGuard],
    data: { title: 'فراموشی رمز عبور' },
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [NonAuthGuard],
    data: { title: 'عضویت' },
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
