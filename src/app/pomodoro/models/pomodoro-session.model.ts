export interface PomodoroSession {
    type: 'work' | 'break';
    duration: number;
    completed: boolean;
}