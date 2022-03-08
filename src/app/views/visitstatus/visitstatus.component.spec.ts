import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitstatusComponent } from './visitstatus.component';

describe('VisitstatusComponent', () => {
  let component: VisitstatusComponent;
  let fixture: ComponentFixture<VisitstatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitstatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
