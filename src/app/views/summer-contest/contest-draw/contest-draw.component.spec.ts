import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestDrawComponent } from './contest-draw.component';

describe('ContestDrawComponent', () => {
  let component: ContestDrawComponent;
  let fixture: ComponentFixture<ContestDrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContestDrawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
