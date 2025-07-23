import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListModalComponent } from './task-list-modal.component';
import { TaskService } from '../../services/task.service';
import { of } from 'rxjs';
import { Theme } from '../../models/theme.model';

describe('TaskListModalComponent', () => {
  let component: TaskListModalComponent;
  let fixture: ComponentFixture<TaskListModalComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;

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
    mockTaskService = jasmine.createSpyObj('TaskService', ['addTask'], {
      tasks$: of([
        { label: 'Test Task', completed: false },
        { label: 'Another Task', completed: true }
      ])
    });

    await TestBed.configureTestingModule({
      imports: [TaskListModalComponent],
      providers: [{ provide: TaskService, useValue: mockTaskService }]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListModalComponent);
    component = fixture.componentInstance;
    component.theme = mockTheme;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display tasks from the task service', () => {
    expect(component.tasks.length).toBe(2);
    expect(component.tasks[0].label).toBe('Test Task');
  });

  it('should call addTask on the service when addTask is triggered', () => {
    component.newTaskLabel = 'New Task';
    component.addTask();
    expect(mockTaskService.addTask).toHaveBeenCalledWith('New Task');
    expect(component.newTaskLabel).toBe('');
  });

  it('should not call addTask if newTaskLabel is empty or whitespace', () => {
    component.newTaskLabel = '   ';
    component.addTask();
    expect(mockTaskService.addTask).not.toHaveBeenCalled();
  });

  it('should emit close when Escape is pressed', () => {
    spyOn(component.close, 'emit');
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
    expect(component.close.emit).toHaveBeenCalled();
  });
});
