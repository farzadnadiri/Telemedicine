import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientMedicinesHistoryComponent } from './patient-medicines-history.component';

describe('PatientMedicinesHistoryComponent', () => {
  let component: PatientMedicinesHistoryComponent;
  let fixture: ComponentFixture<PatientMedicinesHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientMedicinesHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientMedicinesHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
