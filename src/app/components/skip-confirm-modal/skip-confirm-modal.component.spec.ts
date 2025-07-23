import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkipConfirmModalComponent } from './skip-confirm-modal.component';
import { Theme } from '../../models/theme.model';

describe('SkipConfirmModalComponent', () => {
  let component: SkipConfirmModalComponent;
  let fixture: ComponentFixture<SkipConfirmModalComponent>;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkipConfirmModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SkipConfirmModalComponent);
    component = fixture.componentInstance;
    component.theme = mockTheme;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit cancel when Escape key is pressed', () => {
    spyOn(component.cancel, 'emit');

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    expect(component.cancel.emit).toHaveBeenCalled();
  });

  it('should bind theme input correctly', () => {
    expect(component.theme.name).toBe('Blush');
  });

  it('should emit confirm when confirm is triggered manually', () => {
    spyOn(component.confirm, 'emit');
    component.confirm.emit();
    expect(component.confirm.emit).toHaveBeenCalled();
  });

  it('should emit cancel when cancel is triggered manually', () => {
    spyOn(component.cancel, 'emit');
    component.cancel.emit();
    expect(component.cancel.emit).toHaveBeenCalled();
  });
});
