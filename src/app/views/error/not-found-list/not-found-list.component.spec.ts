import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFoundListComponent } from './not-found-list.component';

describe('NotFoundListComponent', () => {
  let component: NotFoundListComponent;
  let fixture: ComponentFixture<NotFoundListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotFoundListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotFoundListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
