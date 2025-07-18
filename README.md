# 🌸 Petal Timer

A cute and modern Pomodoro timer built for realistic 8–5 workdays — complete with customizable sessions, motivating badges, themeable visuals, and real-time progress tracking. Stay focused, structured, and stylish.

---

## ✨ Features

- ⏱ **Workday-Based Pomodoro Flow**: Aligns with a standard 8–5 schedule.
- 🛠 **Customizable Sessions**: Set your own preferred hours.
- 📊 **Live Progress Tracker**: View your progress through the day at a glance.
- 🌸 **Badges & Confetti**: Earn adorable rewards for every session you complete.
- 🔔 **Sound Alerts**: Distinct alerts for work and break transitions.
- 🎨 **Theme Support**: Choose from Blush, Galaxy, and Minty Fresh themes.
- 🌐 **Offline-Ready** – Saves your preferences using local storage.
- 📱 **Fully Responsive** – Optimized for desktop and mobile.

---

## 🧱 Tech Stack

- [Angular](https://angular.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [RxJS](https://rxjs.dev/) & Component Store
- [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) for user persistence
- [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 🚀 Getting Started

1. Clone the repo  
   ```bash
   git clone https://github.com/avaj0hnson/petal-timer.git
   cd petal-timer
2. Install dependencies
   ```bash
   npm install
3. Run Locally
   ```bash
   ng serve

---

## 📁 Project Structure
```text
src/
├── app/
│ ├── badge-playground/ # Badges rewarded for completed sessions
│ ├── pomodoro/ # Core Pomodoro timer logic and components
│ ├── settings-modal/ # Settings and customization UI
│ ├── timeline/ # Session history and visual progress timeline
│ ├── services/ # Sound, theme, conftetti, and timer logic
│ ├── models/ # Type definitions for themes and settings
│ ├── constants/ # Theme configurations and badge sets
│ ├── app.component.* # Root component files
│ ├── app.config.ts # App-level configuration
│ ├── app.config.server.ts # Server-side config
├── assets/ # Static assets
├── index.html # Main HTML entry point
├── main.ts # Client bootstrap
├── main.server.ts # Server-side bootstrap
├── styles.scss # Global styles
```

---

## 🧪 Testing

Each component includes unit tests using Angular’s built-in test utilities and `HttpClientTestingModule`.

To run tests:
```bash
ng test
```
[![codecov](https://codecov.io/gh/avaj0hnson/petal-timer/branch/main/graph/badge.svg)](https://codecov.io/gh/avaj0hnson/petal-timer)
