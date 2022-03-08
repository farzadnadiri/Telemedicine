import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementRequestComponent } from './settlement-request.component';

describe('SettlementRequestComponent', () => {
  let component: SettlementRequestComponent;
  let fixture: ComponentFixture<SettlementRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettlementRequestComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
