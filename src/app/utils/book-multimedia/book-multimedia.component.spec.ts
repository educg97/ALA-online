import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookMultimediaComponent } from './book-multimedia.component';

describe('BookMultimediaComponent', () => {
  let component: BookMultimediaComponent;
  let fixture: ComponentFixture<BookMultimediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookMultimediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookMultimediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
