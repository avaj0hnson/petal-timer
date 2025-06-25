import { CommonModule } from '@angular/common';
import { Component, ModuleWithProviders, OnDestroy, OnInit } from '@angular/core';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { TimelineComponent } from "../timeline/timeline.component";
import { BadgePlaygroundComponent } from "../badge-playground/badge-playground.component";
import { PomodoroTimerService } from './services/pomodoro-timer.service';
import { SoundService } from './services/sound.service';
import { BadgeService } from './services/badge.service';
import { ConfettiService } from './services/confetti.service';
import { Observable } from 'rxjs';
import { SettingsModalComponent } from "../settings-modal/settings-modal.component";
import { SettingsService } from './services/settings.service';

@Component({
  selector: 'app-pomodoro',
  standalone: true,
  imports: [CommonModule, NgCircleProgressModule, TimelineComponent, BadgePlaygroundComponent, SettingsModalComponent],
  providers: [
    (NgCircleProgressModule.forRoot({
      radius: 100,
      outerStrokeWidth: 12,
      outerStrokeColor: '#f8b4d9',
      innerStrokeWidth: 8,
      innerStrokeColor: '#ffeaf4',
      animationDuration: 300,
      animation: true,
      showTitle: false,
      showUnits: false,
      showBackground: false,
      clockwise: false,
    }) as ModuleWithProviders<NgCircleProgressModule>).providers!,
  ],
  templateUrl: './pomodoro.component.html',
  styleUrl: './pomodoro.component.scss'
})
export class PomodoroComponent implements OnInit, OnDestroy{
  isRunning = false;
  sessionType: 'work' | 'break' = 'work';
  completedSessions = 0;
  longBreakInterval = 4;
  timeLeft$!: Observable<number>;
  activeBadges!: { emoji: string; x: number, name: string }[];

  readonly sessionDurations = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  constructor(private timerService: PomodoroTimerService,
              private soundService: SoundService,
              private badgeService: BadgeService,
              private confettiService: ConfettiService,
              public settingsService: SettingsService
  ) {}
  
  ngOnInit(): void {
    this.timeLeft$ = this.timerService.timeLeft$;
    this.activeBadges = this.badgeService.activeBadges;
  
    this.timerService.setInitialTime(this.sessionDurations.work);

    this.timerService.timeLeftCompleted$.subscribe(() => {
      this.completeSession();
    });
  }  

  ngOnDestroy(): void {
    this.timerService.stop();
  }

  toggleTimer(): void {
    if (this.isRunning) {
      this.timerService.pause();
    } else {
      this.timerService.resume();
    }
    this.isRunning = !this.isRunning;
  }
  
  private completeSession(): void {
    this.isRunning = false;
  
    if (this.sessionType === 'work') {
      this.soundService.playWorkEnd();
      this.completedSessions++;
      this.badgeService.unlockNextBadge();
      
      const isLongBreak = this.completedSessions % this.longBreakInterval === 0;
      this.sessionType = 'break';
  
      const nextDuration = isLongBreak
        ? this.sessionDurations.longBreak
        : this.sessionDurations.shortBreak;
      
      this.timerService.start(nextDuration);
      this.isRunning = true;
      this.confettiService.launchConfetti();
    } else {
      this.soundService.playBreakEnd();
      this.sessionType = 'work';
      this.timerService.start(this.sessionDurations.work);
      this.isRunning = true;
    }
  }
  
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  }

  getProgressPercent(timeLeft: number): number {
    const isLongBreak = this.completedSessions % this.longBreakInterval === 0;
    const total = this.sessionType === 'work'
      ? this.sessionDurations.work
      : isLongBreak
        ? this.sessionDurations.longBreak
        : this.sessionDurations.shortBreak;

    return ((total - timeLeft) / total) * 100;
  }
}
