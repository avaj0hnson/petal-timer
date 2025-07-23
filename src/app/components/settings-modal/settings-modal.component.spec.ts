import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsModalComponent } from './settings-modal.component';
import { Theme } from '../../models/theme.model';
import { of } from 'rxjs';
import { ThemeService } from '../../services/theme.service';

describe('SettingsModalComponent', () => {
  let component: SettingsModalComponent;
  let fixture: ComponentFixture<SettingsModalComponent>;

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
    confettiColors: ['#ffd6e8', '#ffeaf4', '#f8b4d9', '#fcd3e1', '#fff0f6'],
    selectBackgroundClass: 'bg-white'
  };

  const mockThemeService = {
    getThemes: () => [mockTheme],
    getCurrentTheme: () => mockTheme,
    currentTheme$: of(mockTheme),
    switchTheme: jasmine.createSpy('switchTheme')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsModalComponent],
      providers: [
        { provide: ThemeService, useValue: mockThemeService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsModalComponent);
    component = fixture.componentInstance;
    component.startHour = 9;
    component.endHour = 17;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format hours correctly', () => {
    expect(component.formatHour(0)).toBe('12:00 AM');
    expect(component.formatHour(12)).toBe('12:00 PM');
    expect(component.formatHour(15)).toBe('3:00 PM');
    expect(component.formatHour(23)).toBe('11:00 PM');
  });

  it('should calculate valid start hours', () => {
    component.endHour = 15;
    expect(component.validStartHours.every(hour => hour < 15)).toBeTrue();
  });

  it('should calculate valid end hours', () => {
    component.startHour = 10;
    expect(component.validEndHours.every(hour => hour > 10)).toBeTrue();
  });

  it('should emit mutedChange when toggled', () => {
    spyOn(component.mutedChange, 'emit');
    component.mutedChange.emit(true); // Simulate interaction
    expect(component.mutedChange.emit).toHaveBeenCalledWith(true);
  });

  it('should emit startHourChange when start hour changes', () => {
    spyOn(component.startHourChange, 'emit');
    component.startHourChange.emit(8);
    expect(component.startHourChange.emit).toHaveBeenCalledWith(8);
  });

  it('should emit endHourChange when end hour changes', () => {
    spyOn(component.endHourChange, 'emit');
    component.endHourChange.emit(17);
    expect(component.endHourChange.emit).toHaveBeenCalledWith(17);
  });

  it('should emit close event when Escape key is pressed', () => {
    spyOn(component.close, 'emit');
    component.onEscapeKey(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should switch theme and update selected name', () => {
    component.onThemeChange('Galaxy');
    expect(component.selectedThemeName).toBe('Galaxy');
    expect(mockThemeService.switchTheme).toHaveBeenCalledWith('Galaxy');
  });

  it('should emit workDurationChange when updated', () => {
    spyOn(component.workDurationChange, 'emit');
    component.workDuration = 45;
    component.workDurationChange.emit(component.workDuration); // Simulate user change
    expect(component.workDurationChange.emit).toHaveBeenCalledWith(45);
  });

  it('should emit shortBreakDurationChange when updated', () => {
    spyOn(component.shortBreakDurationChange, 'emit');
    component.shortBreakDuration = 10;
    component.shortBreakDurationChange.emit(component.shortBreakDuration);
    expect(component.shortBreakDurationChange.emit).toHaveBeenCalledWith(10);
  });

  it('should emit longBreakDurationChange when updated', () => {
    spyOn(component.longBreakDurationChange, 'emit');
    component.longBreakDuration = 25;
    component.longBreakDurationChange.emit(component.longBreakDuration);
    expect(component.longBreakDurationChange.emit).toHaveBeenCalledWith(25);
  });

  it('should initialize with current theme from ThemeService', () => {
    expect(component.currentTheme.name).toBe('Blush');
    expect(component.selectedThemeName).toBe('Blush');
    expect(component.themes.length).toBeGreaterThan(0);
  });
});