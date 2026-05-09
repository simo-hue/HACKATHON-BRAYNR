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

- [2026-05-09/19:15]: Gestione Difficoltà e Metriche File
  - *Details*: Implementata la possibilità per l'utente di impostare la difficoltà (Semplice, Medio, Difficile) per ogni file caricato tramite una UI professionale con selettore. Aggiunta la simulazione di metriche base (pagine e parole) per ogni file.
  - *Tech Notes*: Modificati `App.jsx` e `App.css`. Aggiunto lo stato per la difficoltà nel preview dell'upload e salvato nel `fileSystem`. Aggiornata la vista `folder` per mostrare i badge di difficoltà e le metriche.

- [2026-05-09/19:20]: Pulizia e Miglioramento UI Upload
  - *Details*: Risolti i problemi visivi nella schermata di upload. Rimosse le icone fluttuanti che si sovrapponevano e reso il box di anteprima dei file coerente con lo stile glassmorphic dell'app.
  - *Tech Notes*: Modificati `App.jsx` e `App.css`. Rimosse le icone `FileText`, `Video`, `Volume2` fluttuanti. Aggiornati gli stili di `.files-preview-box` e `.btn-start-analysis`.

- [2026-05-09/19:22]: Spaziatura Pulsante Upload
  - *Details*: Aggiunto spazio tra il testo descrittivo e il pulsante "Seleziona dal computer" nella zona di upload per migliorare la leggibilità e l'estetica.
  - *Tech Notes*: Modificato `App.css` aggiungendo `margin-top: 2rem` a `.btn-upload`.

- [2026-05-09/19:25]: Persistenza Dati in LocalStorage
  - *Details*: Implementata la persistenza dei dati nello storage locale del browser. Ora i progetti creati e i file caricati sopravvivono al refresh della pagina. I 3 progetti completati fittizi sono stati inizializzati con cartelle vuote.
  - *Tech Notes*: Modificato `App.jsx`. Utilizzati `useState` con funzioni di inizializzazione che leggono da `localStorage` e `useEffect` per salvare `fileSystem` e `goals` ad ogni modifica. Inserito `useEffect` tra gli import di React.

- [2026-05-09/19:30]: Visualizzatore File (Mock Reader)
  - *Details*: Aggiunta la possibilità di visualizzare e leggere il contenuto di un file direttamente dall'app. Aggiunto un pulsante "Leggi" per ogni file e una vista dedicata con testo mock e struttura professionale.
  - *Tech Notes*: Modificati `App.jsx` e `App.css`. Creata la vista `read_file` e aggiunto lo stato `currentFile`. Risolto un errore di sintassi (mancata chiusura di parentesi) durante l'inserimento della vista.

- [2026-05-09/19:35]: Area Statistiche e Check-in Giornaliero
  - *Details*: Aggiunta la nuova tab 'Statistiche'. Mostra i dati mock relativi alle flashcard (retention e streak), Q&A (punteggio medio) e l'aderenza al piano di studio (storico 14 giorni). Implementato un banner di "Check-in Giornaliero" che compare se l'utente non ha ancora validato la giornata.
  - *Tech Notes*: Modificato `App.jsx` introducendo lo stato `stats` sincronizzato in `localStorage`. Disegnato il banner per il check-in giornaliero e la scacchiera di aderenza al piano in `App.css`. Aggiornato `DOCUMENTATION.md`.

- [2026-05-09/19:40]: Vista Calendario (Stile Mac)
  - *Details*: Creata una nuova pagina "Calendario" accessibile dalla sidebar che replica lo stile dell'app Calendar di macOS. Mostra una griglia mensile (Maggio 2026) con le sessioni di studio pianificate per ogni giorno in base agli obiettivi.
  - *Tech Notes*: Modificati `App.jsx` e `App.css`. Aggiunta la voce nel menu sidebar. Implementata la logica per mappare i giorni della settimana con gli obiettivi impostati, mostrando i tag delle sessioni nelle celle del calendario. Evidenziato il giorno corrente (9 Maggio).

- [2026-05-09/19:42]: Ripristino Collegamento Sidebar Calendario
  - *Details*: Aggiunto nuovamente il collegamento alla pagina "Calendario" nella sidebar, che era stato rimosso durante le modifiche manuali dell'utente.
  - *Tech Notes*: Modificato `App.jsx` inserendo il tag `<a>` per il calendario tra "Obiettivi" e "Statistiche".

