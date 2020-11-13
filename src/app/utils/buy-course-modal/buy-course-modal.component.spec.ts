import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyCourseModalComponent } from './buy-course-modal.component';

describe('BuyCourseModalComponent', () => {
  let component: BuyCourseModalComponent;
  let fixture: ComponentFixture<BuyCourseModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyCourseModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyCourseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
