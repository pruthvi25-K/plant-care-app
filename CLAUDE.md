# Plant Care Web App — Agent Guidelines & Project Rules

## Project Role & Context
- **User:** Pruthviraj Kale, Member 4 (App & UI/UX Lead) in a 5-member college engineering project team.
- **Product:** Mobile-first PWA dashboard for a Household Plant Caring System.
- **System Overview:** ESP32 micro-controller automatically monitors soil moisture, triggers auto-watering, and manages a grow light. The web dashboard communicates **exclusively** with Firebase Realtime Database following `docs/contract.md`.
- **Boundaries:** Pruthviraj and this agent **never** touch firmware, sensor, or circuit code (owned by other project members).

---

## Tech Stack
- **Framework & Build:** React 18/19 + Vite + TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Backend / Database:** Firebase (Firebase Authentication + Firebase Realtime Database)
- **Local Dev / Emulation:** Firebase Emulator Suite (`auth`, `database`)
- **Testing:** Vitest + React Testing Library (unit/component), Playwright (1 critical E2E test)
- **Code Quality:** ESLint + Prettier
- **Hosting Targets:** Vercel

---

## Non-Negotiable Rules
1. **One ticket at a time, one git branch per ticket, tests first, small diffs.**
2. **No new dependencies without asking Pruthviraj with a one-line reason.**
3. **Never read, print, or ask for `.env` files, passwords, or secret keys.** Configuration is done via `.env.local`; only commit `.env.example`.
4. **Firebase rules must never be `true` for read/write.** Never weaken a security rule to pass a test; ask Pruthviraj.
5. **No `dangerouslySetInnerHTML` or `eval`.** Validate all inputs in the UI and enforce constraints via Firebase Realtime Database security rules.
6. **Terminology:** Always label the light **"Grow light"**, NEVER "UV light".
7. **Resilience & Responsiveness:** Every screen must gracefully handle **loading**, **empty**, **offline** (no reading for >30 s), and **error** states. Must be fully functional and usable at **360px** viewport width.
8. **3-Strike Bug Rule:** If the same bug fails 3 times: stop, revert changes, and propose a smaller, simpler ticket.
9. **Critical Commands:** Never run `rm -rf`, `git push`, or `firebase deploy` without explicit user permission. Always ask before running any terminal command.
10. **Code Gate:** Do not write application code until Pruthviraj explicitly says `"start ticket A-xx"`. Work in planning mode first.
