# Plant Care Web App — Design System & Foundations (Ticket A-00)

## 1. Principles & Design Philosophy
- **Earthy & Technical:** Blends natural botanical organic tones (emerald, sage, moss) with clean precision telemetry aesthetics.
- **Mobile-First & Compact:** Built to fit screens down to **360px** with touch targets $\ge 44\text{px}$, while gracefully scaling to a fluid multi-column desktop dashboard.
- **Strict Nomenclature:** All light actuators and states must be labeled **"Grow light"** (NEVER "UV light").
- **Accessibility & Contrast:** All text must satisfy WCAG AA contrast standards ($\ge 4.5:1$ for body, $\ge 3:1$ for large headings).

---

## 2. Color System & CSS Variables

The app implements a full dual theme system utilizing CSS custom properties and Tailwind CSS dark mode classes (`class` strategy).

```css
:root {
  /* Light Theme (Clean Earthy Botanical) */
  --bg-primary: #F8FAFC;
  --bg-surface: #FFFFFF;
  --bg-surface-elevated: #F1F5F9;
  --text-primary: #0F172A;
  --text-secondary: #475569;
  --text-muted: #64748B;
  --border-subtle: #E2E8F0;
  --border-focus: #166534;

  /* Brand Accents */
  --brand-primary: #166534;       /* Forest Green */
  --brand-primary-hover: #14532D;
  --brand-accent: #22C55E;        /* Vibrant Emerald */
  --brand-subtle: #DCFCE7;        /* Soft Mint */

  /* Functional Telemetry Colors */
  --telemetry-water: #0284C7;     /* Pump / Water Cyan */
  --telemetry-water-bg: #E0F2FE;
  --telemetry-sun: #D97706;       /* Grow Light Amber */
  --telemetry-sun-bg: #FEF3C7;
  --status-online: #16A34A;
  --status-offline: #DC2626;
  --status-warning: #F59E0B;
}

.dark {
  /* Dark Theme (Obsidian & Emerald) */
  --bg-primary: #0B1117;
  --bg-surface: #131C26;
  --bg-surface-elevated: #1B2735;
  --text-primary: #F1F5F9;
  --text-secondary: #94A3B8;
  --text-muted: #64748B;
  --border-subtle: #1E293B;
  --border-focus: #22C55E;

  /* Brand Accents */
  --brand-primary: #22C55E;       /* Emerald */
  --brand-primary-hover: #4ADE80;
  --brand-accent: #15803D;
  --brand-subtle: #064E3B;

  /* Functional Telemetry Colors */
  --telemetry-water: #38BDF8;
  --telemetry-water-bg: #082F49;
  --telemetry-sun: #FBBF24;       /* Grow Light Amber */
  --telemetry-sun-bg: #451A03;
  --status-online: #22C55E;
  --status-offline: #EF4444;
  --status-warning: #F59E0B;
}
```

---

## 3. Typography Scale

| Role | Tailwind Classes | Desktop Size | Mobile (360px) Size | Weight |
|---|---|---|---|---|
| **Big Telemetry Value** | `text-4xl md:text-5xl font-extrabold tracking-tight` | 48px | 36px | 800 |
| **Telemetry Unit** | `text-lg md:text-xl font-medium text-muted` | 20px | 18px | 500 |
| **Section Heading** | `text-lg md:text-xl font-bold tracking-tight` | 20px | 18px | 700 |
| **Card Title** | `text-base font-semibold` | 16px | 16px | 600 |
| **Body / Labels** | `text-sm font-medium` | 14px | 14px | 500 |
| **Badges / Microcopy** | `text-xs font-semibold uppercase tracking-wider` | 12px | 11px | 600 |

---

## 4. Spacing & Breakpoints
- **Mobile Container:** Full width with `px-4 py-4`, min-width support down to `360px`.
- **Desktop Container:** `max-w-6xl mx-auto px-6 py-8`.
- **Card Padding:** `p-4 sm:p-5 md:p-6`.
- **Touch Target Standard:** All interactive buttons and inputs have a minimum tap area of `44px x 44px`.

---

## 5. UI Component Primitive Specifications

### 5.1 Button (`<Button />`)
- **Props:**
  - `variant`: `"primary"` (Brand green) | `"secondary"` (Outlined) | `"water"` (Cyan pump trigger) | `"danger"` (Red alert) | `"ghost"`
  - `size`: `"sm"` (36px height) | `"md"` (44px height - default) | `"lg"` (52px height)
  - `isLoading`: `boolean` (displays accessible inline spinner, disables clicks)
  - `disabled`: `boolean` (opacity 50%, pointer-events-none)
- **Rules:** Clear focus rings (`focus:ring-2 focus:ring-offset-2`).

### 5.2 Card (`<Card />`)
- **Styling:** `bg-surface rounded-2xl border border-subtle shadow-sm transition-colors duration-200`.
- **Variants:**
  - Standard Card: Base elevation.
  - Interactive Card (Preset Selector): Hover state with `hover:border-brand-primary cursor-pointer active:scale-[0.99]`.
  - Offline Alert Card: Crimson border with warning pulse.

### 5.3 Status Indicator & Badges (`<Badge />`)
- **States:**
  - **Online:** Pulsing emerald dot (`animate-ping`) + `"ONLINE"` badge (`bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300`).
  - **Offline (>30s):** Red dot + `"OFFLINE (>30s)"` alert badge.
  - **Water Pump Active:** Water droplet icon + `"WATERING"` badge (`bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 animate-pulse`).
  - **Grow Light Active:** Sun icon + `"GROW LIGHT ON"` badge (`bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300`).

### 5.4 Toggle Switch (`<ToggleSwitch />`)
- **Role:** Switch component with full ARIA accessibility (`role="switch"`, `aria-checked`).
- **Use Cases:**
  - Grow light Manual Mode ON/OFF.
  - Grow light Dual Mode (Auto Schedule vs Manual Override).
  - Theme Toggle (Dark vs Light).
- **Minimum Tap Size:** 48px width x 28px height, 44px tap buffer.

### 5.5 Threshold Dual Slider (`<ThresholdSlider />`)
- **Role:** Touch-friendly slider allowing users to configure `moisture_min` and `moisture_max`.
- **Constraints:**
  - $0 \le \text{min} < \text{max} \le 100$.
  - Minimum gap: 5%.
  - Real-time numerical display beside each thumb.

---

## 6. Offline State & Edge Case Visual Matrix

| Condition | Visual Presentation | Controls State |
|---|---|---|
| **Normal (<15s)** | Green status badge, live metrics updating smoothly | All buttons & toggles enabled |
| **Approaching Stale (15s–30s)** | Yellow warning badge: "Awaiting telemetry..." | Controls remain enabled |
| **Offline (>30s)** | Top red banner: "Device Offline (Last seen X seconds ago)" | "Water Now" and "Grow light" buttons disabled |
| **Watering in Progress** | Cyan progress glow around moisture card, pump badge pulsing | "Water Now" button shows active loading state |
| **Demo Mode Active** | Bright purple / indigo top indicator: "DEMO MODE ACTIVE" | Full interactive simulation enabled |

---

## 7. Automated Linting & Inspection Rules
- Run validation checks to ensure zero instances of `"UV light"` exist in copy.
- Enforce semantic HTML (`<main>`, `<header>`, `<section>`, `<article>`, `<button>`).
- No raw CSS colors (`#166534`) inside component templates—always use semantic Tailwind tokens.
