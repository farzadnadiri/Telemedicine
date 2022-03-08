import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from 'src/app/services/config.service';
import { CreditService } from 'src/app/services/credit.service';
import { TransactionSettlementService } from 'src/app/services/transactionSettlement.service';

@Component({
  selector: 'app-inc-credit',
  templateUrl: './inc-credit.component.html',
  styleUrls: ['./inc-credit.component.scss'],
})
export class IncCreditComponent implements OnInit {
  constructor(
    private toastr: ToastrService,
    private service: TransactionSettlementService,
    public creditService: CreditService,
    private config: ConfigService
  ) {}

  public customForm: FormGroup;
  public isLoading = false;

  ngOnInit(): void {
    this.customForm = new FormGroup({
      amount: new FormControl(null, [Validators.required]),
    });
  }

  get amount() {
    return this.customForm.get('amount');
  }

  defaultValues(val) {
    this.isLoading = true;
    this.service.increaseCredit({ amount: val }).subscribe(
      async (response) => {
        this.isLoading = false;
        await this.creditService.loadCredit();
        this.toastr.success('افزایش اعتبار با موفقیت انجام شد', 'تایید');
        return this.ngOnInit();
      },
      (error) => {
        this.isLoading = false;
        return this.toastr.error('خطا در برقراری ارتباط با سرور', 'خطا');
      }
    );
  }

  save() {
    this.creditService.credit=0;
    if (this.customForm.valid) {
      this.isLoading = true;
      this.service.increaseCredit(this.customForm.value).subscribe(
         async () => {
          await this.creditService.loadCredit();
          this.isLoading = false;
          this.toastr.success('افزایش اعتبار با موفقیت انجام شد', 'تایید');
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
}
