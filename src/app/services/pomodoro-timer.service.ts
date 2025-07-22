import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subject, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PomodoroTimerService {
  private _timeLeft = new BehaviorSubject<number>(0);
  timeLeft$ = this._timeLeft.asObservable();

  private _timeLeftCompleted = new Subject<void>();
  timeLeftCompleted$ = this._timeLeftCompleted.asObservable();

  private intervalSub?: Subscription;
  private duration: number = 0;
  private startTimestamp: number | null = null;
  private remainingTime: number = 0;
  private isRunning: boolean = false;

  setInitialTime(duration: number) {
    this.stop();
    this.duration = duration;
    this.remainingTime = duration;
    this._timeLeft.next(duration);
  }

  start(duration: number) {
    this.stop();
    this.duration = duration;
    this.remainingTime = duration;
    this._timeLeft.next(duration);
    this.startTimestamp = Date.now();
    this.startTicking();
  }

  resume() {
    if (!this.isRunning && this.remainingTime > 0) {
      this.startTimestamp = Date.now() - (this.duration - this.remainingTime) * 1000;
      this.startTicking();
    }
  }

  pause() {
    if (!this.isRunning) return;

    this.updateRemainingTime();
    this.stopTicking();
    this._timeLeft.next(this.remainingTime);
  }

  stop() {
    this.stopTicking();
    this.startTimestamp = null;
    this.remainingTime = 0;
    this.isRunning = false;
  }

  private startTicking() {
    this.isRunning = true;
    this.intervalSub = interval(1000).subscribe(() => this.updateTime());
  }

  private stopTicking() {
    this.intervalSub?.unsubscribe();
    this.intervalSub = undefined;
    this.isRunning = false;
  }

  private updateTime() {
    this.updateRemainingTime();
    this._timeLeft.next(this.remainingTime);

    if (this.remainingTime <= 0) {
      this.stop();
      this._timeLeftCompleted.next();
    }
  }

  private updateRemainingTime() {
    if (this.startTimestamp !== null) {
      const elapsed = Math.floor((Date.now() - this.startTimestamp) / 1000);
      this.remainingTime = Math.max(this.duration - elapsed, 0);
    }
  }
}
