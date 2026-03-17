import { Component, Inject, Input, OnChanges, OnDestroy, OnInit, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DateTime } from 'luxon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, OnChanges, OnDestroy {
  @Input() startHour = 8;
  @Input() endHour = 17;
  @Input() textClass = '';
  @Input() progressColorClass = '';
  @Input() backgroundClass = '';
  @Input() modalBackgroundClass = '';

  timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
  hours: number[] = Array.from({ length: 24 }, (_, i) => i);
  currentProgress = 0;
  private intervalId?: ReturnType<typeof setInterval>;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateProgress();
      this.intervalId = setInterval(() => this.updateProgress(), 60000);
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['startHour'] || changes['endHour']) {
      this.updateProgress();
    }
  }
  
  updateProgress(): void {
    const now = DateTime.now().setZone(this.timezone);
  
    const startOfWorkday = now.set({ hour: this.startHour, minute: 0, second: 0 });
    const endOfWorkday = now.set({ hour: this.endHour, minute: 0, second: 0 });
  
    const totalWorkMinutes = (this.endHour - this.startHour) * 60;
  
    if (now < startOfWorkday) {
      this.currentProgress = 0;
      return;
    }
  
    if (now > endOfWorkday) {
      this.currentProgress = 100;
      return;
    }
  
    const workMinutesElapsed = now.diff(startOfWorkday, 'minutes').minutes;
  
    this.currentProgress = Math.max(0, Math.min((workMinutesElapsed / totalWorkMinutes) * 100, 100));
  }  

  formatHour(hour: number): string {
    const displayHour = hour % 12 || 12;
    const period = hour >= 12 ? 'PM' : 'AM';
    return `${displayHour}:00 ${period}`;
  }
}
