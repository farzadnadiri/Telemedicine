import { AuthService } from 'src/app/services/auth.service';
import { Util } from 'src/app/utils/util';
import { UploadService } from 'src/app/services/upload.service';
import { PatientService } from './../../services/patient.service';
import { ConfigService } from './../../services/config.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-patient-information',
  templateUrl: './patient-information.component.html',
  styleUrls: ['./patient-information.component.scss'],
})
export class PatientInformationComponent implements OnInit {
  minLenght: number = this.config.get('MinLenght');
  maxLenght: number = this.config.get('MaxLenght');
  datePickerConfig = {
    drops: 'down',
    dir: 'rtl',
  };
  loading: boolean;
  selectedItems: any[];
  public generalForm: FormGroup;
  public doctors;
  constructor(
    private config: ConfigService,
    private toastr: ToastrService,
    private service: PatientService,
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
      if (result.weight) {
        this.generalForm.setValue(result);
      }
    });


    this.service.validDoctors().subscribe(
      (response) => {
        this.doctors = response;
      },
      (error) => {
        if (error.status === 404) {
          return this.toastr.error('شناسه نسخه ارائه شده یافت نشد', 'خطا');
        }
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      }
    );


  }
  get name() {
    return this.generalForm.get('name');
  }
  get job() {
    return this.generalForm.get('job');
  }
  get city() {
    return this.generalForm.get('city');
  }
  get weight() {
    return this.generalForm.get('weight');
  }
  get height() {
    return this.generalForm.get('height');
  }
  get temp() {
    return this.generalForm.get('temp');
  }
  get dateOfBirth() {
    return this.generalForm.get('dateOfBirth');
  }
  get nationalId() {
    return this.generalForm.get('nationalId');
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
      city: ['', [Validators.required, Validators.maxLength(this.maxLenght)]],
      job: [
        '',
        [
          Validators.required,
          Validators.minLength(this.minLenght),
          Validators.maxLength(this.maxLenght),
        ],
      ],
      weight: ['', [Validators.required]],
      height: ['', [Validators.required]],
      temp: ['', [Validators.required]],
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

  saveDoctors(){
    if (this.loading) {
      return;
    }
    this.selectedItems = [];
    if (!this.doctors && this.doctors.length < 1) {
      return;
    }
    this.doctors.forEach((element) => {
      if (element.exist) {
        this.selectedItems.push(element);
      }
    });
    this.loading = true;
    this.service.updatevalidDoctor(this.selectedItems).subscribe(
      (response) => {
        this.loading = false;
        return this.toastr.success('ثبت اطلاعات با موفقیت انجام شد', 'تایید');
      },
      (error) => {
        this.loading = false;
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      }
    );
  }

}
