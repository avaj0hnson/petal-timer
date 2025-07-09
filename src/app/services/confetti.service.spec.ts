import { TestBed } from '@angular/core/testing';
import { ConfettiService } from './confetti.service';
import { PLATFORM_ID } from '@angular/core';
import { Theme } from '../models/theme.model';
import { ThemeService } from './theme.service';
import * as confetti from 'canvas-confetti';

const mockTheme: Theme = {
  name: 'Blush',
  rootClass: 'theme-blush',
  backgroundClass: 'bg-blush-100',
  textClass: 'text-blush-text',
  buttonClass: 'bg-blush hover:bg-blush-dark',
  iconButtonClass: 'text-blush-text hover:text-blush-dark',
  focusRingClass: 'focus:ring-blush-dark',
  ringColor: '#f8b4d9',
  progressColor: '#f8b4d9',
  progressTrackClass: 'bg-blush-100',
  progressFillClass: 'bg-blush',
  modalBackgroundClass: 'bg-white',
  badgeSet: [
    { emoji: '🌸', name: 'Cherry Blossom' },
    { emoji: '🧁', name: 'Cupcake' },
    { emoji: '🎀', name: 'Ribbon' },
    { emoji: '🌟', name: 'Star' },
    { emoji: '🐣', name: 'Hatchling Chick' },
    { emoji: '🧸', name: 'Teddy Bear' },
    { emoji: '🥚', name: 'Mystery Egg' },
    { emoji: '🎈', name: 'Balloon' },
    { emoji: '🍓', name: 'Strawberry' },
    { emoji: '☁️', name: 'Cloud' },
    { emoji: '🧃', name: 'Juice Box' },
    { emoji: '🍩', name: 'Donut' },
    { emoji: '🍒', name: 'Cherries' },
    { emoji: '💗', name: 'Heart Sparkle' }
  ],
  confettiColors: ['#ffd6e8', '#ffeaf4', '#f8b4d9', '#fcd3e1', '#fff0f6']
};

class MockThemeService {
  getCurrentTheme(): Theme {
    return mockTheme;
  }
}

describe('ConfettiService', () => {
  let service: ConfettiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: ThemeService, useClass: MockThemeService }
      ]
    });

    service = TestBed.inject(ConfettiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call fireConfetti when on browser platform', () => {
    const spy = spyOn(service, 'fireConfetti');
    service.launchConfetti();
    expect(spy).toHaveBeenCalled();
  });

  it('should not call fireConfetti when on server platform', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: ThemeService, useClass: MockThemeService }
      ]
    });

    const serverService = TestBed.inject(ConfettiService);
    const spy = spyOn(serverService, 'fireConfetti');
    serverService.launchConfetti();
    expect(spy).not.toHaveBeenCalled();
  });
});