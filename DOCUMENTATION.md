# Project Documentation

- [2026-05-09/16:15]: Braynr UI Implementation
  - *Details*: Created a modern, premium web UI for the "Inserisci Fonti" (Insert Files) phase of the Braynr app for logged-in users. Uses React, Vite, Framer Motion, and Lucide React. Incorporates a dynamic glassmorphic drag-and-drop zone.
  - *Tech Notes*: Installed `lucide-react` and `framer-motion`. Rewrote `App.jsx`, `App.css`, and `index.css` leveraging dark mode, vibrant glowing accents, and micro-animations to align with the application's innovative aesthetic identity.

- [2026-05-09/16:35]: File System Hierarchy Implementation
  - *Details*: Refactored the UI to introduce a mock file system hierarchy. Users now land on a "Home" view showing subjects as folders. They can click `+` to name a new subject, then drag & drop files to upload directly into that folder. They can also view the contents of an existing folder.
  - *Tech Notes*: Added routing state (`currentView`: 'home', 'folder', 'create_name', 'upload_files') and `fileSystem` state mapping folders to an array of files. Used Framer Motion `AnimatePresence` to smooth transitions between hierarchical states. Updated CSS for Grid folder layout and List file layout.
