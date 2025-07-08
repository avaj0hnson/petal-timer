import { TestBed } from '@angular/core/testing';
import { PomodoroTimerService } from './pomodoro-timer.service';

describe('PomodoroTimerService', () => {
  let service: PomodoroTimerService;
  let fakeNow: number;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PomodoroTimerService);

    jasmine.clock().install();
    fakeNow = 1000000;
    spyOn(Date, 'now').and.callFake(() => fakeNow);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set initial time', () => {
    let value = 0;
    service.setInitialTime(25);
    service.timeLeft$.subscribe(time => (value = time));

    expect(value).toBe(25);
  });

  it('should start timer and countdown every second', () => {
    const times: number[] = [];
    service.timeLeft$.subscribe(time => times.push(time));

    service.start(3);

    jasmine.clock().tick(0);
    expect(times[times.length - 1]).toBe(3);

    fakeNow += 1000;
    jasmine.clock().tick(1000);
    expect(times[times.length - 1]).toBe(2);

    fakeNow += 1000;
    jasmine.clock().tick(1000);
    expect(times[times.length - 1]).toBe(1);

    fakeNow += 1000;
    jasmine.clock().tick(1000);
    expect(times[times.length - 1]).toBe(0);
  });

  it('should emit completion event when time runs out', () => {
    let completed = false;
    service.timeLeftCompleted$.subscribe(() => {
      completed = true;
    });

    service.start(1);

    fakeNow += 1000;
    jasmine.clock().tick(1000);
    fakeNow += 1000;
    jasmine.clock().tick(1000);

    expect(completed).toBeTrue();
  });

  it('should pause the timer', () => {
    let value = 0;
    service.timeLeft$.subscribe(time => (value = time));

    service.start(5);
    fakeNow += 1000;
    jasmine.clock().tick(1000);

    service.pause();

    fakeNow += 3000;
    jasmine.clock().tick(3000);

    expect(value).toBe(4);
  });

  it('should resume the timer after pause', () => {
    let value = 0;
    service.timeLeft$.subscribe(time => (value = time));

    service.start(3);
    fakeNow += 1000;
    jasmine.clock().tick(1000);

    service.pause();
    fakeNow += 5000;
    jasmine.clock().tick(5000);

    service.resume();
    fakeNow += 1000;
    jasmine.clock().tick(1000);

    expect(value).toBe(1);
  });

  it('should stop the timer', () => {
    let value = 0;
    service.timeLeft$.subscribe(time => (value = time));

    service.start(5);
    fakeNow += 1000;
    jasmine.clock().tick(1000);

    service.stop();
    fakeNow += 5000;
    jasmine.clock().tick(5000);

    expect(value).toBe(4);
  });
});
