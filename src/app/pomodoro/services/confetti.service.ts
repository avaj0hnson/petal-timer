import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import confetti from 'canvas-confetti';

@Injectable({ providedIn: 'root' })
export class ConfettiService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  launchConfetti(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.fireConfetti();
    }
  }
  
  fireConfetti(): void {
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#ffd6e8', '#ffeaf4', '#f8b4d9', '#fcd3e1', '#fff0f6'],
      scalar: 1.2,
      ticks: 200,
    });
  }  
}
