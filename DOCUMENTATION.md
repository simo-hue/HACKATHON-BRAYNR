# Project Documentation

- [2026-05-09/16:15]: Braynr UI Implementation
  - *Details*: Created a modern, premium web UI for the "Inserisci Fonti" (Insert Files) phase of the Braynr app for logged-in users. Uses React, Vite, Framer Motion, and Lucide React. Incorporates a dynamic glassmorphic drag-and-drop zone.
  - *Tech Notes*: Installed `lucide-react` and `framer-motion`. Rewrote `App.jsx`, `App.css`, and `index.css` leveraging dark mode, vibrant glowing accents, and micro-animations to align with the application's innovative aesthetic identity.

- [2026-05-09/16:35]: File System Hierarchy Implementation
  - *Details*: Refactored the UI to introduce a mock file system hierarchy. Users now land on a "Home" view showing subjects as folders. They can click `+` to name a new subject, then drag & drop files to upload directly into that folder. They can also view the contents of an existing folder.
  - *Tech Notes*: Added routing state (`currentView`: 'home', 'folder', 'create_name', 'upload_files') and `fileSystem` state mapping folders to an array of files. Used Framer Motion `AnimatePresence` to smooth transitions between hierarchical states. Updated CSS for Grid folder layout and List file layout.

- [2026-05-09/18:35]: Initial Git Commit and Push
  - *Details*: Initialized the git repository, added all project files (ignoring node_modules and dist), committed them, and pushed to the remote repository `https://github.com/simo-hue/HACKATHON-BRAYNR.git`.
  - *Tech Notes*: Used `git init`, `git branch -M main`, `git add .`, `git commit`, and `git push -u origin main`.

- [2026-05-09/18:55]: Study Goals Feature Integration
  - *Details*: Added a new optional phase after file uploading where users can set study goals (deadline, daily hours, and study days). Included a dynamic "Braynr AI Suggestion Box" that estimates the needed study time. Configured goals appear in a dedicated "Obiettivi" view accessible from the sidebar.
  - *Tech Notes*: Added `goals` and `tempGoal` state in `App.jsx`. Created the `set_goals` view with a specialized CSS form layout and the AI estimation box. Added the `obiettivi` routing view to list configured goals as cards in a CSS grid.

- [2026-05-09/19:00]: Independent Goals Addition System
  - *Details*: Enhanced the "Obiettivi" view to allow users to add new goals independently, outside of the file upload flow. Implemented a "+" card in the Goals dashboard that opens a subject selection modal/view.
  - *Tech Notes*: Added `select_subject_for_goal` view in `App.jsx`. Configured `previousView` state parameter to correctly redirect back to the Goals dashboard (instead of the Folder view) when a goal is created or cancelled from this entry point. Updated `DOCUMENTATION.md`.

- [2026-05-09/19:05]: Miglioramento UI Obiettivi
  - *Details*: Migliorata l'estetica della vista di impostazione degli obiettivi per renderla più moderna e coerente con il resto dell'applicazione. Rimosso il colore giallo dal box dei suggerimenti dell'IA e applicati effetti glassmorphic e gradienti viola/blu.
  - *Tech Notes*: Modificati `App.css` e `App.jsx`. Aggiornati i controlli di input (data, slider, pulsanti dei giorni) con stili più premium. Rimosso il colore hardcoded `#fbbf24` e sostituito con gradienti e colori della palette principale.

- [2026-05-09/19:10]: Simulazione Progetti Completati e Logica Stima IA
  - *Details*: Simulata la presenza di 3 progetti completati nello stato per sbloccare la stima dell'IA. Aggiunta una condizione per cui la stima si attiva solo con >= 3 progetti completati.
  - *Tech Notes*: Modificato `App.jsx`. Aggiunti 3 progetti con `progress: 100` nello stato `goals`. Aggiornata la vista `suggestion-box` per mostrare un messaggio di attesa se i progetti completati sono < 3. Aggiornata la vista `obiettivi` per mostrare il progresso reale e un badge di completamento.
