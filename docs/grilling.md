# Plant Care Web App — Grilling Questionnaire & Decisions

This document contains architectural, design, and implementation decisions resolved during the grilling phase.

---

## Batch 1: Architecture, Authentication & Device Contract

### Q1.1: Device Identity & Multi-Plant Scope
- **Question:** Does the dashboard support only a single hardcoded device (`plant1`) for this college demonstration, or does the user select/pair multiple devices dynamically?
- **Decision:** Multi-device support (device selector dropdown e.g., `plant1`, `plant2`).
- **Status:** [ANSWERED]

### Q1.2: Authentication & User Onboarding
- **Question:** How should authentication be handled for evaluation and grading?
- **Decision:** Both Email/Password login and 1-click "Guest / Demo Evaluator" login.
- **Status:** [ANSWERED]

### Q1.3: ESP32 Hardware Authentication in RTDB
- **Question:** How does the ESP32 hardware authenticate against Firebase Realtime Database?
- **Decision:** Database secret / token auth via ESP32 Arduino Firebase library writing to `plants/{deviceId}/reading`.
- **Status:** [ANSWERED]

### Q1.4: Telemetry Granularity & History Retention
- **Question:** How is reading history stored for the A-10 chart?
- **Decision:** Live reading at `plants/{deviceId}/reading` + historical logs appended at `plants/{deviceId}/history/{pushId}`.
- **Status:** [ANSWERED]

### Q1.5: Project Directory & Existing Workspace
- **Question:** The current active directory is `Clerkly-clean` (an existing hackathon repo). Where should this Plant Care project live?
- **Decision:** Dedicated clean folder on Desktop at `c:\Users\Pruthviraj\Desktop\plant-care-app`.
- **Status:** [ANSWERED]

---

## Batch 2: Offline Detection, Edge Cases & Hardware Safety

### Q2.1: Command Timeout & Stale Command Defense
- **Question:** When the user clicks "Water Now", what exact timestamp comparison and UI state should indicate success vs timeout?
- **Decision:** Show optimistic spinner; if ESP32 acknowledges by flipping `reading.pump_active = true` (or clearing `command.water_now`) within 10s, show success toast; otherwise show "Device did not respond".
- **Status:** [ANSWERED]

### Q2.2: Offline Threshold & UI Degradation
- **Question:** When `now - reading.ts > 30s`, how strictly should the UI lock down?
- **Decision:** Prominent warning banner at the top; disable "Water Now" button and "Grow light" controls; show "Last seen X seconds ago" counter.
- **Status:** [ANSWERED]

### Q2.3: Grow Light State Model
- **Question:** Is the Grow light strictly manual, or does it have an automated schedule in firmware?
- **Decision:** Dual mode: Toggle between "Automatic Schedule" (e.g., 12h ON / 12h OFF stored in profile) and "Manual Override" (instant ON/OFF).
- **Status:** [ANSWERED]

### Q2.4: Plant Preset Defaults
- **Question:** What are the exact default moisture thresholds for the presets?
- **Decision:**
  - Succulent / Cactus: 15% – 30% moisture (pulse: 2s)
  - Foliage / Tropical (e.g. Monstera): 40% – 65% moisture (pulse: 4s)
  - Herbs (e.g. Basil, Mint): 50% – 70% moisture (pulse: 3s)
  - Fern / Moisture-loving: 60% – 80% moisture (pulse: 5s)
- **Status:** [ANSWERED]

### Q2.5: Water Pump Hardware Duration Safety
- **Question:** How is the watering pulse duration configured?
- **Decision:** Fixed 3-second pulse for manual "Water Now" button, with firmware safety cap at 10 seconds.
- **Status:** [ANSWERED]

---

## Batch 3: UI/UX, Presentation & Demo Mode

### Q3.1: Mobile Breakpoint & Viewport Target
- **Question:** What is the primary target device form factor?
- **Decision:** Full fluid multi-column desktop dashboard that collapses cleanly to mobile (fully functional at 360px).
- **Status:** [ANSWERED]

### Q3.2: Demo Mode Behavior
- **Question:** How does ticket A-11 (Demo Mode) operate?
- **Decision:** In-memory mock simulation loop with zero hardware and zero live Firebase credentials required for grading/demos.
- **Status:** [ANSWERED]

### Q3.3: Theme & Color Palette
- **Question:** What visual aesthetic should the design system (A-00) emphasize?
- **Decision:** Dual Theme: Both Dark and Light modes supported with a smooth toggle switch in the header.
- **Status:** [ANSWERED]

### Q3.4: History Graph Granularity
- **Question:** What time ranges should the history chart display?
- **Decision:** Dual toggle views: Last 1 Hour (realtime resolution) and Last 24 Hours (daily trend).
- **Status:** [ANSWERED]

### Q3.5: Deployment Target
- **Question:** Where will the app be hosted for final demo/grading?
- **Decision:** Vercel (zero-config, high-performance static PWA hosting).
- **Status:** [ANSWERED]
