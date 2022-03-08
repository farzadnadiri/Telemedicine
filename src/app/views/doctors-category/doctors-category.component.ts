import { Component, OnInit } from '@angular/core';
import { IPageData } from 'src/app/interfaces/IPageAble';
import { DoctorsCategoryService } from 'src/app/services/doctors-category.service';
import { ConfigService } from '../../services/config.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-doctors-category',
  templateUrl: './doctors-category.component.html',
  styleUrls: ['./doctors-category.component.scss'],
})
export class DoctorsCategoryComponent implements OnInit {
  public doctorCategoryForm: FormGroup;
  public selectedItem;
  public isLoading = false;
  closeResult = '';
  minLenght: number = +this.config.get('MinLenght');
  maxLenght: number = +this.config.get('MaxLenght');
  filterWord = '';
  page = 1;
  pageSize = this.service.pageSize;
  collectionSize = 0;
  items: any[];

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private service: DoctorsCategoryService,
    private config: ConfigService
  ) {}

  ngOnInit(): void {
    this.doctorCategoryForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(this.minLenght),
        Validators.maxLength(this.maxLenght),
      ]),
    });
    this.load();
  }

  get name() {
    return this.doctorCategoryForm.get('name');
  }

  load() {
    this.service.getPage(this.page, this.filterWord).subscribe((result: IPageData) => {
      this.items = result.data;
      this.collectionSize = result.totalItems;
    });
  }

  save() {
    if (this.doctorCategoryForm.valid) {
      this.isLoading = true;
      this.service.create(this.doctorCategoryForm.value).subscribe(
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
      return (this.isLoading = false);
    }
  }

  edit() {
    if (this.doctorCategoryForm.valid) {
      this.isLoading = true;

      this.selectedItem.name = this.name.value;

      this.service
        .update(this.selectedItem._id, this.doctorCategoryForm.value)
        .subscribe(
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
      return (this.isLoading = false);
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

  openEdit(content, item) {
    this.selectedItem = item;
    this.doctorCategoryForm.setValue({ name: this.selectedItem.name });
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

  open(content, item?) {
    this.selectedItem = item;
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
    this.doctorCategoryForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(this.minLenght),
        Validators.maxLength(this.maxLenght),
      ]),
    });

    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  onFilterChange(val) {
    this.filterWord = val;
    this.page = 1;
    this.load();
  }
}
