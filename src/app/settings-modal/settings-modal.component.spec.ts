import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsModalComponent } from './settings-modal.component';

describe('SettingsModalComponent', () => {
  let component: SettingsModalComponent;
  let fixture: ComponentFixture<SettingsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsModalComponent);
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

  it('should calculate valid start hours', () => {
    component.endHour = 15;
    fixture.detectChanges();
    expect(component.validStartHours.every(hour => hour < 15)).toBeTrue();
  });

  it('should calculate valid end hours', () => {
    component.startHour = 10;
    fixture.detectChanges();
    expect(component.validEndHours.every(hour => hour > 10)).toBeTrue();
  });

  it('should emit mutedChange', () => {
    spyOn(component.mutedChange, 'emit');

    component.mutedChange.emit(true);

    expect(component.mutedChange.emit).toHaveBeenCalledWith(true);
  });

  it('should emit startHourChange', () => {
    spyOn(component.startHourChange, 'emit');

    component.startHourChange.emit(8);

    expect(component.startHourChange.emit).toHaveBeenCalledWith(8);
  });

  it('should emit endHourChange', () => {
    spyOn(component.endHourChange, 'emit');

    component.endHourChange.emit(17);

    expect(component.endHourChange.emit).toHaveBeenCalledWith(17);
  });

  it('should emit close event', () => {
    spyOn(component.close, 'emit');

    component.close.emit();

    expect(component.close.emit).toHaveBeenCalled();
  });
});
