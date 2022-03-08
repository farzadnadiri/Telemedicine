import { Component, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from 'src/app/services/config.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { IPageData } from '../../../interfaces/IPageAble';
import { Observable, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  tap,
  switchMap,
} from 'rxjs/operators';
import { DoctorsCategoryService } from 'src/app/services/doctors-category.service';
import { Util } from 'src/app/utils/util';

@Component({
  selector: 'app-table-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.scss'],
})
export class DoctorsComponent implements OnInit {
  public doctorForm: FormGroup;
  public selectedItem;
  public isLoading = false;
  public isEdit = false;
  closeResult = '';
  filterWord = '';
  minLenght: number = +this.config.get('MinLenght');
  maxLenght: number = +this.config.get('MaxLenght');

  model: any;
  dateObject: any;
  searching = false;
  searchFailed = false;

  page = 1;
  collectionSize = 0;
  items: any[];
  pageSize = this.service.pageSize;

  datePickerConfig = {
    drops: 'down',
    dir: 'rtl',
  };

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private service: DoctorService,
    private config: ConfigService,
    private fb: FormBuilder,
    private categoryService: DoctorsCategoryService,
    private util: Util
  ) {}

  ngOnInit(): void {
    this.initialForm();
    this.load();
  }

  initialForm() {
    this.doctorForm = this.fb.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(this.minLenght),
            Validators.maxLength(this.maxLenght),
          ],
        ],
        visitFee: ['', [Validators.required]],
        username: [
          '',
          [
            Validators.required, 
            Validators.pattern('^[0-9]{11}$')
          ],
        ],
        category: ['', Validators.required],
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

        password: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(this.maxLenght),
          ],
        ],
        confirmPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(this.minLenght),
            Validators.maxLength(this.maxLenght),
          ],
        ],
      },
      { validator: this.util.matchingPasswords('password', 'confirmPassword') }
    );
  }

  get name() {
    return this.doctorForm.get('name');
  }
  get username() {
    return this.doctorForm.get('username');
  }
  get dateOfBirth() {
    return this.doctorForm.get('dateOfBirth');
  }
  get password() {
    return this.doctorForm.get('password');
  }
  get confirmPassword() {
    return this.doctorForm.get('confirmPassword');
  }
  get category() {
    return this.doctorForm.get('category');
  }
  get nationalId() {
    return this.doctorForm.get('nationalId');
  }
  get visitFee() {
    return this.doctorForm.get('visitFee');
  }

  open(content, item?) {
    this.selectedItem = item;
    this.isEdit = false;
    this.initialForm();
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

  delete(item) {
    this.isLoading = true;
    this.service.delete(item._id).subscribe(
      (response) => {
        this.isLoading = false;
        this.modalService.dismissAll();
        return this.ngOnInit();
      },

      (error) => {
        this.isLoading = false;
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      }
    );
  }

  load() {
    this.service
      .getPage(this.page, this.filterWord)
      .subscribe((result: IPageData) => {
        this.items = result.data;
        this.collectionSize = result.totalItems;
      });
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        this.categoryService.search(term).pipe(
          tap(() => (this.searchFailed = false)),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        )
      ),
      tap(() => (this.searching = false))
    );

  formatter = (x: { name: string }) => x.name;

  openEdit(content, item) {
    this.isEdit = true;
    this.selectedItem = item;
    this.selectedItem.password = '';
    this.selectedItem.confirmPassword = '';
    this.categoryService.get(this.selectedItem.category._id).subscribe(
      (response) => {
        this.doctorForm.patchValue({
          name: this.selectedItem.name,
          username: this.selectedItem.username,
          visitFee: this.selectedItem.visitFee,
          password: '',
          confirmPassword: '',
          gender: this.selectedItem.gender,
          category: response,
          dateOfBirth: this.selectedItem.dateOfBirth,
          nationalId: this.selectedItem.nationalId,
        });
      },

      (error) => {
        this.isLoading = false;
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      }
    );

    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  save() {
    if (this.doctorForm.valid) {
      this.isLoading = true;
      const formCopy = Object.assign({}, this.doctorForm.value); // copy form object
      delete formCopy.confirmPassword; // delete property
      this.service.create(formCopy).subscribe(
        (response) => {
          this.isLoading = false;
          this.modalService.dismissAll();
          return this.ngOnInit();
        },

        (error) => {
          this.isLoading = false;
          return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
        }
      );
    } else {
      this.doctorForm.markAllAsTouched();
      return (this.isLoading = false);
    }
  }

  edit() {
    if (this.doctorForm.valid) {
      this.isLoading = true;
      const formCopy = Object.assign({}, this.doctorForm.value); // copy form object
      delete formCopy.confirmPassword; // delete property
      this.service.update(this.selectedItem._id, formCopy).subscribe(
        (response) => {
          this.isLoading = false;
          this.modalService.dismissAll();
          return this.ngOnInit();
        },

        (error) => {
          this.isLoading = false;
          return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
        }
      );
    } else {
      this.doctorForm.markAllAsTouched();
      return (this.isLoading = false);
    }
  }

  onFilterChange(val) {
    this.filterWord = val;
    this.page = 1;
    this.load();
  }
}
