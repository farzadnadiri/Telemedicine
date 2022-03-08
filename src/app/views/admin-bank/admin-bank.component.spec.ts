import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBankComponent } from './admin-bank.component';

describe('AdminBankComponent', () => {
  let component: AdminBankComponent;
  let fixture: ComponentFixture<AdminBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
