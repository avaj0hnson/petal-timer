import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge-playground',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge-playground.component.html',
  styleUrl: './badge-playground.component.scss'
})
export class BadgePlaygroundComponent {
  @Input() activeBadges: { emoji: string; x: number; name: string }[] = [];
  @Input() totalBadges = 14;
  @Input() textClass = '';
  @Input() modalBackgroundClass = '';
  @Output() restart = new EventEmitter<void>();

  restartBadges() {
    this.restart.emit();
  }

  get allBadgesUnlocked(): boolean {
    return this.activeBadges.length >= this.totalBadges;
  }

  get placeholderSlots(): number[] {
    const remaining = this.totalBadges - this.activeBadges.length;
    return remaining > 0 ? Array.from({ length: remaining }, (_, i) => i) : [];
  }
}
