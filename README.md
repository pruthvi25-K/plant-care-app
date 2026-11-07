# PlantCare — Smart Plant Dashboard

A mobile-first PWA dashboard for an automated Household Plant Caring System.  
Built with **React + Vite + TypeScript**, **Tailwind CSS v4**, and **Firebase**.

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (opens http://localhost:3000)
npm run dev

# Run tests
npm test

# Type-check and build for production
npm run build
```

## Project Structure

```
src/
├── hooks/          # Custom React hooks (useTheme, etc.)
├── test/           # Test setup and test files
├── App.tsx         # Root component
├── main.tsx        # Entry point
└── index.css       # Tailwind + design system CSS tokens
docs/
├── design-system.md   # Color palette, typography, component specs
├── contract.md        # Firebase RTDB communication contract
├── tickets.md         # Ticket pipeline (A-00 → A-14)
└── grilling.md        # Architectural decisions
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server on port 3000 |
| `npm test` | Run Vitest test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run build` | Type-check + production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

## License

MIT
