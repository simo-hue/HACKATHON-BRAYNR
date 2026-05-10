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



## Next Steps
Two extensions are planned for the next iteration of the platform. Both follow the same design line as the current prototype: one extends the planning phase, the other introduces a collaborative mode.

### Conversational planning assistant
Braynr already includes an agent that interacts with the user's sources. The next step is to extend the same agent to the planning phase.
Restructuring a study plan through the current GUI requires several manual operations: splitting a topic, merging two chapters, shrinking a section, or moving content across weeks. This friction is on the wrong layer — it taxes the student on interface logistics rather than on the planning decision itself.
Moving these interactions into a conversational channel ("split this chapter in two", "move next week's topic to after the exam") keeps the student focused on how to structure their own material. The agent acts as a planning partner, and the interface stops being a bottleneck on the planning activity.

### Collaborative collections
The second extension turns the collection from an individual artifact into a shared one. A group of students can create a joint collection, each uploading their own sources into a shared pool. The agent plans the chapter and topic decomposition once, over the union of all sources, producing a single shared structure.
The temporal plan remains individual: each student schedules the shared chapters according to their own pace and commitments. The shared structure gives the group a common reference; the individual schedule preserves each student's autonomy.
At the end of each chapter, every student still produces their own elaborations (flashcards, keywords, etc.) as in the individual flow. The added step is that, once a student completes a chapter, they are challenged to answer their peers' flashcards and to guess the keywords their peers chose for the same chapter.
The mechanic has two effects. The competitive layer increases engagement. More importantly, working through a peer's reformulation of the same material exposes the student to a different encoding of the same concepts, which adds a further round of active elaboration on top of the individual one.