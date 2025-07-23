import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Theme } from '../../models/theme.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-modal.component.html',
  styleUrl: './info-modal.component.scss'
})
export class InfoModalComponent {
  @Input() theme!: Theme;
  @Output() close = new EventEmitter<void>();

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    this.close.emit();
  }
}
