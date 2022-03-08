import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientPrescriptionsHistoryComponent } from './patient-prescriptions-history.component';

describe('PatientPrescriptionsHistoryComponent', () => {
  let component: PatientPrescriptionsHistoryComponent;
  let fixture: ComponentFixture<PatientPrescriptionsHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientPrescriptionsHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientPrescriptionsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