- [2026-05-09/19:45]: Ripristino Vista Calendario
  - *Details*: Reinserita la vista del calendario che era stata involontariamente rimossa durante le modifiche manuali.
  - *Tech Notes*: Modificato `App.jsx` reinserendo il blocco `{currentView === 'calendar' && (...)}` con la griglia e la logica delle sessioni.

- [2026-05-09/19:46]: Miglioramento Check-in Giornaliero
  - *Details*: Spostato il banner di check-in dall'area statistiche all'area comune (`content-area`) in modo che sia visibile al primo accesso su qualsiasi pagina. Aggiornato il testo per chiedere esplicitamente se l'utente ha studiato "ieri".
  - *Tech Notes*: Modificato `App.jsx`. Spostato il blocco `{needsCheckIn && ...}` subito dopo l'apertura di `<div className="content-area">`.

- [2026-05-09/19:48]: Check-in Granulare con Lista Materie
  - *Details*: Trasformato il check-in in un vero e proprio diario dello studio. Ora il sistema calcola quali materie erano programmate per ieri e mostra una lista con checkbox per permettere all'utente di dichiarare esattamente cosa ha studiato.
  - *Tech Notes*: Modificato `App.jsx`. Aggiunta la logica per calcolare `yesterdaySubjects` in base a `goals`. Creato lo stato `checkedSubjects` e la funzione `submitCheckIn`.

- [2026-05-09/19:52]: Simulazione Primo Accesso Continuo
  - *Details*: Modificata la logica del check-in per fare in modo che il banner appaia SEMPRE all'avvio dell'applicazione (o al refresh), simulando costantemente il primo accesso della giornata per facilitare i test e la demo.
  - *Tech Notes*: Modificato `App.jsx`. Trasformato `needsCheckIn` in uno stato React inizializzato a `true` e impostato a `false` solo dopo aver salvato il check-in.

- [2026-05-09/19:54]: Modal Popup per Check-in Obbligatorio
  - *Details*: Trasformato il banner di check-in in un pop-up modale a tutto schermo che blocca l'interazione con l'app finché non viene compilato. Il design usa uno sfondo scuro sfocato (backdrop blur) e rispetta lo stile premium dell'app.
  - *Tech Notes*: Modificati `App.jsx` e `App.css`. Aggiunte le classi `.modal-overlay`, `.modal-content`, ecc. in `App.css` e aggiornata la struttura JSX in `App.jsx`.

- [2026-05-09/19:56]: Modifica Obiettivi Esistenti
  - *Details*: Rese le card degli obiettivi nella pagina "Obiettivi" cliccabili. Cliccando su una card, l'utente viene portato alla schermata di configurazione con i dati precompilati per poterli modificare. Aggiunto anche un effetto hover premium alle card.
  - *Tech Notes*: Modificato `App.jsx` aggiungendo l'evento `onClick` a `.goal-card`. Modificato `App.css` aggiungendo l'effetto hover e `cursor: pointer`.

- [2026-05-09/19:58]: Modal di Dettaglio Obiettivi
  - *Details*: Modificato il flusso di modifica degli obiettivi. Ora, cliccando su una card, si apre un modal di dettaglio con le informazioni correnti. Da qui l'utente può decidere se chiudere o procedere alla modifica tramite il pulsante "Modifica". Il modal si chiude anche cliccando all'esterno.
  - *Tech Notes*: Modificato `App.jsx`. Aggiunto lo stato `viewingGoal` e la struttura del modal con blocco della propagazione del click.

- [2026-05-09/20:00]: Eliminazione Materie dalla Home
  - *Details*: Aggiunta la possibilità di eliminare una materia (cartella) direttamente dalla Home. È stata inserita un'icona a forma di cestino in alto a destra su ogni card. L'azione richiede una conferma tramite finestra di dialogo e rimuove sia la cartella con i file sia gli obiettivi associati.
  - *Tech Notes*: Modificati `App.jsx` e `App.css`. Importata l'icona `Trash2`. Aggiunta la funzione `handleDeleteFolder` con `e.stopPropagation()` per non aprire la cartella.

- [2026-05-09/20:01]: Spaziatura Titolo Creazione Materia
  - *Details*: Aggiunto un margine inferiore al titolo "Come vuoi chiamare la materia?" nella vista di creazione per distanziarlo dal campo di testo e migliorare la leggibilità.
  - *Tech Notes*: Modificato `App.jsx` aggiungendo `style={{ marginBottom: '1.5rem' }}` all'elemento `<h2>`.
