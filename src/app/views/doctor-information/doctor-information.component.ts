import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { UploadService } from 'src/app/services/upload.service';
import { Util } from 'src/app/utils/util';

@Component({
  selector: 'app-doctor-information',
  templateUrl: './doctor-information.component.html',
  styleUrls: ['./doctor-information.component.scss'],
})
export class DoctorInformationComponent implements OnInit {
  minLenght: number = this.config.get('MinLenght');
  maxLenght: number = this.config.get('MaxLenght');
  datePickerConfig = {
    drops: 'down',
    dir: 'rtl',
  };

  public generalForm: FormGroup;
  constructor(
    private config: ConfigService,
    private toastr: ToastrService,
    private service: DoctorService,
    private fb: FormBuilder,
    private uploadService: UploadService,
    public util: Util,
    public authService: AuthService
  ) {}

  imageChangedEvent: any = '';
  croppedImage: any = '';

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  ngOnInit(): void {
    this.initialForm();
    this.service.loadInfo().subscribe((result: any) => {
      this.generalForm.patchValue(result);
    });
  }

  get name() {
    return this.generalForm.get('name');
  }
  get dateOfBirth() {
    return this.generalForm.get('dateOfBirth');
  }
  get nationalId() {
    return this.generalForm.get('nationalId');
  }
  get shebaNo() {
    return this.generalForm.get('shebaNo');
  }
  get desc() {
    return this.generalForm.get('desc');
  }


  initialForm() {
    this.generalForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(this.minLenght),
          Validators.maxLength(this.maxLenght),
        ],
      ],
      gender: ['male', [Validators.required]],
      dateOfBirth: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{4}-[0-9]{2}-[0-9]{2}$'),
        ],
      ],
      nationalId: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ],
      shebaNo: ['', [Validators.required, Validators.pattern('^[0-9]{24}$')]],
      desc: [''],
    });
  }
  save() {
    if (this.generalForm.valid) {
      this.service.updateInfo(this.generalForm.value).subscribe(
        () => {
          this.authService.currentUser.name = this.generalForm.value.name;
          return this.toastr.success('ثبت اطلاعات با موفقیت انجام شد', 'تایید');
        },
        () => {
          return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
        }
      );
    } else {
      this.generalForm.markAllAsTouched();
      return;
    }
  }

  uploadProfileImage() {
    if (!this.croppedImage) {
      return;
    }

    const base64 = this.croppedImage;
    fetch(base64)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], 'filename.jpg', { type: 'image/jpeg' });
        this.uploadService.uploadAvatar(file).subscribe(
          (response: any) => {
            this.authService.currentUser.image = response.name;

            return this.toastr.success(
              'تصویر پروفایل با موفقیت ذخیره گردید',
              'تایید'
            );
          },
          (error) => {
            return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
          }
        );
      });
  }
}
