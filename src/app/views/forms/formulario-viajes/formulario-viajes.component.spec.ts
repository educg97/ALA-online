import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioViajesComponent } from './formulario-viajes.component';

describe('FormularioViajesComponent', () => {
  let component: FormularioViajesComponent;
  let fixture: ComponentFixture<FormularioViajesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioViajesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioViajesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
