import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimelineComponent } from './timeline.component';
import { PLATFORM_ID } from '@angular/core';
import { DateTime } from 'luxon';

function mockNowAtMinutesSinceStart(startHour: number, minutesAfterStart: number): DateTime<true> {
  return DateTime.utc(2024, 1, 1, startHour, 0, 0)
    .plus({ minutes: minutesAfterStart })
    .toUTC() as unknown as DateTime<true>;
}
describe('TimelineComponent', () => {
  let component: TimelineComponent;
  let fixture: ComponentFixture<TimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineComponent],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;
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

  it('should set progress to 0 before startHour', () => {
    const now = DateTime.now().toUTC().set({ hour: component.startHour - 1, minute: 0, second: 0 });
    spyOn(DateTime, 'now').and.returnValue(now);
  
    component.updateProgress();
    expect(component.currentProgress).toBe(0);
  });  

  it('should set progress to 100 after endHour', () => {
    component.timezone = 'UTC';
  
    const endHour = component.endHour;
  
    const now = DateTime.utc(2024, 1, 1, endHour + 2, 0, 0)
      .toUTC() as unknown as DateTime<true>;
  
    spyOn(DateTime, 'now').and.returnValue(now);
  
    component.updateProgress();
  
    expect(component.currentProgress).toBe(100);
  });  
  
  it('should calculate correct progress during work hours', () => {
    const startHour = component.startHour;
    const endHour = component.endHour;
    const totalWorkMinutes = (endHour - startHour) * 60;
    const halfWorkMinutes = totalWorkMinutes / 2;
  
    component.timezone = 'UTC';
  
    const now = mockNowAtMinutesSinceStart(startHour, halfWorkMinutes);
  
    spyOn(DateTime, 'now').and.returnValue(now);
  
    component.updateProgress();
  
    expect(component.currentProgress).toBeCloseTo(50, 0);
  });

  it('should update progress when startHour or endHour changes', () => {
    spyOn(component, 'updateProgress');

    component.ngOnChanges({
      startHour: {
        previousValue: 8,
        currentValue: 9,
        firstChange: false,
        isFirstChange: () => false
      }
    });

    expect(component.updateProgress).toHaveBeenCalled();

    component.ngOnChanges({
      endHour: {
        previousValue: 17,
        currentValue: 18,
        firstChange: false,
        isFirstChange: () => false
      }
    });

    expect(component.updateProgress).toHaveBeenCalledTimes(2);
  });
});
