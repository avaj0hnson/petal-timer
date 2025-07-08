import { TestBed } from '@angular/core/testing';
import { ConfettiService } from './confetti.service';
import { PLATFORM_ID } from '@angular/core';

describe('ConfettiService', () => {
  let service: ConfettiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(ConfettiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call fireConfetti when on browser platform', () => {
    spyOn(service, 'fireConfetti');
    service.launchConfetti();
    expect(service.fireConfetti).toHaveBeenCalled();
  });

  it('should not call fireConfetti if not on browser platform', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    });

    const serverService = TestBed.inject(ConfettiService);

    spyOn(serverService, 'fireConfetti');
    serverService.launchConfetti();
    expect(serverService.fireConfetti).not.toHaveBeenCalled();
  });
});
