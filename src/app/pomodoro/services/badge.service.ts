import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BadgeService {
  private badgeUnlockIndex = 0;

  readonly allBadges = [
    { emoji: '🌸' }, { emoji: '🧁' }, { emoji: '🎀' }, { emoji: '🌟' },
    { emoji: '🐣' }, { emoji: '🧸' }, { emoji: '🥚' }, { emoji: '🎈' },
    { emoji: '🍓' }, { emoji: '☁️' }
  ];

  activeBadges: { emoji: string, x: number }[] = [];

  unlockNextBadge() {
    if (this.badgeUnlockIndex < this.allBadges.length) {
      const badge = this.allBadges[this.badgeUnlockIndex];
      const slotSpacing = 10;
      const leftPosition = 5 + this.badgeUnlockIndex * slotSpacing;
  
      this.activeBadges.push({
        emoji: badge.emoji,
        x: leftPosition
      });
  
      this.badgeUnlockIndex++;
    }
  }
}
