import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-modal.component.html',
  styleUrl: './settings-modal.component.scss'
})
export class SettingsModalComponent {
  @Input() startHour!: number;
  @Input() endHour!: number;
  @Input() muted!: boolean;
  @Output() mutedChange = new EventEmitter<boolean>();
  @Output() startHourChange = new EventEmitter<number>();
  @Output() endHourChange = new EventEmitter<number>();
  @Output() close = new EventEmitter<void>();

  hours: number[] = Array.from({ length: 24 }, (_, i) => i);

  formatHour(hour: number): string {
    const displayHour = hour % 12 || 12;
    const period = hour >= 12 ? 'PM' : 'AM';
    return `${displayHour}:00 ${period}`;
  }

  get validStartHours(): number[] {
    return this.hours.filter(hour => hour < this.endHour);
  }

  get validEndHours(): number[] {
    return this.hours.filter(hour => hour > this.startHour);
  }
}
