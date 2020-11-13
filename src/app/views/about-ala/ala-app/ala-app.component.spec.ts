import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlaAppComponent } from './ala-app.component';

describe('AlaAppComponent', () => {
  let component: AlaAppComponent;
  let fixture: ComponentFixture<AlaAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlaAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlaAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
