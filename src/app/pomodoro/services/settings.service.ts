import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private _showSettings = new BehaviorSubject<boolean>(false);
  private _startHour = new BehaviorSubject<number>(8);
  private _endHour = new BehaviorSubject<number>(17);
  private _muted = new BehaviorSubject<boolean>(false);
  
  showSettings$ = this._showSettings.asObservable();
  startHour$ = this._startHour.asObservable();
  endHour$ = this._endHour.asObservable();
  muted$ = this._muted.asObservable();

  openSettings() {
    this._showSettings.next(true);
  }

  closeSettings() {
    this._showSettings.next(false);
  }

  setStartHour(hour: number) {
    this._startHour.next(hour);
  }

  setEndHour(hour: number) {
    this._endHour.next(hour);
  }

  setMuted(muted: boolean) { 
    this._muted.next(muted); 
  }
}
