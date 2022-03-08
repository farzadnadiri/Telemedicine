import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from 'src/app/services/config.service';
import { SettingsService } from 'src/app/services/settings.service';
import { Util } from 'src/app/utils/util';
@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss'],
})
export class AdminSettingsComponent implements OnInit {
  public settingsForm: FormGroup;
  public isLoading = false;
  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private service: SettingsService,
    private config: ConfigService,
    private util: Util
  ) {}

  ngOnInit(): void {
    this.settingsForm = new FormGroup({
      visitDuration: new FormControl(null, [Validators.required]),
      visitDays: new FormControl(null, [Validators.required]),
    });
    this.load();
  }
  get visitDuration() {
    return this.settingsForm.get('visitDuration');
  }
  get visitDays() {
    return this.settingsForm.get('visitDays');
  }

  load() {
    this.service.getAdminSettings().subscribe((result: any) => {
      this.settingsForm.setValue(result.value);
    });
  }

  save() {
    if (this.settingsForm.valid) {
      this.isLoading = true;
      this.service
        .postAdminSettings({ key: 'admin', value: this.settingsForm.value })
        .subscribe(
          (response) => {
            this.isLoading = false;
            return this.toastr.success(
              'اطلاعات با موفقیت ذخیره گردید',
              'تایید'
            );
          },

          (error) => {
            this.isLoading = false;
            return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
          }
        );
    } else {
      return (this.isLoading = false);
    }
  }
}
