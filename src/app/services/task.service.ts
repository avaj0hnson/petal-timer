import { Injectable } from '@angular/core';
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

  constructor() {
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
    updated[index].completed = !updated[index].completed;
    this._tasks.next(updated);
    this.saveTasks();
  }

  private loadTasks(): void {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(TASKS_KEY);
      if (saved) {
        this._tasks.next(JSON.parse(saved));
      }
    }
  }

  private saveTasks(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TASKS_KEY, JSON.stringify(this._tasks.value));
    }
  }
}