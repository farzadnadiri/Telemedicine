import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorcardComponent } from './doctorcard.component';

describe('DoctorcardComponent', () => {
  let component: DoctorcardComponent;
  let fixture: ComponentFixture<DoctorcardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorcardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
