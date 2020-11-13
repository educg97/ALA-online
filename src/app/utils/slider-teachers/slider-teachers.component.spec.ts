import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderTeachersComponent } from './slider-teachers.component';

describe('SliderTeachersComponent', () => {
  let component: SliderTeachersComponent;
  let fixture: ComponentFixture<SliderTeachersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SliderTeachersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderTeachersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
