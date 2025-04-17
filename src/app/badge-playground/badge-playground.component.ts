import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge-playground',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge-playground.component.html',
  styleUrl: './badge-playground.component.scss'
})
export class BadgePlaygroundComponent {
  @Input() activeBadges: { emoji: string; x: number }[] = [];
}
