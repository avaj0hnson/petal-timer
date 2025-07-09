import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Theme } from '../models/theme.model';
import { ThemeService } from '../services/theme.service';

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
  @Input() workDuration!: number;
  @Input() shortBreakDuration!: number;
  @Input() longBreakDuration!: number;
  @Output() workDurationChange = new EventEmitter<number>();
  @Output() shortBreakDurationChange = new EventEmitter<number>();
  @Output() longBreakDurationChange = new EventEmitter<number>();
  @Output() mutedChange = new EventEmitter<boolean>();
  @Output() startHourChange = new EventEmitter<number>();
  @Output() endHourChange = new EventEmitter<number>();
  @Output() close = new EventEmitter<void>();

  hours: number[] = Array.from({ length: 24 }, (_, i) => i);
  themes: Theme[] = [];
  selectedThemeName = '';
  currentTheme!: Theme;

  constructor(private themeService: ThemeService) {
    this.themes = this.themeService.getThemes();
    this.currentTheme = this.themeService.getCurrentTheme();
    this.selectedThemeName = this.currentTheme.name;

    this.themeService.currentTheme$.subscribe(theme => this.currentTheme = theme);
  }

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

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    this.close.emit();
  }

  onThemeChange(themeName: string) {
    this.selectedThemeName = themeName;
    this.themeService.switchTheme(themeName);
  }
}
