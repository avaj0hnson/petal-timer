# 🌸 Petal Timer

A cute, modern Pomodoro timer built for real 8–5 workdays — complete with customizable sessions, live progress tracking, and motivating visuals. Designed to help you stay focused, structured, and stylish.

---

## ✨ Features

- ⏱ **Workday-Based Pomodoro Flow**: Aligns with a standard 8–5 schedule,
- 🛠 **Customizable Sessions**: Set your own preferred hours.
- 📊 **Live Progress Tracker**: See your session history and performance over time.
- 🌸 **Cute UI & Rewards**: Light pink theme with soft animations and collectible badges after each session.
- 🔔 **Sound Alerts**: Customizable sounds to notify you when it’s time to switch.
- 📱 **Responsive Design**: Looks great across desktop and mobile.

---

## 🧱 Built With

- [Angular](https://angular.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [RxJS](https://rxjs.dev/) & Component Store
- [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) for user persistence

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
│ ├── badge-playground/ # Experimental or dev-only badge testing
│ ├── pomodoro/ # Core Pomodoro timer logic and components
│ ├── settings-modal/ # Settings and customization UI
│ ├── timeline/ # Session history and visual progress timeline
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
