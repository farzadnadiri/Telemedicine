import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncCreditComponent } from './inc-credit.component';

describe('IncCreditComponent', () => {
  let component: IncCreditComponent;
  let fixture: ComponentFixture<IncCreditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IncCreditComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
