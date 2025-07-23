import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
export class TaskListModalComponent {
  @Input() theme!: Theme;
  @Output() close = new EventEmitter<void>();
  newTaskLabel = '';
  tasks: Task[] = [];

  constructor(public taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.tasks$.subscribe(t => this.tasks = t);
  }

  addTask(): void {
    const trimmed = this.newTaskLabel.trim();
    if (trimmed) {
      this.taskService.addTask(trimmed);
      this.newTaskLabel = '';
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    this.close.emit();
  }
}
