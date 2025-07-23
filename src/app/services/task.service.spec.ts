import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { Task } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty task list', () => {
    expect(service.tasks).toEqual([]);
  });

  it('should add a new task', () => {
    service.addTask('Test Task');
    expect(service.tasks.length).toBe(1);
    expect(service.tasks[0]).toEqual({ label: 'Test Task', completed: false });
  });

  it('should remove a task by index', () => {
    service.addTask('First');
    service.addTask('Second');
    service.removeTask(0);
    expect(service.tasks.length).toBe(1);
    expect(service.tasks[0].label).toBe('Second');
  });

  it('should toggle task completion status', () => {
    service.addTask('Test');
    expect(service.tasks[0].completed).toBeFalse();
    service.toggleCompleted(0);
    expect(service.tasks[0].completed).toBeTrue();
    service.toggleCompleted(0);
    expect(service.tasks[0].completed).toBeFalse();
  });

  it('should persist tasks to localStorage', () => {
    service.addTask('Persist me');
    const saved = localStorage.getItem('petalTasks');
    expect(saved).toContain('Persist me');
  });

  it('should load tasks from localStorage on init', () => {
    const mockTasks: Task[] = [{ label: 'Stored task', completed: true }];
    localStorage.setItem('petalTasks', JSON.stringify(mockTasks));

    const loadedService = new TaskService();
    expect(loadedService.tasks).toEqual(mockTasks);
  });
});
