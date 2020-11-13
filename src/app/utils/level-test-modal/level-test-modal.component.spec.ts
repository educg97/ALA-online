import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelTestModalComponent } from './level-test-modal.component';

describe('LevelTestModalComponent', () => {
  let component: LevelTestModalComponent;
  let fixture: ComponentFixture<LevelTestModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevelTestModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelTestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
