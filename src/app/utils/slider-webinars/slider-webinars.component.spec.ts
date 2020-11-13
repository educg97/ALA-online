import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderWebinarsComponent } from './slider-webinars.component';

describe('SliderWebinarsComponent', () => {
  let component: SliderWebinarsComponent;
  let fixture: ComponentFixture<SliderWebinarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SliderWebinarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderWebinarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
