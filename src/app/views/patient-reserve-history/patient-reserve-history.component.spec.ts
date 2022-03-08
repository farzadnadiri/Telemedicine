import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientReserveHistoryComponent } from './patient-reserve-history.component';

describe('PatientReserveHistoryComponent', () => {
  let component: PatientReserveHistoryComponent;
  let fixture: ComponentFixture<PatientReserveHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientReserveHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientReserveHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
