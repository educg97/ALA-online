import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderCompaniesComponent } from './slider-companies.component';

describe('SliderCompaniesComponent', () => {
  let component: SliderCompaniesComponent;
  let fixture: ComponentFixture<SliderCompaniesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SliderCompaniesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
