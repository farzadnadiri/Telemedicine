import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDiagnosisHistoryComponent } from './patient-diagnosis-history.component';

describe('PatientDiagnosisHistoryComponent', () => {
  let component: PatientDiagnosisHistoryComponent;
  let fixture: ComponentFixture<PatientDiagnosisHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientDiagnosisHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDiagnosisHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
