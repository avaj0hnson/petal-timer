import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgePlaygroundComponent } from './badge-playground.component';

describe('BadgePlaygroundComponent', () => {
  let component: BadgePlaygroundComponent;
  let fixture: ComponentFixture<BadgePlaygroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgePlaygroundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BadgePlaygroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept activeBadges input', () => {
    component.activeBadges = [{ emoji: '🌸', x: 100 }];
    fixture.detectChanges();
  
    expect(component.activeBadges.length).toBe(1);
    expect(component.activeBadges[0].emoji).toBe('🌸');
  });
});
