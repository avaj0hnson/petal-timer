import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PomodoroComponent } from './pomodoro.component';
import { PomodoroTimerService } from '../services/pomodoro-timer.service';
import { SoundService } from '../services/sound.service';
import { BadgeService } from '../services/badge.service';
import { ConfettiService } from '../services/confetti.service';
import { SettingsService } from '../services/settings.service';
import { of, Subject } from 'rxjs';
import { ThemeService } from '../services/theme.service';
import { Theme } from '../models/theme.model';

describe('PomodoroComponent', () => {
  let component: PomodoroComponent;
  let fixture: ComponentFixture<PomodoroComponent>;

  let mockTimerService: jasmine.SpyObj<PomodoroTimerService>;
  let mockSoundService: jasmine.SpyObj<SoundService>;
  let mockBadgeService: jasmine.SpyObj<BadgeService>;
  let mockConfettiService: jasmine.SpyObj<ConfettiService>;
  let mockSettingsService: jasmine.SpyObj<SettingsService>;
  let mockThemeService: jasmine.SpyObj<ThemeService>;
  
  let timeLeftCompletedSubject: Subject<void>;

  beforeEach(async () => {
    timeLeftCompletedSubject = new Subject<void>();

    mockTimerService = jasmine.createSpyObj('PomodoroTimerService', [
      'setInitialTime', 'pause', 'resume', 'stop', 'start'
    ], {
      timeLeft$: of(1500), // 25 minutes
      timeLeftCompleted$: timeLeftCompletedSubject.asObservable()
    });

    mockSoundService = jasmine.createSpyObj('SoundService', ['playWorkEnd', 'playBreakEnd']);
    mockBadgeService = jasmine.createSpyObj<BadgeService>(
      'BadgeService',
      ['unlockNextBadge', 'setBadgeSet', 'getCurrentBadgeSet']
    );
    mockBadgeService.activeBadges = [];    
    mockConfettiService = jasmine.createSpyObj('ConfettiService', ['launchConfetti']);
    mockSettingsService = jasmine.createSpyObj('SettingsService', [], {
      muted$: of(false)
    });
    mockThemeService = jasmine.createSpyObj('ThemeService', [], {
      themeReady$: of(true),
      currentTheme$: of({
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
      } as Theme)
    });
    
    await TestBed.configureTestingModule({
      imports: [PomodoroComponent],
      providers: [
        { provide: PomodoroTimerService, useValue: mockTimerService },
        { provide: SoundService, useValue: mockSoundService },
        { provide: BadgeService, useValue: mockBadgeService },
        { provide: ConfettiService, useValue: mockConfettiService },
        { provide: SettingsService, useValue: mockSettingsService },
        { provide: ThemeService, useValue: mockThemeService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PomodoroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize timeLeft$ and activeBadges', () => {
    expect(component.timeLeft$).toBeDefined();
    expect(component.activeBadges).toEqual([]);
    expect(mockTimerService.setInitialTime).toHaveBeenCalledWith(component.sessionDurations.work);
  });

  it('should toggle timer', () => {
    expect(component.isRunning).toBeFalse();

    component.toggleTimer();
    expect(mockTimerService.resume).toHaveBeenCalled();
    expect(component.isRunning).toBeTrue();

    component.toggleTimer();
    expect(mockTimerService.pause).toHaveBeenCalled();
    expect(component.isRunning).toBeFalse();
  });

  it('should complete work session correctly', () => {
    component.sessionType = 'work';
    component.completedSessions = 0;
  
    timeLeftCompletedSubject.next();
  
    expect(component.isRunning).toBeTrue();
    expect(component.sessionType).toBe('break');
    expect(component.completedSessions).toBe(1);
    expect(mockSoundService.playWorkEnd).toHaveBeenCalled();
    expect(mockBadgeService.unlockNextBadge).toHaveBeenCalled();
    expect(mockTimerService.start).toHaveBeenCalledWith(component.sessionDurations.shortBreak);
    expect(mockConfettiService.launchConfetti).toHaveBeenCalled();
  });  

  it('should complete break session correctly', () => {
    component.sessionType = 'break';
    component.completedSessions = 2;
  
    timeLeftCompletedSubject.next();
  
    expect(component.isRunning).toBeTrue();
    expect(component.sessionType).toBe('work');
    expect(mockSoundService.playBreakEnd).toHaveBeenCalled();
    expect(mockTimerService.start).toHaveBeenCalledWith(component.sessionDurations.work);
  });  

  it('should format time correctly', () => {
    expect(component.formatTime(0)).toBe('00:00');
    expect(component.formatTime(65)).toBe('01:05');
    expect(component.formatTime(600)).toBe('10:00');
  });

  it('should calculate progress percent correctly', () => {
    component.sessionType = 'work';
    component.completedSessions = 1;
    expect(component.getProgressPercent(1500)).toBe(0);
    expect(component.getProgressPercent(750)).toBeCloseTo(50);

    component.sessionType = 'break';
    expect(component.getProgressPercent(300)).toBe(0);
  });

  it('should stop timer on destroy', () => {
    fixture.destroy();
    expect(mockTimerService.stop).toHaveBeenCalled();
  });

  it('should set badge set from current theme on init', () => {
    const [[calledSet]] = mockBadgeService.setBadgeSet.calls.allArgs();
    expect(calledSet.length).toBe(14);
    expect(calledSet.some(b => b.name === 'Cherry Blossom')).toBeTrue();    
  });
  
  it('should skip session correctly', () => {
    spyOn<any>(component, 'completeSession');
    component.skipSession();
    expect(mockTimerService.stop).toHaveBeenCalled();
    expect(component['completeSession']).toHaveBeenCalled();
  });

  it('should restart badges', () => {
    mockBadgeService.getCurrentBadgeSet = jasmine.createSpy().and.returnValue([
      { emoji: '🌟', name: 'Star', x: 10 }
    ]);
    mockBadgeService.activeBadges = [
      { emoji: '🌟', name: 'Star', x: 10 }
    ];
  
    component.restartBadges();
    expect(mockBadgeService.setBadgeSet).toHaveBeenCalledWith([
      jasmine.objectContaining({ emoji: '🌟', name: 'Star' })
    ]);    
    expect(component.activeBadges).toEqual([
      { emoji: '🌟', name: 'Star', x: 10 }
    ]);
  });  
});
