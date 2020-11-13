import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderOpinionsComponent } from './slider-opinions.component';

describe('SliderOpinionsComponent', () => {
  let component: SliderOpinionsComponent;
  let fixture: ComponentFixture<SliderOpinionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SliderOpinionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderOpinionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
