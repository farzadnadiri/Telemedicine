import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmPreviewComponent } from './pharm-preview.component';

describe('PharmPreviewComponent', () => {
  let component: PharmPreviewComponent;
  let fixture: ComponentFixture<PharmPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PharmPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
