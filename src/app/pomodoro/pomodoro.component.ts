import { CommonModule } from '@angular/common';
import { Component, ModuleWithProviders, OnDestroy, OnInit } from '@angular/core';
import { CircleProgressOptions, NgCircleProgressModule } from 'ng-circle-progress';
import { TimelineComponent } from "../timeline/timeline.component";
import { BadgePlaygroundComponent } from "../badge-playground/badge-playground.component";
import { PomodoroTimerService } from '../services/pomodoro-timer.service';
import { SoundService } from '../services/sound.service';
import { BadgeService } from '../services/badge.service';
import { ConfettiService } from '../services/confetti.service';
import { Observable } from 'rxjs';
import { SettingsModalComponent } from "../settings-modal/settings-modal.component";
import { SettingsService } from '../services/settings.service';
import { ThemeService } from '../services/theme.service';
import { Theme } from '../models/theme.model';

@Component({
  selector: 'app-pomodoro',
  standalone: true,
  imports: [CommonModule, NgCircleProgressModule, TimelineComponent, BadgePlaygroundComponent, SettingsModalComponent],
  providers: [
    { provide: CircleProgressOptions, useValue: {} }
  ],
  templateUrl: './pomodoro.component.html',
  styleUrl: './pomodoro.component.scss'
})
export class PomodoroComponent implements OnInit, OnDestroy{
  isRunning = false;
  sessionType: 'work' | 'break' = 'work';
  completedSessions = 0;
  longBreakInterval = 4;
  activeBadges!: { emoji: string; x: number, name: string }[];
  theme$!: Observable<Theme>;
  themeReady$!: Observable<boolean>;
  timeLeft$!: Observable<number>;

  readonly sessionDurations = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  constructor(private timerService: PomodoroTimerService,
              private soundService: SoundService,
              private badgeService: BadgeService,
              private confettiService: ConfettiService,
              public settingsService: SettingsService,
              private themeService: ThemeService
  ) {}
  
  ngOnInit(): void {
    this.themeReady$ = this.themeService.themeReady$;
    this.theme$ = this.themeService.currentTheme$;
    this.theme$.subscribe(theme => {
      this.badgeService.setBadgeSet(theme.badgeSet);
      this.activeBadges = this.badgeService.activeBadges;
    });
    this.timeLeft$ = this.timerService.timeLeft$;
    this.activeBadges = this.badgeService.activeBadges;
  
    this.timerService.setInitialTime(this.sessionDurations.work);

    this.timerService.timeLeftCompleted$.subscribe(() => {
      this.completeSession();
    });

    this.settingsService.workDuration$.subscribe(min => {
      this.sessionDurations.work = min * 60;
      if (this.sessionType === 'work' && !this.isRunning) {
        this.timerService.setInitialTime(this.sessionDurations.work);
      }
      if (this.sessionType === 'work' && this.isRunning) {
        this.timerService.start(this.sessionDurations.work);
      }
    });

    this.settingsService.shortBreakDuration$.subscribe(min => {
      this.sessionDurations.shortBreak = min * 60;
      if (this.sessionType === 'break' && this.completedSessions % this.longBreakInterval !== 0 && !this.isRunning) {
        this.timerService.setInitialTime(this.sessionDurations.shortBreak);
      }
      if (this.sessionType === 'break' && this.completedSessions % this.longBreakInterval !== 0 && this.isRunning) {
        this.timerService.start(this.sessionDurations.shortBreak);
      }
    });

    this.settingsService.longBreakDuration$.subscribe(min => {
      this.sessionDurations.longBreak = min * 60;
      if (this.sessionType === 'break' && this.completedSessions % this.longBreakInterval === 0 && !this.isRunning) {
        this.timerService.setInitialTime(this.sessionDurations.longBreak);
      }
      if (this.sessionType === 'break' && this.completedSessions % this.longBreakInterval === 0 && this.isRunning) {
        this.timerService.start(this.sessionDurations.longBreak);
      }
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

  skipSession(): void {
    this.timerService.stop();
    this.completeSession();
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

  restartBadges(): void {
    this.badgeService.setBadgeSet(this.badgeService.getCurrentBadgeSet());
    this.activeBadges = this.badgeService.activeBadges;
  }  
}
