import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, ModuleWithProviders, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import confetti from 'canvas-confetti';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { TimelineComponent } from "../timeline/timeline.component";
import { BadgePlaygroundComponent } from "../badge-playground/badge-playground.component";

@Component({
  selector: 'app-pomodoro',
  standalone: true,
  imports: [CommonModule, NgCircleProgressModule, TimelineComponent, BadgePlaygroundComponent],
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
  timeLeft = 2; // 25 * 60;
  intervalId: any;
  sessionType: 'work' | 'break' = 'work';
  completedSessions = 0;
  activeBadges: { emoji: string; x: number }[] = [];
  badgeUnlockIndex = 0;
  longBreakInterval = 1; //4;
  workEndSound!: HTMLAudioElement;
  breakEndSound!: HTMLAudioElement;

  readonly sessionDurations = {
    work: 2, // 25 * 60,
    shortBreak: 1, // 5 * 60,
    longBreak: 1 // 15 * 60
  };

  readonly allBadges = [
    { emoji: '🌸' }, { emoji: '🧁' }, { emoji: '🎀' }, { emoji: '🌟' },
    { emoji: '🐣' }, { emoji: '🧸' }, { emoji: '🥚' }, { emoji: '🎈' },
    { emoji: '🍓' }, { emoji: '☁️' }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.workEndSound = new Audio('sounds/work-end.mp3');
      this.breakEndSound = new Audio('sounds/break-end.mp3');
  
      this.workEndSound.load();
      this.breakEndSound.load();
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  toggleTimer(): void {
    this.isRunning = !this.isRunning;

    if (this.isRunning) {
      this.intervalId = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.completeSession();
        }
      }, 1000);
    } else {
      clearInterval(this.intervalId);
    }
  }

  unlockBadge(): void {
    if (this.badgeUnlockIndex < this.allBadges.length) {
      const badge = this.allBadges[this.badgeUnlockIndex];
      const slotSpacing = 10; // Each badge spaced 10%
      const leftPosition = 5 + this.badgeUnlockIndex * slotSpacing; // Starting from 5%

      this.activeBadges.push({
        emoji: badge.emoji,
        x: leftPosition,
      });

      this.badgeUnlockIndex++;

      // Move the new badge into its spot
      setTimeout(() => {
        const badgeElems = document.querySelectorAll('[data-final-left]');
        const lastBadge = badgeElems[badgeElems.length - 1] as HTMLElement;
        const finalLeft = lastBadge.getAttribute('data-final-left');

        if (lastBadge && finalLeft) {
          lastBadge.style.left = finalLeft + '%';
        }
      }, 50);
    }
  }

  completeSession(): void {
    clearInterval(this.intervalId);
    this.isRunning = false;
  
    if (this.sessionType === 'work') {
      this.workEndSound.play();

      this.completedSessions++;
      this.unlockBadge();
      this.sessionType = 'break';
  
      const isLongBreak = this.completedSessions % this.longBreakInterval === 0;
      this.timeLeft = isLongBreak
        ? this.sessionDurations.longBreak
        : this.sessionDurations.shortBreak;

        if (isLongBreak) {
          this.launchConfetti();
        }
    } else {
      this.breakEndSound.play();

      this.sessionType = 'work';
      this.timeLeft = this.sessionDurations.work;
    } 
  }  

  getRandomEmoji(): string {
    const options = ['🍓', '🌸', '🧁', '🌷', '🐣', '🎀', '🧸', '🐰', '✨'];
    return options[Math.floor(Math.random() * options.length)];
  }

  formatTime(): string {
    const m = Math.floor(this.timeLeft / 60).toString().padStart(2, '0');
    const s = (this.timeLeft % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  launchConfetti(): void {
    const blushColors = ['#ffd6e8', '#ffeaf4', '#f8b4d9', '#fcd3e1', '#fff0f6'];
  
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: blushColors,
      scalar: 1.2,
      ticks: 200, 
    });
  }

  getProgressPercent(): number {
    const isLongBreak = this.completedSessions % this.longBreakInterval === 0;
    const total = this.sessionType === 'work'
      ? this.sessionDurations.work
      : isLongBreak
        ? this.sessionDurations.longBreak
        : this.sessionDurations.shortBreak;

    return ((total - this.timeLeft) / total) * 100;
  }
}
