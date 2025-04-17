import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DateTime } from 'luxon';
import { FormsModule } from '@angular/forms';
import { SettingsModalComponent } from "../settings-modal/settings-modal.component";

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, FormsModule, SettingsModalComponent],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
  startHour: number = 8;
  endHour: number = 17;
  hours: number[] = Array.from({ length: 24 }, (_, i) => i);
  currentProgress = 0;
  showSettings = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateProgress();
      setInterval(() => this.updateProgress(), 60000);
    }
  }

  updateProgress(): void {
    const now = DateTime.now().setZone(this.timezone);
  
    const startOfWorkday = now.set({ hour: this.startHour, minute: 0, second: 0 });
    const endOfWorkday = now.set({ hour: this.endHour, minute: 0, second: 0 });
  
    // Calculate total work minutes dynamically (NO lunch subtraction)
    const totalWorkMinutes = (this.endHour - this.startHour) * 60;
  
    if (now < startOfWorkday) {
      this.currentProgress = 0;
      return;
    }
  
    if (now > endOfWorkday) {
      this.currentProgress = 100;
      return;
    }
  
    // Work minutes passed since start
    const workMinutesElapsed = now.diff(startOfWorkday, 'minutes').minutes;
  
    this.currentProgress = Math.max(0, Math.min((workMinutesElapsed / totalWorkMinutes) * 100, 100));
  }  

  formatHour(hour: number): string {
    const displayHour = hour % 12 || 12;
    const period = hour >= 12 ? 'PM' : 'AM';
    return `${displayHour}:00 ${period}`;
  }  

  openSettings(): void {
    this.showSettings = true;
  }
  
  closeSettings(): void {
    this.showSettings = false;
  }
  
  onStartHourChange(newHour: number): void {
    this.startHour = newHour;
    this.updateProgress();
  }
  
  onEndHourChange(newHour: number): void {
    this.endHour = newHour;
    this.updateProgress();
  }
}
