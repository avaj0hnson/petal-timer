import { TestBed } from '@angular/core/testing';
import { PomodoroTimerService } from './pomodoro-timer.service';

describe('PomodoroTimerService', () => {
  let service: PomodoroTimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PomodoroTimerService);

    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set initial time', () => {
    service.setInitialTime(25);
  
    service.timeLeft$.subscribe(time => {
      expect(time).toBe(25);
    });
  });  

  it('should start timer and countdown every second', (done) => {
    const times: number[] = [];

    service.timeLeft$.subscribe(time => {
      times.push(time);
    });

    service.start(3);

    expect(times[times.length - 1]).toBe(3);

    jasmine.clock().tick(1000);
    expect(times[times.length - 1]).toBe(2);

    jasmine.clock().tick(1000);
    expect(times[times.length - 1]).toBe(1);

    jasmine.clock().tick(1000);
    expect(times[times.length - 1]).toBe(0);

    done();
  });

  it('should emit completion event when time runs out', (done) => {
    service.timeLeftCompleted$.subscribe(() => {
      expect(true).toBeTrue();
      done();
    });
  
    service.start(1);
  
    jasmine.clock().tick(1000);
    jasmine.clock().tick(1000);
  });  

  it('should pause the timer', () => {
    service.start(5);
    jasmine.clock().tick(1000);

    service.pause();

    jasmine.clock().tick(3000);

    service.timeLeft$.subscribe(time => {
      expect(time).toBe(4);
    });
  });

  it('should resume the timer after pause', () => {
    service.start(3);
    jasmine.clock().tick(1000);

    service.pause();
    jasmine.clock().tick(5000);

    service.resume();
    jasmine.clock().tick(1000);

    service.timeLeft$.subscribe(time => {
      expect(time).toBe(1);
    });
  });

  it('should stop the timer', () => {
    service.start(5);
    jasmine.clock().tick(1000);

    service.stop();
    jasmine.clock().tick(5000);

    service.timeLeft$.subscribe(time => {
      expect(time).toBe(4);
    });
  });
});
