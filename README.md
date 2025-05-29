# ⏳ Pomodoro Timer – Stay Focused, Stay Sharp

A minimalist, offline Pomodoro timer desktop app built with **React**, **Electron Forge**, **Vite**, and **TypeScript**.

---

## 🎯 Target Users

Freelancers, students, and professionals looking for a simple, distraction-free focus timer with session tracking and dark mode — all in a lightweight desktop app.

---

## 🧩 Core Features

### 1. ⏱️ Pomodoro Timer Engine

- Classic 25/5 Pomodoro intervals
- Configurable durations (optional)
- Start / Pause / Reset controls
- Sound notification when session ends

### 2. 🌗 Light/Dark Mode Toggle

- Toggle between light and dark UI
- Preference saved in `localStorage`
- Auto-applies on next launch

### 3. 🧠 Daily Session Logging

- Logs each focus session by date
- Tracks total focus minutes per day
- Stored in `localStorage` or JSON (optional future)

---

## 📊 Basic Dashboard (Planned)

- Total Pomodoros today
- Time spent in focus this week
- Simple bar graph of recent days

---

## 🧼 Constraints

- Desktop only (Electron-based)
- No sync or cloud storage
- No authentication or login
- No distractions, just focus

---

## 🧪 Optional Nice-to-Haves (If Time Permits)

- Notification popups on session end
- Custom session and break durations
- Long break after every 4 Pomodoros
- Export session logs (CSV/JSON)
- Multi-language UI (starting with Farsi + English)
- Productivity streaks or gamified stats

---

## 🖥 UI/UX Design Notes

- Simple single-window interface
- Large timer display with control buttons
- Auto theme detection (optional)
- Minimal use of colors for a calming UI

---

## ✅ MVP Checklist

- ✅ Pomodoro session timer
- ✅ Manual control buttons
- ✅ Dark mode toggle
- ✅ Daily session log

---

## 🛠 Technology Stack

- **Frontend:** React + Vite + TypeScript
- **Desktop Runtime:** Electron Forge
- **Styling:** CSS Modules or Tailwind (planned)
- **Data Storage:** LocalStorage (JSON-based logging)
- **Build Tooling:** Vite config split for main/preload/renderer

---

## 📦 Installation & Development

### 1. Clone the repo

```bash
git clone https://github.com/your-username/pomodoro-timer.git
cd pomodoro-timer
```
