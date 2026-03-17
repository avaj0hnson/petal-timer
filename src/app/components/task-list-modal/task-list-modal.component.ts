import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Theme } from '../../models/theme.model';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list-modal.component.html',
  styleUrl: './task-list-modal.component.scss'
})
export class TaskListModalComponent implements OnInit, OnDestroy {
  @Input() theme!: Theme;
  @Output() close = new EventEmitter<void>();
  newTaskLabel = '';
  tasks: Task[] = [];
  private destroy$ = new Subject<void>();

  constructor(public taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.tasks$.pipe(takeUntil(this.destroy$)).subscribe(t => this.tasks = t);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addTask(): void {
    const trimmed = this.newTaskLabel.trim();
    if (trimmed) {
      this.taskService.addTask(trimmed);
      this.newTaskLabel = '';
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.close.emit();
  }

  get taskCompletionPercentage(): number {
    if (this.tasks.length === 0) return 0;
    const completed = this.tasks.filter(t => t.completed).length;
    return (completed / this.tasks.length) * 100;
  }

  get taskCompletionLabel(): string {
    const completed = this.tasks.filter(t => t.completed).length;
    return `${completed} of ${this.tasks.length} tasks complete 🌱`;
  }
}
