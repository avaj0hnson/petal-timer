import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { SoundService } from './sound.service';
import { SettingsService } from './settings.service';
import { of } from 'rxjs';

class FakeAudio {
  load = jasmine.createSpy('load');
  play = jasmine.createSpy('play');
}

describe('SoundService', () => {
  let service: SoundService;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;

  beforeEach(() => {
    settingsServiceSpy = jasmine.createSpyObj('SettingsService', ['muted$'], {
      muted$: of(false)
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: SettingsService, useValue: settingsServiceSpy },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    // @ts-ignore
    window.Audio = FakeAudio;
    service = TestBed.inject(SoundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load work and break end sounds on creation', () => {
    expect(service['workEndSound']).toBeDefined();
    expect(service['breakEndSound']).toBeDefined();
  });

  it('should play work end sound if not muted', () => {
    const playSpy = service['workEndSound']?.play as jasmine.Spy;
    service.playWorkEnd();
    expect(playSpy).toHaveBeenCalled();
  });

  it('should play break end sound if not muted', () => {
    const playSpy = service['breakEndSound']?.play as jasmine.Spy;
    service.playBreakEnd();
    expect(playSpy).toHaveBeenCalled();
  });

  it('should not play sounds when muted', () => {
    settingsServiceSpy = jasmine.createSpyObj('SettingsService', ['muted$'], {
      muted$: of(true)
    });

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: SettingsService, useValue: settingsServiceSpy },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    // @ts-ignore
    window.Audio = FakeAudio;
    service = TestBed.inject(SoundService);

    const workPlaySpy = service['workEndSound']?.play as jasmine.Spy;
    const breakPlaySpy = service['breakEndSound']?.play as jasmine.Spy;

    service.playWorkEnd();
    service.playBreakEnd();

    expect(workPlaySpy).not.toHaveBeenCalled();
    expect(breakPlaySpy).not.toHaveBeenCalled();
  });
});
