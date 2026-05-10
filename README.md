# Braynr

> AI-powered study planning — upload a source, get a structured plan, study smarter.

Braynr is a single-page web application that takes an uploaded document (book, paper, notes) and generates an **AI study plan proposal**: it organises chapters into sections, lets you rearrange or delete individual sources, and lets you accept or decline the plan before committing to it. Accepted plans feed a personal calendar, goal tracker, and statistics dashboard.

---

## Features

- **AI Study Plan Proposal** — upload a source and receive a structured section/chapter breakdown; accept, decline, or modify before locking it in
- **Drag-and-drop source management** — move chapters between sections via a 3-dot context menu; delete individual sources inline
- **Goal tracker** — set study deadlines, daily hours, and active weekdays per subject
- **Calendar view** — weekly study sessions auto-scheduled from your goals, with per-day chapter targets
- **Statistics dashboard** — track progress, streaks, and adherence
- **Persistent state** — all data survives page refreshes via `localStorage`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React 19](https://react.dev) |
| Build tool | [Vite 8](https://vite.dev) |
| Animations | [Framer Motion 12](https://www.framer.com/motion/) |
| Icons | [Lucide React](https://lucide.dev) |
| Styling | Plain CSS with CSS custom properties |
| State | React `useState` + `localStorage` |
| Linting | ESLint + `eslint-plugin-react-hooks` |

No backend, no database — the app runs entirely in the browser.

---

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9 (or pnpm / yarn)

---

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/simo-hue/HACKATHON-BRAYNR.git
cd HACKATHON-BRAYNR

# 2. Install dependencies
npm install

# 3. Copy the environment template and fill in your keys
cp .env.example .env

# 4. Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across all source files |

---

## Environment Variables

Copy `.env.example` to `.env` and set the values before running:

```
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

> Variables prefixed with `VITE_` are exposed to the browser bundle. Never put secrets without the prefix into `.env`.

---

## Project Structure

```
HACKATHON-BRAYNR/
├── public/               # Static assets served as-is
├── src/
│   ├── assets/           # Images used in components
│   ├── App.jsx           # Root component — all views and state
│   ├── App.css           # Component styles
│   ├── index.css         # CSS custom properties + global reset
│   └── main.jsx          # React DOM entry point
├── .env.example          # Environment variable template
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
└── vite.config.js
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for branch conventions, commit style, and pull request guidelines.

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
