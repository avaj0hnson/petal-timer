import { TestBed } from '@angular/core/testing';
import { SettingsService } from './settings.service';
import { skip } from 'rxjs';

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(() => {
    spyOn(localStorage, 'setItem').and.stub();
    spyOn(localStorage, 'getItem').and.returnValue(null);

    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open settings', (done) => {
    service.showSettings$.pipe(skip(1)).subscribe(show => {
      expect(show).toBeTrue();
      done();
    });

    service.openSettings();
  });

  it('should close settings', (done) => {
    service.showSettings$.pipe(skip(1)).subscribe(show => {
      expect(show).toBeFalse();
      done();
    });

    service.closeSettings();
  });

  it('should set start hour and save to localStorage', (done) => {
    service.startHour$.pipe(skip(1)).subscribe(hour => {
      expect(hour).toBe(9);
      done();
    });

    service.setStartHour(9);
  });

  it('should set end hour and save to localStorage', (done) => {
    service.endHour$.pipe(skip(1)).subscribe(hour => {
      expect(hour).toBe(18);
      done();
    });

    service.setEndHour(18);
  });

  it('should set muted and save to localStorage', (done) => {
    service.muted$.pipe(skip(1)).subscribe(muted => {
      expect(muted).toBeTrue();
      done();
    });

    service.setMuted(true);
  });

  it('should load settings from localStorage', () => {
    const savedSettings = JSON.stringify({
      startHour: 10,
      endHour: 19,
      muted: true,
    });

    (localStorage.getItem as jasmine.Spy).and.returnValue(savedSettings);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsService);

    service.startHour$.subscribe(hour => expect(hour).toBe(10));
    service.endHour$.subscribe(hour => expect(hour).toBe(19));
    service.muted$.subscribe(muted => expect(muted).toBeTrue());
  });
});
