import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBannerComponent } from './nav-banner.component';

describe('NavBannerComponent', () => {
  let component: NavBannerComponent;
  let fixture: ComponentFixture<NavBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
