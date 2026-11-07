# Team Integration & Handover Notes — Household Plant Caring System
**Project:** PlantCare Mobile-First PWA & ESP32 Node  
**Author:** Member 4 (App & UI/UX Lead - Pruthviraj Kale)  
**Date:** November 2026  
**Status:** Complete & Production Ready  

---

## 🎯 Executive Overview
This document is the official technical handover guide for our 5-person engineering team. It provides each member with the exact interface contracts, payload schemas, pin assignments, safety rules, and validation checklists required to integrate their components with the completed web dashboard.

---

## 👤 Member 1: Firmware & ESP32 Microcontroller Lead

### 1.1 Responsibilities
- ESP32 WiFi connection, reconnection loop, and NTP time synchronization.
- Periodic telemetry transmission to `/devices/{deviceId}/telemetry/reading`.
- Listening to `/devices/{deviceId}/command` for manual overrides.
- Maintaining autonomous watering logic based on `/devices/{deviceId}/profile`.

### 1.2 Telemetry Publish Specification
Publish sensor readings to Firebase Realtime Database at least once every **5 seconds** (or when values change significantly):
- **Path:** `/devices/{deviceId}/telemetry/reading`
- **Method:** `set` or `update`
- **JSON Structure:**
  ```json
  {
    "moisture_percent": 42.5,
    "temperature_c": 24.1,
    "pump_active": false,
    "grow_light_active": true,
    "timestamp": 1731000000000
  }
  ```
> [!IMPORTANT]
> **Timestamp requirement:** The `timestamp` field MUST be epoch milliseconds (`Date.now()` or NTP synced). If `now - timestamp > 30000` (30 seconds), the dashboard will flag the hardware as **OFFLINE** and disable manual controls to protect the plant.

### 1.3 Command Handling & Handshake
Listen to stream events on `/devices/{deviceId}/command`:
```json
{
  "water_now": true,
  "pump_duration_seconds": 3,
  "grow_light_mode": "manual",
  "grow_light_manual_state": true,
  "timestamp": 1731000000000
}
```

#### Handshake Workflow for "Water Now":
1. **Stale Command Check:** Verify `current_time - command.timestamp < 30000`. If older than 30s, discard immediately!
2. **Safety Duration Clamp:** Ensure pump runs for `min(command.pump_duration_seconds, 10)` seconds. **NEVER exceed 10 seconds** under any circumstances.
3. **Execution & Acknowledgment:**
   - Turn pump relay ON (`HIGH`).
   - Immediately update `/devices/{deviceId}/telemetry/reading/pump_active = true`.
   - Clear the command trigger: set `/devices/{deviceId}/command/water_now = false`.
   - Wait for pulse duration (non-blocking `millis()` timer).
   - Turn pump relay OFF (`LOW`).
   - Update `/devices/{deviceId}/telemetry/reading/pump_active = false`.

### 1.4 Grow Light Control Logic
- If `command.grow_light_mode == "manual"`:
  - Relay state matches `command.grow_light_manual_state`.
- If `command.grow_light_mode == "auto"`:
  - Relay is turned ON during the scheduled photoperiod (e.g. 12 hours ON / 12 hours OFF based on `profile.photoperiod_hours` and local NTP clock).
- Remember: The actuator must be documented as **"Grow light"** (Full-Spectrum LED), never "UV light".

---

## 👤 Member 2: Hardware & Circuit Design Lead

### 2.1 Sensor & Actuator Pin Assignment Reference
Standard pinout used for our ESP32 dev kit:

| Component | ESP32 Pin | Interface Type | Operating Voltage | Notes |
|---|---|---|---|---|
| **Capacitive Soil Moisture Sensor v1.2** | `GPIO 34` (ADC1_CH6) | Analog Input | 3.3V VCC | Use capacitive to prevent galvanic corrosion |
| **DHT22 (AM2302) Temperature/Humidity** | `GPIO 4` | 1-Wire Digital | 3.3V or 5V | 10k pull-up resistor between VCC and Data |
| **Water Pump Relay Module** | `GPIO 26` | Digital Output | 5V Coil / 3.3V Logic | Active LOW or HIGH depending on optocoupler |
| **Grow Light Relay / MOSFET** | `GPIO 27` | Digital Output | 5V or 12V DC Rail | Drives full-spectrum Grow light LED fixture |
| **Status LED (Network / Heartbeat)** | `GPIO 2` | Digital Output | 3.3V (Built-in) | Blinks 1Hz during normal WiFi operation |

