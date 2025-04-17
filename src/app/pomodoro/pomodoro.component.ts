import { CommonModule } from '@angular/common';
import { Component, ModuleWithProviders, OnDestroy, OnInit } from '@angular/core';
import confetti from 'canvas-confetti';
import { NgCircleProgressModule } from 'ng-circle-progress';

@Component({
  selector: 'app-pomodoro',
  standalone: true,
  imports: [CommonModule, NgCircleProgressModule],
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
  timeLeft = 5; // 25 * 60;
  intervalId: any;
  sessionType: 'work' | 'break' = 'work';
  completedSessions = 0;
  emojis: string[] = [];

  longBreakInterval = 1; //4;

  readonly sessionDurations = {
    work: 25, // 25 * 60,
    shortBreak: 5, // 5 * 60,
    longBreak: 15 // 15 * 60
  };

  ngOnInit(): void {}

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

  completeSession(): void {
    clearInterval(this.intervalId);
    this.isRunning = false;
  
    if (this.sessionType === 'work') {
      this.completedSessions++;
      this.emojis.push(this.getRandomEmoji());
      this.sessionType = 'break';
  
      const isLongBreak = this.completedSessions % this.longBreakInterval === 0;
      this.timeLeft = isLongBreak
        ? this.sessionDurations.longBreak
        : this.sessionDurations.shortBreak;

        if (isLongBreak) {
          this.launchConfetti();
        }
    } else {
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
