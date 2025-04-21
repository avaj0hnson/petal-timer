import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PomodoroComponent } from './pomodoro.component';
import { PomodoroTimerService } from './services/pomodoro-timer.service';
import { SoundService } from './services/sound.service';
import { BadgeService } from './services/badge.service';
import { ConfettiService } from './services/confetti.service';
import { SettingsService } from './services/settings.service';
import { of, Subject } from 'rxjs';

describe('PomodoroComponent', () => {
  let component: PomodoroComponent;
  let fixture: ComponentFixture<PomodoroComponent>;

  let mockTimerService: jasmine.SpyObj<PomodoroTimerService>;
  let mockSoundService: jasmine.SpyObj<SoundService>;
  let mockBadgeService: jasmine.SpyObj<BadgeService>;
  let mockConfettiService: jasmine.SpyObj<ConfettiService>;
  let mockSettingsService: jasmine.SpyObj<SettingsService>;

  let timeLeftCompletedSubject: Subject<void>;

  beforeEach(async () => {
    timeLeftCompletedSubject = new Subject<void>();

    mockTimerService = jasmine.createSpyObj('PomodoroTimerService', [
      'setInitialTime', 'pause', 'resume', 'stop'
    ], {
      timeLeft$: of(1500), // 25 minutes
      timeLeftCompleted$: timeLeftCompletedSubject.asObservable()
    });

    mockSoundService = jasmine.createSpyObj('SoundService', ['playWorkEnd', 'playBreakEnd']);
    mockBadgeService = jasmine.createSpyObj('BadgeService', ['unlockNextBadge'], {
      activeBadges: []
    });
    mockConfettiService = jasmine.createSpyObj('ConfettiService', ['launchConfetti']);
    mockSettingsService = jasmine.createSpyObj('SettingsService', [], {
      muted$: of(false)
    });

    await TestBed.configureTestingModule({
      imports: [PomodoroComponent],
      providers: [
        { provide: PomodoroTimerService, useValue: mockTimerService },
        { provide: SoundService, useValue: mockSoundService },
        { provide: BadgeService, useValue: mockBadgeService },
        { provide: ConfettiService, useValue: mockConfettiService },
        { provide: SettingsService, useValue: mockSettingsService }
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

    expect(component.isRunning).toBeFalse();
    expect(component.sessionType).toBe('break');
    expect(component.completedSessions).toBe(1);
    expect(mockSoundService.playWorkEnd).toHaveBeenCalled();
    expect(mockBadgeService.unlockNextBadge).toHaveBeenCalled();
    expect(mockTimerService.setInitialTime).toHaveBeenCalledWith(component.sessionDurations.shortBreak);
    expect(mockConfettiService.launchConfetti).toHaveBeenCalled();
  });

  it('should complete break session correctly', () => {
    component.sessionType = 'break';
    component.completedSessions = 2;

    timeLeftCompletedSubject.next();

    expect(component.isRunning).toBeFalse();
    expect(component.sessionType).toBe('work');
    expect(mockSoundService.playBreakEnd).toHaveBeenCalled();
    expect(mockTimerService.setInitialTime).toHaveBeenCalledWith(component.sessionDurations.work);
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
    expect(component.getProgressPercent(300)).toBe(0); // short break
  });

  it('should stop timer on destroy', () => {
    fixture.destroy();
    expect(mockTimerService.stop).toHaveBeenCalled();
  });
});
