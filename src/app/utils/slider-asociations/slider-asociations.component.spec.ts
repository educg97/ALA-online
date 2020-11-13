import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderAsociationsComponent } from './slider-asociations.component';

describe('SliderAsociationsComponent', () => {
  let component: SliderAsociationsComponent;
  let fixture: ComponentFixture<SliderAsociationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SliderAsociationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderAsociationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
