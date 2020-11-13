import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelTestResultsComponent } from './level-test-results.component';

describe('LevelTestResultsComponent', () => {
  let component: LevelTestResultsComponent;
  let fixture: ComponentFixture<LevelTestResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevelTestResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelTestResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