### 2.2 Electrical Isolation & Safety
1. **Flyback Diode:** The submersible DC water pump is an inductive load. An antiparallel 1N4007 flyback diode across pump terminals is required if using direct transistor/MOSFET drive to protect from inductive back-EMF spikes.
2. **Decoupling Capacitors:** Place a $100\mu\text{F}$ electrolytic capacitor across the 5V power supply rail near the relay and pump to absorb inrush current transients and prevent ESP32 brownout resets during pump turn-on.
3. **Optocoupler Isolation:** Verify relay board jumper (`JD-VCC`) is isolated if sharing a power supply with the ESP32.

---

## 👤 Member 3: Backend & Firebase Cloud Lead

### 3.1 Firebase Setup & Rules
The project uses Firebase Realtime Database. Deploy the audited rules from [`database.rules.json`](../database.rules.json):

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Google Firebase
firebase login

# Set active project
firebase use your-plantcare-project-id

# Deploy Realtime Database rules
firebase deploy --only database
```

### 3.2 Security Rules Highlights
- Anonymous read/write is strictly set to `false`.
- Authentication (`auth != null`) required for all telemetry and control nodes.
- Database-level validation rule caps `pump_duration_seconds` to $\le 10$:
  ```json
  "pump_duration_seconds": {
    ".validate": "newData.isNumber() && newData.val() >= 1 && newData.val() <= 10"
  }
  ```
- Protects against malicious scripts or rogue commands flooding the physical plant with water.

---

## 👤 Member 4: App & UI/UX Lead (Pruthviraj Kale)

### 4.1 Completed Deliverables
- **Mobile-First PWA:** Responsive from 360px smartphones to high-res desktop monitors.
- **Service Worker & Manifest:** Offline caching and home-screen installability.
- **Built-in Demo Mode:** Allows testing without hardware via synthetic telemetry generator.
- **70 Automated Unit & Component Tests:** 100% passing across 13 test suites.
- **Dual-Mode Actuators:** Instant manual controls and automated photoperiod scheduling.

### 4.2 Local Running & Development
```bash
npm install
npm run dev        # Dev server on http://localhost:3000
npm test           # Run 70 Vitest tests
npm run mock-device # Run CLI mock device
npm run build      # Production bundle verification
```

---

## 👤 Member 5: QA & Project Documentation Lead

### 5.1 Verification Checklist for Project Submission / Demo Day
Before live presentation or evaluation by professors, execute this step-by-step checklist:

| Check | Action | Expected Outcome | Pass/Fail |
|---|---|---|---|
| **1. Zero Hardware Mode** | Open app, toggle "Demo Mode" ON | Moisture fluctuates ~45%, temperature ~24°C, chart displays trends | [ ] |
| **2. Preset Switching** | Click "Succulent / Cactus" preset | Targets change to 15%–30%, badge updates, notification toast confirms | [ ] |
| **3. Water Now Pulse** | Click "Water Now" button in Demo Mode | Spinner shows, simulated pump activates, soil moisture increases +15% | [ ] |
| **4. Grow Light Toggle** | Switch Grow light to Manual, toggle ON | Actuator status updates to ACTIVE, switch shows ON | [ ] |
| **5. Strict Label Check** | Inspect all screens for wording | Strictly "Grow light" everywhere, zero mentions of "UV light" | [ ] |
| **6. Custom Form Bounds** | Set Min: 60%, Max: 40% in Custom Settings | Form displays error: "Minimum moisture cannot exceed maximum moisture", Save button disabled | [ ] |
| **7. Offline Simulation** | Stop ESP32 transmission for 35 seconds | Red "Hardware Offline" banner appears with counter, controls disabled | [ ] |
| **8. Theme Toggle** | Click Sun/Moon icon | Dark mode activates with accessible high-contrast color tokens | [ ] |
| **9. Mobile Viewport** | Resize Chrome DevTools to 360px width | Zero horizontal overflow, single-column stacked layout, tap targets $\ge 44$px | [ ] |
| **10. Test Suite** | Execute `npm test` in terminal | 13 test files passed, 70 tests passed, 0 failures | [ ] |

---

## 📞 Support & Coordination
For questions regarding the frontend codebase, hooks, or RTDB integration contracts, contact Pruthviraj Kale or refer to [`contract.md`](contract.md).
