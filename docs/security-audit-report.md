# Security Audit Report — Household Plant Caring System Dashboard
**Ticket:** A-13 (Automated Security Audit & Hardening Verification)  
**Date:** November 2026  
**Auditor / Lead:** Member 4 (App & UI/UX Lead)  
**Project:** PlantCare Mobile-First PWA

---

## 1. Executive Summary
This document records the results of the comprehensive security audit conducted against the PlantCare web dashboard, Firebase Realtime Database rules, environment management, and dependency hygiene.

All automated and manual security assertions passed with zero vulnerabilities detected.

---

## 2. Audit Matrix & Findings

| Audit Check | Target / Rule | Result | Verification Details |
|---|---|---|---|
| **Zero Code Injection** | `eval()`, `new Function()`, `dangerouslySetInnerHTML` | **PASS** | Verified 0 occurrences across all source files in `src/` |
| **Strict Nomenclature** | Actuator label: strictly `"Grow light"`, 0 `"UV light"` | **PASS** | Verified 0 occurrences of `UV light` or `uv-light` in application source |
| **Secret Protection** | `.gitignore` covers `.env`, `.env.local`, credentials | **PASS** | `.gitignore` explicitly isolates `.env*`, `.local`, `node_modules`, `dist` |
| **Placeholder Sanitization** | `.env.example` contains only non-secret placeholders | **PASS** | Contains dummy placeholders (e.g. `your-api-key`), zero real API keys |
| **Firebase RTDB Rules** | No open read/write (`".read": true` / `".write": true`) | **PASS** | Root `.read` and `.write` set to `false`. Authentication strictly required |
| **Hardware Safety Rules** | RTDB command duration capped at $\le 10$ seconds | **PASS** | Enforced at DB level (`newData.val() <= 10`) and app validation |
| **Stale Command Protection** | Ignored if `Date.now() - timestamp > 30000` | **PASS** | Verified in simulator, client handlers, and contract |
| **Failsafe Offline Fallback** | Manual controls locked if telemetry stale $> 30$s | **PASS** | Verified via `useDeviceOfflineStatus` and UI disabled attributes |

---

## 3. Realtime Database Security Rules Breakdown
The active [`database.rules.json`](../database.rules.json) enforces least-privilege access and hardware safety constraints:

```json
{
  "rules": {
    ".read": false,
    ".write": false,
    "devices": {
      "$deviceId": {
        "telemetry": {
          "reading": {
            ".read": "auth != null",
            ".write": "auth != null"
          },
          "history": {
            ".read": "auth != null",
            ".write": "auth != null"
          }
        },
        "command": {
          ".read": "auth != null",
          ".write": "auth != null",
          "pump_duration_seconds": {
            ".validate": "newData.isNumber() && newData.val() >= 1 && newData.val() <= 10"
          }
        },
        "profile": {
          ".read": "auth != null",
          ".write": "auth != null"
        }
      }
    }
  }
}
```

### Safety Features Verified:
1. **No Public Access:** Anonymous unauthenticated requests are rejected.
2. **Firmware Protection Cap:** Even if a malicious or buggy client attempts to write `pump_duration_seconds = 600`, the Firebase Realtime Database rule schema rejects the write because `newData.val() <= 10`.
3. **Double Redundancy:** The client-side UI (`src/utils/validation.ts`) caps duration between 1–10s, and the ESP32 hardware firmware maintains a hardware timer cutoff of 10s maximum.

---

## 4. Automated Test Verification
Automated test suite [`src/test/securityReview.test.ts`](../src/test/securityReview.test.ts) executed under Vitest:
- `RULE 5: Zero occurrences of dangerouslySetInnerHTML or eval in src` -> PASSED
- `RULE 6: Zero occurrences of "UV light" (strictly labeled "Grow light")` -> PASSED
- `RULE 3: .gitignore properly protects sensitive files and secrets` -> PASSED
- `RULE 4: Firebase Realtime Database rules never permit open read/write` -> PASSED
- `SECURITY: .env.example only contains placeholders, never secret values` -> PASSED

All 13 test suites (70 tests total) pass without regressions.
