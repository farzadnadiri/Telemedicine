import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorReserveHistoryComponent } from './doctor-reserve-history.component';

describe('DoctorReserveHistoryComponent', () => {
  let component: DoctorReserveHistoryComponent;
  let fixture: ComponentFixture<DoctorReserveHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorReserveHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorReserveHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
