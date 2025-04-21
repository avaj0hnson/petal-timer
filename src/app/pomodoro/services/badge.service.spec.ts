import { TestBed } from '@angular/core/testing';
import { BadgeService } from './badge.service';

describe('BadgeService', () => {
  let service: BadgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BadgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty activeBadges', () => {
    expect(service.activeBadges.length).toBe(0);
  });

  it('should unlock a badge when unlockNextBadge is called', () => {
    service.unlockNextBadge();
    expect(service.activeBadges.length).toBe(1);
    expect(service.activeBadges[0].emoji).toBe('🌸');
  });

  it('should correctly calculate x position when unlocking badges', () => {
    service.unlockNextBadge();
    service.unlockNextBadge();
    service.unlockNextBadge();

    expect(service.activeBadges[0].x).toBe(5);
    expect(service.activeBadges[1].x).toBe(15);
    expect(service.activeBadges[2].x).toBe(25);
  });

  it('should not add more badges after all are unlocked', () => {
    for (let i = 0; i < service.allBadges.length; i++) {
      service.unlockNextBadge();
    }

    service.unlockNextBadge();

    expect(service.activeBadges.length).toBe(service.allBadges.length);
  });
});
