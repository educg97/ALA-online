import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamInscriptionComponent } from './exam-inscription.component';

describe('ExamInscriptionComponent', () => {
  let component: ExamInscriptionComponent;
  let fixture: ComponentFixture<ExamInscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamInscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamInscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
