# Plant Care Web App — Ticket Backlog & Pipeline

## Pipeline Overview
- Each ticket is implemented on its own git branch: `feat/A-xx-<name>`.
- Workflow per ticket: **Plan → Tests First → Implementation → Review → Security Audit → Merge**.
- Priority / Cuts if time-constrained:
  - **Can cut:** A-10 (History Chart), Custom profile advanced editing, PWA install prompts.
  - **CANNOT cut:** A-05 (Dashboard), A-06 (Offline state), A-07 (Plant Presets), A-11 (Demo Mode).

---

## Ticket Specifications

### `A-00`: Design System & Foundations
- **Goal:** Establish Tailwind design tokens, typography, color palette, UI component primitives (`Button`, `Card`, `Badge`, `ToggleSwitch`, `ThresholdSlider`, `StatusIndicator`).
- **Requirements:** Mobile-first, must render crisply down to 360px viewport width. Dual Theme (Dark/Light).
- **Rules:** Clean semantic HTML, no raw inline styles.

### `A-01`: Project Scaffold & Tooling Setup
- **Goal:** Initialize React + Vite + TypeScript application with Tailwind CSS, Vitest, React Testing Library, ESLint, Prettier, and Playwright.
- **Deliverables:** Working dev server script, clean test harness, `.env.example` file (never `.env` committed).

### `A-02`: Firebase Configuration, Security Rules & Local Emulator
- **Goal:** Set up Firebase client SDK (Auth + RTDB), write `database.rules.json` enforcing strict ownership and schema constraints, configure Firebase Emulator Suite.
- **Rules:** Rules must NEVER be `true` for open read/write.

### `A-03`: Mock ESP32 Hardware Simulator
- **Goal:** Lightweight developer script/mock service to simulate real-time ESP32 telemetry writes to `plants/{deviceId}/reading` and listen for `plants/{deviceId}/command`.
- **Purpose:** Decouple frontend UI development from physical hardware availability.

### `A-04`: Authentication & Protected Routing
- **Goal:** Robust dual authentication (Email/Password + 1-click "Guest Evaluator" demo session). Route protection.
- **States:** Loading spinner, error toast, empty session redirect.

### `A-05`: Live Monitoring Dashboard
- **Goal:** Display real-time soil moisture gauge/card, ambient temperature display, pump status badge, and Grow light status.
- **States:** Loading skeleton, empty state, and live updating view via Firebase RTDB listeners.

### `A-06`: Offline Detection & Warning Banner
- **Goal:** Detect if `Date.now()/1000 - reading.ts > 30s`.
- **Behavior:** Display high-visibility "Device Offline" banner, disable active command buttons ("Water Now"), and show last-seen timestamp.

### `A-07`: Plant Presets & Profile Synchronization
- **Goal:** Preset selection cards (Succulent: 15–30%, Tropical: 40–65%, Herbs: 50–70%, Fern: 60–80%).
- **Behavior:** Selecting a preset writes preconfigured thresholds and pulse duration to `plants/{deviceId}/profile`.

### `A-08`: Custom Settings & Input Validation
- **Goal:** Allow user to set custom `moisture_min`, `moisture_max`, and pump duration.
- **Validation:** Ensure `min < max`, `min >= 0`, `max <= 100`, pump duration `1s <= d <= 10s`. Show immediate validation errors. No `eval` or unsafe parsing.

### `A-09`: Manual Controls (Water Now & Grow Light)
- **Goal:** "Water Now" button and "Grow light" dual-mode toggle switch.
- **Terminology:** MUST label as **"Grow light"**, NEVER "UV light".
- **Rules:** Disable button when pump is active or device is offline. Writes timestamped payload to `plants/{deviceId}/command`.

### `A-10`: Telemetry History Chart (Optional cut if short on time)
- **Goal:** Render moisture and temperature trends using Recharts with 1-hour and 24-hour toggles.
- **Requirements:** Responsive container down to 360px without horizontal scrollbar blowout.

### `A-11`: Demo Mode (Zero-Hardware Presentation Mode)
- **Goal:** An in-memory mock simulator loop allowing presentation and grading with zero physical hardware and zero live Firebase credentials.

### `A-12`: PWA Manifest, Service Worker & UI Polish
- **Goal:** Web app manifest, theme colors, home-screen icons, offline asset caching, and touch-target polish.

### `A-13`: Comprehensive Security Review
- **Goal:** Audit Firebase RTDB rules, verify no `.env` or credentials leaked, verify no `dangerouslySetInnerHTML`, run automated security tests.

### `A-14`: Project Hand-over & Documentation
- **Goal:** Final deployment check (Vercel), documentation handover notes for teammate integration, clean README.
