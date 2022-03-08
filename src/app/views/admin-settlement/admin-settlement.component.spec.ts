import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSettlementComponent } from './admin-settlement.component';

describe('AdminSettlementComponent', () => {
  let component: AdminSettlementComponent;
  let fixture: ComponentFixture<AdminSettlementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminSettlementComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
