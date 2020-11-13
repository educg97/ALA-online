import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTutoriaComponent } from './form-tutoria.component';

describe('FormTutoriaComponent', () => {
  let component: FormTutoriaComponent;
  let fixture: ComponentFixture<FormTutoriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormTutoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTutoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
