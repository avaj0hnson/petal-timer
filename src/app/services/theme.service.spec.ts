import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { THEMES } from '../constants/theme';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);

    spyOn(document.body.classList, 'add').and.callThrough();
    spyOn(document.body.classList, 'remove').and.callThrough();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default theme when no localStorage', () => {
    service.initialize();

    service.currentTheme$.subscribe(theme => {
      expect(theme).toEqual(THEMES[0]);
    });

    expect(service.getCurrentTheme()).toEqual(THEMES[0]);
    expect(document.body.classList.add).toHaveBeenCalledWith(THEMES[0].rootClass);
  });

  it('should emit true on themeReady$', (done) => {
    service.themeReady$.subscribe(ready => {
      if (ready) {
        expect(ready).toBeTrue();
        done();
      }
    });
    service.initialize();
  });

  it('should return all themes', () => {
    expect(service.getThemes()).toEqual(THEMES);
  });

  it('should switch to a valid theme and update localStorage and DOM', () => {
    service.initialize();
    const newTheme = THEMES[1];
    service.switchTheme(newTheme.name);

    expect(service.getCurrentTheme()).toEqual(newTheme);
    expect(localStorage.getItem('selectedTheme')).toBe(newTheme.name);
    expect(document.body.classList.add).toHaveBeenCalledWith(newTheme.rootClass);
  });

  it('should not switch theme if name is invalid', () => {
    service.initialize();
    const before = service.getCurrentTheme();
    service.switchTheme('Nonexistent');

    expect(service.getCurrentTheme()).toBe(before);
  });

  it('should initialize from localStorage if value exists', () => {
    const savedTheme = THEMES[1];
    localStorage.setItem('selectedTheme', savedTheme.name);

    service.initialize();
    expect(service.getCurrentTheme()).toEqual(savedTheme);
  });
});
