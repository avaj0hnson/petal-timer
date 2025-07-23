# 🌸 Petal Timer
[![codecov](https://codecov.io/gh/avaj0hnson/petal-timer/branch/main/graph/badge.svg)](https://codecov.io/gh/avaj0hnson/petal-timer)

A cute and modern Pomodoro timer built for realistic 8–5 workdays — complete with customizable sessions, motivating badges, themeable visuals, and real-time progress tracking. Stay focused, structured, and stylish.

<img src="public/preview.png" alt="Petal Timer Preview" style="border-radius: 1rem; max-width: 100%; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />

---

## ✨ Features

- ⏱ **Workday-Based Pomodoro Flow**: Aligns with a standard 8–5 schedule.
- 🛠 **Customizable Sessions**: Set your own preferred hours and breaks.
- 📊 **Live Progress Tracker**: See your daily productivity unfold.
- 🌸 **Badges & Confetti**: Earn adorable rewards for every session.
- 🔔 **Sound Alerts**: Gentle reminders to switch between focus and rest.
- 🎨 **Theme Support**: Choose from Blush, Galaxy, Minty Fresh, and more.
- 🌐 **Offline-Ready** – Saves your preferences with local storage.
- 📱 **Responsive Design** – Works seamlessly on mobile and desktop.

---

## 🧱 Tech Stack

- [Angular](https://angular.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [RxJS](https://rxjs.dev/) & Component Store
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
petal-timer/
├── .github/               # GitHub Actions for testing and coverage
├── public/                # Static assets (favicon, sounds, preview image)
│   └── sounds/            # Timer sounds
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   └── pomodoro/              # Main Pomodoro timer page
│   │   ├── components/
│   │   │   ├── badge-playground/     # Badge reward system
│   │   │   ├── info-modal/           # Privacy and attribution modal
│   │   │   ├── settings-modal/       # Timer settings modal
│   │   │   ├── skip-confirm-modal/   # Confirmation before skipping
│   │   │   ├── task-list-modal/      # To-do list modal
│   │   │   └── timeline/             # Daily progress bar
│   │   ├── constants/                # Theme colors and default values
│   │   ├── models/                   # TypeScript interfaces
│   │   └── services/                 # Timer, theme, task, and sound logic
│   └── styles.scss                  # Global styles
├── angular.json           # Angular CLI configuration
├── tailwind.config.js     # Tailwind theme setup
├── package.json           # Dependencies and scripts
└── README.md              # You are here 🌸
```

---

## 🧪 Testing

This project includes unit tests for all major components.

```bash
ng test --code-coverage
```

View full coverage on [Codecov](https://app.codecov.io/gh/avaj0hnson/petal-timer)
