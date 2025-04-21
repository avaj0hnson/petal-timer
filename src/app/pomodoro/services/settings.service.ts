import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Settings } from '../models/settings';

const SETTINGS_KEY = 'appSettings';

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

  constructor() {
    this.loadSettings();
  }

  openSettings() {
    this._showSettings.next(true);
  }

  closeSettings() {
    this._showSettings.next(false);
  }

  setStartHour(hour: number) {
    this._startHour.next(hour);
    this.saveSettings();
  }

  setEndHour(hour: number) {
    this._endHour.next(hour);
    this.saveSettings();
  }

  setMuted(muted: boolean) { 
    this._muted.next(muted); 
    this.saveSettings();
  }

  private loadSettings() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        const settings: Settings = JSON.parse(saved);
        this._startHour.next(settings.startHour);
        this._endHour.next(settings.endHour);
        this._muted.next(settings.muted);
      }
    }
  }
  
  private saveSettings() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const settings: Settings = {
        startHour: this._startHour.value,
        endHour: this._endHour.value,
        muted: this._muted.value
      };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }
  }  
}
