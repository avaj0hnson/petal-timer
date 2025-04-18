import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SettingsService } from './settings.service';

@Injectable({ providedIn: 'root' })
export class SoundService {
  private workEndSound?: HTMLAudioElement;
  private breakEndSound?: HTMLAudioElement;
  private isBrowser: boolean;
  private muted = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private settingsService: SettingsService) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.workEndSound = new Audio('sounds/work-end.mp3');
      this.breakEndSound = new Audio('sounds/break-end.mp3');

      this.workEndSound.load();
      this.breakEndSound.load();

      this.settingsService.muted$.subscribe(value => {
        this.muted = value;
      });
    }
  }

  playWorkEnd() {
    if (this.isBrowser && !this.muted) {
      this.workEndSound?.play();
    }
  }

  playBreakEnd() {
    if (this.isBrowser && !this.muted) {
      this.breakEndSound?.play();
    }
  }
}
