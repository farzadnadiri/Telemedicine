import { PatientService } from './../../../services/patient.service';
import { Component, OnInit } from '@angular/core';
import { IPageData } from '../../../interfaces/IPageAble';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-table-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss'],
})
export class PatientsComponent implements OnInit {
  filterWord = '';
  page = 1;
  collectionSize = 0;
  items: any[];
  public selectedItem;
  public isLoading = false;
  public isEdit = false;
  closeResult = '';

  pageSize = this.service.pageSize;
  constructor(private service: PatientService
    ,private modalService: NgbModal
    ) {}


  ngOnInit(): void {
    this.load();
  }

  load() {
    this.service
      .getPage(this.page, this.filterWord)
      .subscribe((result: IPageData) => {
        this.items = result.data;
        this.collectionSize = result.totalItems;
      });
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

  onFilterChange(val) {
    this.filterWord = val;
    this.page = 1;
    this.load();
  }
}
