import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestRulesComponent } from './contest-rules.component';

describe('ContestRulesComponent', () => {
  let component: ContestRulesComponent;
  let fixture: ComponentFixture<ContestRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContestRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
