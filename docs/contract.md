# Plant Care System — Firebase Realtime Database Contract

## Overview
This contract defines the communication protocol between the **ESP32 Hardware Node** and the **Web Application Dashboard**.
All communications flow through Firebase Realtime Database (RTDB) under the device root path: `plants/{deviceId}/` (default device ID: `plant1`).

---

## Device Path Hierarchy

```
plants/
  └── {deviceId}/                 (e.g., "plant1", "plant2")
        ├── reading/              (Device writes, Dashboard reads)
        ├── profile/              (Dashboard writes, Device reads)
        ├── command/              (Dashboard writes, Device reads & consumes)
        └── history/              (Device appends timestamped telemetry)
              └── {pushId}/
```

---

## 1. `plants/{deviceId}/reading`
**Writer:** ESP32 Device Only  
**Reader:** Authenticated Owner / Dashboard  
**Update Frequency:** Every 5–15 seconds while online.

### Schema
```json
{
  "moisture": 42.5,
  "temperature": 24.8,
  "pump_active": false,
  "light_active": true,
  "ts": 1794145800
}
```

### Field Definitions & Validations
- `moisture` (number, 0.0 – 100.0): Volumetric soil moisture percentage. Clamped by firmware between 0 and 100.
- `temperature` (number, -10.0 – 60.0): Ambient temperature in degrees Celsius (°C).
- `pump_active` (boolean): `true` if the water pump relay is currently energized.
- `light_active` (boolean): `true` if the Grow light relay/PWM is currently on.
- `ts` (integer): Unix timestamp in seconds (UTC) of when the reading was taken.

### Offline Detection Rule
If `currentTimeInSeconds - reading.ts > 30`, the dashboard MUST flag the device state as **OFFLINE** and disable live manual controls with a warning banner.

---

## 2. `plants/{deviceId}/profile`
**Writer:** Authenticated Owner / Dashboard  
**Reader:** ESP32 Device  
**Purpose:** Sets the automated watering thresholds, preset behavior, and Grow light schedule.

### Schema
```json
{
  "preset_name": "Monstera / Tropical",
  "moisture_min": 40.0,
  "moisture_max": 65.0,
  "water_duration_s": 4,
  "light_mode": "auto",
  "light_schedule_hours": 12,
  "updated_at": 1794145800
}
```

### Field Definitions & Validations
- `preset_name` (string, max 32 chars): Name of the selected plant preset.
- `moisture_min` (number, 0 – 100): Moisture percentage below which the ESP32 triggers automatic watering. Must be strictly `< moisture_max`.
- `moisture_max` (number, 0 – 100): Target moisture percentage where watering stops.
- `water_duration_s` (number, 1 – 10): Pump pulse duration in seconds per watering cycle. **Firmware safety cap: 10 seconds maximum**.
- `light_mode` (string: `"auto"` | `"manual"` | `"off"`): Mode governing the Grow light.
- `light_schedule_hours` (number, 1 – 24): Daily photoperiod duration in auto mode (default: 12 hours).
- `updated_at` (integer): Unix timestamp in seconds when the profile was saved.

---

## 3. `plants/{deviceId}/command`
**Writer:** Authenticated Owner / Dashboard  
**Reader:** ESP32 Device  
**Purpose:** Manual user triggers (e.g. "Water Now", toggle "Grow light").

### Schema
```json
{
  "water_now": false,
  "water_duration_s": 3,
  "grow_light": true,
  "ts": 1794145820
}
```

### Field Definitions & Validations
- `water_now` (boolean): Sent as `true` to request an immediate manual watering pulse. Firmware resets to `false` upon execution.
- `water_duration_s` (number, 1 – 10): Duration in seconds for this manual pulse. Hard-capped at 10s by hardware firmware.
- `grow_light` (boolean): `true` to switch the Grow light ON, `false` to switch OFF.
- `ts` (integer): Unix timestamp in seconds when command was issued.

### Safety Rule (Stale Command Protection)
**The ESP32 firmware ignores any command where `currentTime - command.ts > 30 seconds`.**  
This prevents flood damage if the device reconnects after being offline and encounters an old "water now" command.

---

## 4. `plants/{deviceId}/history/{pushId}`
**Writer:** ESP32 Device (appends periodically, e.g. every 5–15 minutes)  
**Reader:** Authenticated Dashboard (for A-10 History Chart)

```json
{
  "moisture": 41.2,
  "temperature": 24.5,
  "ts": 1794142200
}
```

---

## 5. Security Rules Summary
- `plants/{deviceId}/reading`: `.write = "auth != null"`, `.read = "auth != null"`
- `plants/{deviceId}/profile`: `.write = "auth != null"`, `.read = "auth != null"`
- `plants/{deviceId}/command`: `.write = "auth != null"`, `.read = "auth != null"`
- `plants/{deviceId}/history`: `.write = "auth != null"`, `.read = "auth != null"`
- Firebase rules must **never** be set to `true` for public read or write.
