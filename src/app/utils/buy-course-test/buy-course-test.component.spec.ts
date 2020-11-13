import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyCourseTestComponent } from './buy-course-test.component';

describe('BuyCourseTestComponent', () => {
  let component: BuyCourseTestComponent;
  let fixture: ComponentFixture<BuyCourseTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyCourseTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyCourseTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
