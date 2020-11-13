import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountDrawComponent } from './count-draw.component';

describe('CountDrawComponent', () => {
  let component: CountDrawComponent;
  let fixture: ComponentFixture<CountDrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountDrawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
