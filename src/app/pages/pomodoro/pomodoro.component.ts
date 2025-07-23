import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CircleProgressOptions, NgCircleProgressModule } from 'ng-circle-progress';
import { TimelineComponent } from "../../components/timeline/timeline.component";
import { BadgePlaygroundComponent } from "../../components/badge-playground/badge-playground.component";
import { PomodoroTimerService } from '../../services/pomodoro-timer.service';
import { SoundService } from '../../services/sound.service';
import { BadgeService } from '../../services/badge.service';
import { ConfettiService } from '../../services/confetti.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SettingsModalComponent } from "../../components/settings-modal/settings-modal.component";
import { SettingsService } from '../../services/settings.service';
import { ThemeService } from '../../services/theme.service';
import { Theme } from '../../models/theme.model';
import { TaskListModalComponent } from "../../components/task-list-modal/task-list-modal.component";
import { InfoModalComponent } from "../../components/info-modal/info-modal.component";
import { SkipConfirmModalComponent } from "../../components/skip-confirm-modal/skip-confirm-modal.component";

@Component({
  selector: 'app-pomodoro',
  standalone: true,
  imports: [CommonModule, NgCircleProgressModule, TimelineComponent, BadgePlaygroundComponent, SettingsModalComponent, TaskListModalComponent, InfoModalComponent, SkipConfirmModalComponent],
  providers: [
    { provide: CircleProgressOptions, useValue: {} }
  ],
  templateUrl: './pomodoro.component.html',
  styleUrl: './pomodoro.component.scss'
})
export class PomodoroComponent implements OnInit, OnDestroy{
  isRunning = false;
  showInfoModal = false;
  showSkipConfirmModal = false;
  showTaskModal = false;
  sessionType: 'work' | 'break' = 'work';
  completedSessions = 0;
  longBreakInterval = 4;
  activeBadges!: { emoji: string; x: number, name: string }[];
  theme$!: Observable<Theme>;
  themeReady$!: Observable<boolean>;
  timeLeft$!: Observable<number>;
  private destroy$ = new Subject<void>();

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

    this.theme$.pipe(takeUntil(this.destroy$)).subscribe(theme => {
      this.badgeService.setBadgeSet(theme.badgeSet);
      this.activeBadges = this.badgeService.activeBadges;
    });

    this.timeLeft$ = this.timerService.timeLeft$;
    this.timeLeft$
      .pipe(takeUntil(this.destroy$))
      .subscribe(timeLeft => this.updateDocumentTitle(timeLeft));
    this.timerService.setInitialTime(this.sessionDurations.work);

    this.timerService.timeLeftCompleted$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.completeSession());

    this.handleSettingsSubscriptions();
  }

  private handleSettingsSubscriptions(): void {
    // Work duration updates
    this.settingsService.workDuration$
      .pipe(takeUntil(this.destroy$))
      .subscribe(min => {
        this.sessionDurations.work = min * 60;
        if (this.sessionType === 'work') {
          if (!this.isRunning) {
            this.timerService.setInitialTime(this.sessionDurations.work);
          } else {
            this.timerService.start(this.sessionDurations.work);
          }
        }
      });

    // Short break updates
    this.settingsService.shortBreakDuration$
      .pipe(takeUntil(this.destroy$))
      .subscribe(min => {
        this.sessionDurations.shortBreak = min * 60;
        const isShortBreak = this.sessionType === 'break' && this.completedSessions % this.longBreakInterval !== 0;
        if (isShortBreak) {
          if (!this.isRunning) {
            this.timerService.setInitialTime(this.sessionDurations.shortBreak);
          } else {
            this.timerService.start(this.sessionDurations.shortBreak);
          }
        }
      });

    // Long break updates
    this.settingsService.longBreakDuration$
      .pipe(takeUntil(this.destroy$))
      .subscribe(min => {
        this.sessionDurations.longBreak = min * 60;
        const isLongBreak = this.sessionType === 'break' &&
                            this.completedSessions !== 0 &&
                            this.completedSessions % this.longBreakInterval === 0;
        if (isLongBreak) {
          if (!this.isRunning) {
            this.timerService.setInitialTime(this.sessionDurations.longBreak);
          } else {
            this.timerService.start(this.sessionDurations.longBreak);
          }
        }
      });
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
    if (this.sessionType === 'work') {
      this.timerService.pause();
      this.showSkipConfirmModal = true;
    } else {
      this.timerService.stop();
      this.completeSession();
    }
  }

  confirmSkipSession(): void {
    this.showSkipConfirmModal = false;
    this.timerService.stop();
    this.completeSession(true);
  }

  private completeSession(wasSkipped = false): void {
    this.isRunning = false;

    if (this.sessionType === 'work') {
      this.soundService.playWorkEnd();
      if (!wasSkipped) {
        this.completedSessions++;
        this.badgeService.unlockNextBadge();
        this.confettiService.launchConfetti();
      }

      this.sessionType = 'break';

      const isLongBreak = this.completedSessions !== 0 && this.completedSessions % this.longBreakInterval === 0;
      const nextDuration = isLongBreak
        ? this.sessionDurations.longBreak
        : this.sessionDurations.shortBreak;

      this.timerService.start(nextDuration);
      this.isRunning = true;
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
    const isLongBreak = this.sessionType === 'break' &&
                        this.completedSessions !== 0 &&
                        this.completedSessions % this.longBreakInterval === 0;
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.timerService.stop();
    if (typeof document !== 'undefined') {
      document.title = 'Petal Timer – A Cute & Customizable Pomodoro Timer';
    }
  }

  private updateDocumentTitle(timeLeft: number) {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    const sessionLabel = this.sessionType === 'break' ? 'Break' : 'Focus';

    if (typeof document !== 'undefined') {
      document.title = `⏱ ${minutes}:${seconds} – ${sessionLabel} | Petal Timer`;
    }
  }
}
