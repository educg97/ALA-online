import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StarPromotionComponent } from './star-promotion.component';

describe('StarPromotionComponent', () => {
  let component: StarPromotionComponent;
  let fixture: ComponentFixture<StarPromotionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarPromotionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
