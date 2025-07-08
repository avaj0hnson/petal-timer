import { TestBed } from '@angular/core/testing';
import { BadgeService } from './badge.service';

describe('BadgeService', () => {
  let service: BadgeService;

  const mockBadges = [
    { emoji: '🌸', name: 'Cherry Blossom' },
    { emoji: '🧁', name: 'Cupcake' },
    { emoji: '🎀', name: 'Ribbon' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BadgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty activeBadges', () => {
    service.setBadgeSet(mockBadges);
    expect(service.activeBadges.length).toBe(0);
  });

  it('should unlock a badge when unlockNextBadge is called', () => {
    service.setBadgeSet(mockBadges);
    service.unlockNextBadge();
    expect(service.activeBadges.length).toBe(1);
    expect(service.activeBadges[0].emoji).toBe('🌸');
  });

  it('should correctly calculate x position when unlocking badges', () => {
    service.setBadgeSet(mockBadges);
    service.unlockNextBadge();
    service.unlockNextBadge();
    service.unlockNextBadge();

    expect(service.activeBadges[0].x).toBe(5);
    expect(service.activeBadges[1].x).toBe(15);
    expect(service.activeBadges[2].x).toBe(25);
  });

  it('should not add more badges after all are unlocked', () => {
    service.setBadgeSet(mockBadges);
    for (let i = 0; i < mockBadges.length; i++) {
      service.unlockNextBadge();
    }
    service.unlockNextBadge();

    expect(service.activeBadges.length).toBe(mockBadges.length);
  });
});
