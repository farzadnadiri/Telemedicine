import { SocketService } from './services/socket.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './pages/main/main.component';
import { LoginComponent } from './pages/login/login.component';
import { HeaderComponent } from './pages/main/header/header.component';
import { FooterComponent } from './pages/main/footer/footer.component';
import { MenuSidebarComponent } from './pages/main/menu-sidebar/menu-sidebar.component';
import { BlankComponent } from './views/blank/blank.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProfileComponent } from './views/profile/profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { ToastrModule } from 'ngx-toastr';
import { NotificationsDropdownMenuComponent } from './pages/main/header/notifications-dropdown-menu/notifications-dropdown-menu.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppButtonComponent } from './components/app-button/app-button.component';
import { DpDatePickerModule } from 'ng2-jalali-date-picker';
import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import { UserDropdownMenuComponent } from './pages/main/header/user-dropdown-menu/user-dropdown-menu.component';
import { AuthService } from './services/auth.service';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AuthGuard } from './utils/guards/auth.guard';
import { ErrorHandlerService } from './services/error-handler.service';
import { HttpConfigInterceptor } from './utils/interceptors/httpconfig.interceptor';
import { ConfigService, ConfigModule } from './services/config.service';
import { PatientsComponent } from './views/users/patients/patients.component';
import { DoctorsComponent } from './views/users/doctors/doctors.component';
import { LaboratoriesComponent } from './views/users/laboratories/laboratories.component';
import { PharmaciesComponent } from './views/users/pharmacies/pharmacies.component';
import { DoctorsCategoryComponent } from './views/doctors-category/doctors-category.component';
import { Util } from './utils/util';
import { DoctorScheduleComponent } from './views/doctor-schedule/doctor-schedule.component';
import { AdminSettingsComponent } from './views/admin-settings/admin-settings.component';
import { ReserveComponent } from './views/reserve/reserve.component';
import { PatientReserveHistoryComponent } from './views/patient-reserve-history/patient-reserve-history.component';
import { DoctorReserveHistoryComponent } from './views/doctor-reserve-history/doctor-reserve-history.component';
import { PatientInformationComponent } from './views/patient-information/patient-information.component';
import { ChatComponent } from './views/chat/chat.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NotificationsComponent } from './views/notifications/notifications.component';
import { AdminDashboardComponent } from './views/dashboard/admin-dashboard/admin-dashboard.component';
import { PatientDashboardComponent } from './views/dashboard/patient-dashboard/patient-dashboard.component';
import { DoctorDashboardComponent } from './views/dashboard/doctor-dashboard/doctor-dashboard.component';
import { DoctorInformationComponent } from './views/doctor-information/doctor-information.component';
import { DoctorComponent } from './views/doctor/doctor.component';
import { TransactionsComponent } from './views/transactions/transactions.component';
import { IncCreditComponent } from './views/inc-credit/inc-credit.component';
import { SettlementRequestComponent } from './views/settlement-request/settlement-request.component';

import { JalaliPipe } from './utils/jalali.pipe';
import { AdminSettlementComponent } from './views/admin-settlement/admin-settlement.component';
import { CallComponent } from './views/call/call.component';
import { VisitstatusComponent } from './views/visitstatus/visitstatus.component';
import { PrescriptionComponent } from './views/prescription/prescription.component';
import { QRCodeModule } from 'angularx-qrcode';

import { LabDashboardComponent } from './views/dashboard/lab-dashboard/lab-dashboard.component';
import { PharmDashboardComponent } from './views/dashboard/pharm-dashboard/pharm-dashboard.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { LabPreviewComponent } from './views/lab-preview/lab-preview.component';
import { PharmPreviewComponent } from './views/pharm-preview/pharm-preview.component';
import { ForgetpasswordComponent } from './pages/forgetpassword/forgetpassword.component';
import { PatientPrescriptionsHistoryComponent } from './views/patient-prescriptions-history/patient-prescriptions-history.component';
import { PatientDiagnosisHistoryComponent } from './views/patient-diagnosis-history/patient-diagnosis-history.component';
import { PatientMedicinesHistoryComponent } from './views/patient-medicines-history/patient-medicines-history.component';
import { AdminBankComponent } from './views/admin-bank/admin-bank.component';
import { DoctorcardComponent } from './views/doctorcard/doctorcard.component';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { LogsComponent } from './views/logs/logs.component';
registerLocaleData(localeEn, 'en-EN');

@NgModule({
  declarations: [
    JalaliPipe,
    AppComponent,
    MainComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    MenuSidebarComponent,
    BlankComponent,
    ProfileComponent,
    RegisterComponent,
    DashboardComponent,
    NotificationsDropdownMenuComponent,
    AppButtonComponent,
    UserDropdownMenuComponent,
    PatientsComponent,
    DoctorsComponent,
    LaboratoriesComponent,
    PharmaciesComponent,
    DoctorsCategoryComponent,
    DoctorScheduleComponent,
    AdminSettingsComponent,
    ReserveComponent,
    PatientReserveHistoryComponent,
    DoctorReserveHistoryComponent,
    PatientInformationComponent,
    ChatComponent,
    NotificationsComponent,
    AdminDashboardComponent,
    PatientDashboardComponent,
    DoctorDashboardComponent,
    DoctorInformationComponent,
    DoctorComponent,
    TransactionsComponent,
    IncCreditComponent,
    SettlementRequestComponent,
    AdminSettlementComponent,
    CallComponent,
    VisitstatusComponent,
    PrescriptionComponent,
    LabDashboardComponent,
    PharmDashboardComponent,
    LabPreviewComponent,
    PharmPreviewComponent,
    ForgetpasswordComponent,
    PatientPrescriptionsHistoryComponent,
    PatientDiagnosisHistoryComponent,
    PatientMedicinesHistoryComponent,
    AdminBankComponent,
    DoctorcardComponent,
    LogsComponent,
  ],
  imports: [
    BrowserModule,
    InfiniteScrollModule,
    HttpClientModule,
    FormsModule,
    LeafletModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DpDatePickerModule,
    ImageCropperModule,
    QRCodeModule,
    ZXingScannerModule,
    PasswordStrengthMeterModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-left',
      preventDuplicates: true,
    }),
    NgbModule,
  ],
  providers: [
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    ConfigService,
    ConfigModule.init(),
    Util,
    AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);

