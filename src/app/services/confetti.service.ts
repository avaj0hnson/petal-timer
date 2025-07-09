import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import confetti from 'canvas-confetti';
import { ThemeService } from './theme.service';

@Injectable({ providedIn: 'root' })
export class ConfettiService {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object, 
    private themeService: ThemeService
  ) {}
  
  launchConfetti(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.fireConfetti();
  }

  fireConfetti(): void {
    const theme = this.themeService.getCurrentTheme();
    const colors = theme.confettiColors ?? ['#ffffff'];

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors,
      scalar: 1.2,
      ticks: 200,
    });
  }
}
