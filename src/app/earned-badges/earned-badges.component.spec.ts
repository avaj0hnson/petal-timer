import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarnedBadgesComponent } from './earned-badges.component';

describe('EarnedBadgesComponent', () => {
  let component: EarnedBadgesComponent;
  let fixture: ComponentFixture<EarnedBadgesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EarnedBadgesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EarnedBadgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
