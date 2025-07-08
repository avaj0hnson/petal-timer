import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BadgeService {
  private badgeUnlockIndex = 0;

  private currentBadgeSet: { emoji: string; name: string }[] = [];

  activeBadges: { emoji: string; x: number; name: string }[] = [];

  setBadgeSet(badges: { emoji: string; name: string }[]) {
    this.currentBadgeSet = badges;
    this.badgeUnlockIndex = 0;
    this.activeBadges = [];
  }

  unlockNextBadge() {
    if (this.badgeUnlockIndex < this.currentBadgeSet.length) {
      const badge = this.currentBadgeSet[this.badgeUnlockIndex];
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

  getCurrentBadgeSet() {
    return [...this.currentBadgeSet];
  }
}
