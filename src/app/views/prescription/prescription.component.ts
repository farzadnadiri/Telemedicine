import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { PrescriptionService } from 'src/app/services/prescription.service';
import { Util } from 'src/app/utils/util';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.scss']
})
export class PrescriptionComponent implements OnInit {
  id: string;
  prescription: any;
  constructor(
    private service: PrescriptionService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    public util: Util,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params.id;
    });

    this.service.loadSimplePrescription(this.id).subscribe(
      (response) => {
        this.prescription = response;
      },
      (error) => {
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      }
    );


  }

}
