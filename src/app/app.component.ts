import { Component } from '@angular/core';
import { PomodoroComponent } from "./pages/pomodoro/pomodoro.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PomodoroComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
