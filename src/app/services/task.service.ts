import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Task } from '../models/task.model';
import { BehaviorSubject } from 'rxjs';

const TASKS_KEY = 'petalTasks';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private _tasks = new BehaviorSubject<Task[]>([]);
  tasks$ = this._tasks.asObservable();

  get tasks(): Task[] {
    return this._tasks.value;
  }

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.loadTasks();
  }

  addTask(label: string): void {
    const updated = [...this.tasks, { label, completed: false }];
    this._tasks.next(updated);
    this.saveTasks();
  }

  removeTask(index: number): void {
    const updated = [...this.tasks];
    updated.splice(index, 1);
    this._tasks.next(updated);
    this.saveTasks();
  }

  toggleCompleted(index: number): void {
    const updated = [...this.tasks];
    updated[index] = { ...updated[index], completed: !updated[index].completed };
    this._tasks.next(updated);
    this.saveTasks();
  }

  private loadTasks(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const saved = localStorage.getItem(TASKS_KEY);
    if (saved) {
      try {
        this._tasks.next(JSON.parse(saved));
      } catch {
        console.warn('[TaskService] Failed to parse saved tasks. Starting with empty list.');
      }
    }
  }

  private saveTasks(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    localStorage.setItem(TASKS_KEY, JSON.stringify(this._tasks.value));
  }
}