import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BadgeService {
  private badgeUnlockIndex = 0;

  readonly allBadges = [
    { emoji: '🌸', name: 'Cherry Blossom' },
    { emoji: '🧁', name: 'Cupcake' },
    { emoji: '🎀', name: 'Ribbon' },
    { emoji: '🌟', name: 'Star' },
    { emoji: '🐣', name: 'Hatchling Chick' },
    { emoji: '🧸', name: 'Teddy Bear' },
    { emoji: '🥚', name: 'Mystery Egg' },
    { emoji: '🎈', name: 'Balloon' },
    { emoji: '🍓', name: 'Strawberry' },
    { emoji: '☁️', name: 'Cloud' }
  ];

  activeBadges: { emoji: string, x: number, name: string }[] = [];

  unlockNextBadge() {
    if (this.badgeUnlockIndex < this.allBadges.length) {
      const badge = this.allBadges[this.badgeUnlockIndex];
      const slotSpacing = 10;
      const leftPosition = 5 + this.badgeUnlockIndex * slotSpacing;
  
      this.activeBadges.push({
        emoji: badge.emoji,
        x: leftPosition,
        name: badge.name
      });
  
      this.badgeUnlockIndex++;
    }
  }
}
