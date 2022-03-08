import { Component, OnInit } from '@angular/core';
import { LaboratoryService } from 'src/app/services/laboratory.service';
import { IPageData } from '../../../interfaces/IPageAble';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from 'src/app/services/config.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Util } from 'src/app/utils/util';
@Component({
  selector: 'app-table-laboratories',
  templateUrl: './laboratories.component.html',
  styleUrls: ['./laboratories.component.scss'],
})
export class LaboratoriesComponent implements OnInit {
  public form: FormGroup;
  page = 1;
  collectionSize = 0;
  items: any[];
  pageSize = this.service.pageSize;
  filterWord = '';
  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private service: LaboratoryService,
    private config: ConfigService,
    private fb: FormBuilder,
    private util: Util
  ) {}

  public selectedItem;
  public isLoading = false;
  public isEdit = false;
  closeResult = '';
  minLenght: number = +this.config.get('MinLenght');
  maxLenght: number = +this.config.get('MaxLenght');

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(this.minLenght),
            Validators.maxLength(this.maxLenght),
          ],
        ],
        username: [
          '',
          [
            Validators.required, 
            Validators.pattern('^[0-9]{11}$')
          ],
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
            Validators.minLength(5),
            Validators.maxLength(this.maxLenght),
          ],
        ],
        address: [
          '',
          [
            Validators.required,
            Validators.minLength(this.minLenght),
            Validators.maxLength(500),
          ],
        ],
        city: [
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

    this.load();
  }

  get name() {
    return this.form.get('name');
  }
  get username() {
    return this.form.get('username');
  }
  get password() {
    return this.form.get('password');
  }
  get confirmPassword() {
    return this.form.get('confirmPassword');
  }
  get address() {
    return this.form.get('address');
  }
  get city() {
    return this.form.get('city');
  }

  open(content, item?) {
    this.selectedItem = item;
    this.isEdit = false;
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

  openEdit(content, item) {
    this.isEdit = true;
    this.selectedItem = item;
    this.selectedItem.password = '';
    this.selectedItem.confirmPassword = '';
    this.form.setValue({
      name: this.selectedItem.name,
      username: this.selectedItem.username,
      password: '',
      confirmPassword: '',
      city: this.selectedItem.city,
      address: this.selectedItem.address,
    });

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
    this.service.getPage(this.page, this.filterWord).subscribe((result: IPageData) => {
      this.items = result.data;
      this.collectionSize = result.totalItems;
    });
  }

  save() {
    if (this.form.valid) {
      this.isLoading = true;
      const formCopy = Object.assign({}, this.form.value); // copy form object
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
      this.form.markAllAsTouched();
      return (this.isLoading = false);
    }
  }

  edit() {
    if (this.form.valid) {
      this.isLoading = true;
      const formCopy = Object.assign({}, this.form.value); // copy form object
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
      this.form.markAllAsTouched();
      return (this.isLoading = false);
    }
  }

  onFilterChange(val) {
    this.filterWord = val;
    this.page = 1;
    this.load();
  }

}
