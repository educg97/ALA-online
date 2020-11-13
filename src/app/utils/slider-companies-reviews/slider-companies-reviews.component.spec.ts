import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderCompaniesReviewsComponent } from './slider-companies-reviews.component';

describe('SliderCompaniesReviewsComponent', () => {
  let component: SliderCompaniesReviewsComponent;
  let fixture: ComponentFixture<SliderCompaniesReviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SliderCompaniesReviewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderCompaniesReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
