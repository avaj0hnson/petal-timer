import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subject, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PomodoroTimerService {
  private _timeLeft = new BehaviorSubject<number>(0);
  timeLeft$ = this._timeLeft.asObservable();

  private _timeLeftCompleted = new Subject<void>();
  timeLeftCompleted$ = this._timeLeftCompleted.asObservable();

  private intervalSub?: Subscription;
  private isRunning = false;

  setInitialTime(duration: number) {
    this._timeLeft.next(duration);
  }

  start(duration: number) {
    this.stop();
    this._timeLeft.next(duration);
    this.isRunning = true;
    this.intervalSub = interval(1000).subscribe(() => this.tick());
  }

  resume() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.intervalSub = interval(1000).subscribe(() => this.tick());
    }
  }

  pause() {
    this.isRunning = false;
    this.intervalSub?.unsubscribe();
    this.intervalSub = undefined;
  }

  stop() {
    this.isRunning = false;
    this.intervalSub?.unsubscribe();
    this.intervalSub = undefined;
  }

  private tick() {
    const current = this._timeLeft.value;
    if (current > 0) {
      this._timeLeft.next(current - 1);
    } else {
      this.stop();
      this._timeLeftCompleted.next();
    }
  }
}
