import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameLetterComponent } from './game-letter.component';

describe('GameLetterComponent', () => {
  let component: GameLetterComponent;
  let fixture: ComponentFixture<GameLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
