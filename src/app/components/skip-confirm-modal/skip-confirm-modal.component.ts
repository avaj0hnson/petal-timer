import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Theme } from '../../models/theme.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skip-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skip-confirm-modal.component.html',
  styleUrl: './skip-confirm-modal.component.scss'
})
export class SkipConfirmModalComponent {
  @Input() theme!: Theme;
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    this.cancel.emit();
  }
}
