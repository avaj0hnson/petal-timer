import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Settings } from '../models/settings.model';

const SETTINGS_KEY = 'appSettings';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private _showSettings = new BehaviorSubject<boolean>(false);
  private _startHour = new BehaviorSubject<number>(8);
  private _endHour = new BehaviorSubject<number>(17);
  private _muted = new BehaviorSubject<boolean>(false);
  private _workDuration = new BehaviorSubject<number>(25);
  private _shortBreakDuration = new BehaviorSubject<number>(5);
  private _longBreakDuration = new BehaviorSubject<number>(15);

  showSettings$ = this._showSettings.asObservable();
  startHour$ = this._startHour.asObservable();
  endHour$ = this._endHour.asObservable();
  muted$ = this._muted.asObservable();
  workDuration$ = this._workDuration.asObservable();
  shortBreakDuration$ = this._shortBreakDuration.asObservable();
  longBreakDuration$ = this._longBreakDuration.asObservable();

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

  setWorkDuration(minutes: number) {
  this._workDuration.next(minutes);
  this.saveSettings();
  }

  setShortBreakDuration(minutes: number) {
    this._shortBreakDuration.next(minutes);
    this.saveSettings();
  }

  setLongBreakDuration(minutes: number) {
    this._longBreakDuration.next(minutes);
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
        this._workDuration.next(settings.workDuration || 25);
        this._shortBreakDuration.next(settings.shortBreakDuration || 5);
        this._longBreakDuration.next(settings.longBreakDuration || 15);
      }
    }
  }
  
  private saveSettings() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const settings: Settings = {
        startHour: this._startHour.value,
        endHour: this._endHour.value,
        muted: this._muted.value,
        workDuration: this._workDuration.value,
        shortBreakDuration: this._shortBreakDuration.value,
        longBreakDuration: this._longBreakDuration.value
      };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }
  }  
}
