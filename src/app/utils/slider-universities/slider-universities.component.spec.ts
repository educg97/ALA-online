import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderUniversitiesComponent } from './slider-universities.component';

describe('SliderUniversitiesComponent', () => {
  let component: SliderUniversitiesComponent;
  let fixture: ComponentFixture<SliderUniversitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SliderUniversitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderUniversitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
