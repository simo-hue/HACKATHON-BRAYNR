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

- [2026-05-09/20:02]: Modal di Conferma Eliminazione Personalizzato
  - *Details*: Sostituito il `window.confirm` nativo di Chrome con un modal personalizzato in stile con l'applicazione per la conferma dell'eliminazione di una materia. Il modal include un'icona di avviso e un pulsante di eliminazione rosso.
  - *Tech Notes*: Modificato `App.jsx`. Aggiunto lo stato `folderToDelete` e la funzione `confirmDeleteFolder`. Importata l'icona `AlertTriangle`.

- [2026-05-09/20:05]: Filtro Materie per Nuovi Obiettivi
  - *Details*: Modificata la schermata di selezione della materia quando si crea un nuovo obiettivo. Ora vengono mostrate solo le materie che non hanno ancora un obiettivo impostato. Se tutte le materie hanno un obiettivo, appare un messaggio informativo.
  - *Tech Notes*: Modificato `App.jsx` inserendo un filtro `.filter(subject => !goals[subject])` prima del map delle materie.

- [2026-05-09/20:07]: Visualizzazione Interleaving nel Calendario
  - *Details*: Implementata una visualizzazione "wow" per l'interleaving nel calendario. Invece di semplici tag, ogni giorno mostra una barra orizzontale segmentata dove ogni segmento rappresenta una materia e la sua larghezza è proporzionale alle ore di studio dedicate. Ogni materia ha un colore unico coerente.
  - *Tech Notes*: Modificato `App.jsx`. Aggiunta la funzione `getSubjectColor` per generare colori hashati. Creata la struttura `.interleaving-bar` e calcolate le percentuali di larghezza.

- [2026-05-09/21:05]: Modalità di Studio e Testing (Flashcard e QA Audio)
  - *Details*: Creato un intero sistema integrato e coerente per il testing dei concetti. Attivabile dal pulsante "Studia" su ogni file. Include due modalità: "Flashcards" (card a ribaltamento 3D con feedback Sapevo/Incerto/Non sapevo) e "Domande Aperte" (interfaccia vocale simulata che "registra", "trascrive" e valuta la risposta restituendo score e feedback dell'IA).
  - *Tech Notes*: Creato il `study_mode` view in `App.jsx`. Aggiunti componenti animati complessi in CSS per flip 3D (`.flashcard-inner`, `preserve-3d`) e per l'impulso rosso della registrazione audio. Gestione di delay simulati per `speech-to-text` e "AI Processing". Aggiornati i file `App.jsx`, `App.css` e `DOCUMENTATION.md`.

- [2026-05-09/21:11]: Dashboard Statistiche Professionale
  - *Details*: Rivoluzionata la pagina delle statistiche inserendo grafici visivi ed avanzati senza librerie esterne. Ora include: Grafici circolari SVG per il tasso di ritenzione e il punteggio medio Q&A, e un grafico a barre dinamico calcolato in tempo reale per la distribuzione delle ore settimanali pianificate per materia.
  - *Tech Notes*: Modificato `App.jsx`. Inserito codice SVG inline con calcolo di `strokeDashoffset` per i cerchi percentuali. Implementato il grafico a barre tramite flexbox ed altezze percentuali calcolate.

- [2026-05-09/21:17]: Flashcards e QA Dinamici (User-Generated)
  - *Details*: Implementata la funzionalità che permette all'utente di creare Flashcard e Domande Aperte personalizzate e collegarle a specifiche materie. Rimosso l'hard-coding dei dati mock nella modalità "Studia".
  - *Tech Notes*: Modificato `App.jsx`. Aggiunto lo stato persistente `subjectQuestions`. Inserito un form tramite modale nella vista `read_file` per l'inserimento rapido di domande/risposte. Modificata la logica della vista `study_mode` per iterare dinamicamente sulle domande generate dall'utente. Gestiti anche gli "empty state" se non ci sono domande.

- [2026-05-09/21:20]: Integrazione ElevenLabs Speech-to-Text (Scribe)
  - *Details*: Aggiunta la trascrizione automatica da file audio/video a testo durante la fase di upload utilizzando l'API di ElevenLabs. Il file importato, se è un media, viene inviato all'API e salvato localmente come file di testo, mantenendo il nome originale.
  - *Tech Notes*: Modificata la funzione di upload in `App.jsx` per invocare asincronamente l'endpoint API `speech-to-text` (model_id: scribe_v1). Aggiunto lo stato UI `isUploading` con loader animato. Creato `.env.example` per configurare `VITE_ELEVENLABS_API_KEY`.

- [2026-05-09/21:26]: Miglioramento UX Trascrizione e View Reale
  - *Details*: Aggiunto un feedback visivo immediato per ogni singolo file in fase di upload. Ora i file audio appaiono subito in lista con uno stato dedicato ("Trascrizione in corso..."). Inoltre, nella vista del documento (Lettore), il lorem ipsum è stato rimosso per mostrare la trascrizione reale generata dall'API.
  - *Tech Notes*: Refactoring di `processFiles` in `App.jsx` per l'inserimento di placeholder asincroni. Aggiornato il rendering condizionale in `preview-item` basato su `file.isTranscribing`. Modificata la vista `read_file` per fare render di `currentFile.content` se disponibile.

- [2026-05-09/21:30]: Bugfix Visualizzazione Testo Mock
  - *Details*: Risolto un problema per cui il testo visualizzato rimaneva "Lorem Ipsum" anche dopo la trascrizione con successo. Il bug era causato dalla mancata persistenza del testo trascritto durante il salvataggio dei file nel file system mock.
  - *Tech Notes*: Modificato `handleSaveUploadAndGoToGoals` in `App.jsx`. Ora il mapping dei file mantiene `type` dinamico e preserva la proprietà `content` generata da ElevenLabs, permettendone la corretta visualizzazione nella vista `read_file`.

- [2026-05-09/21:35]: Integrazione Trascrizione Vocale Real-time con ElevenLabs
  - *Details*: Implementata la registrazione vocale reale per le Domande Aperte (QA) nella modalità "Studia". Quando l'utente preme il microfono, il sistema richiede l'accesso al dispositivo, registra l'audio in formato WebM e, al termine, lo invia all'API ElevenLabs Scribe per generare la trascrizione reale dell'utente.
  - *Tech Notes*: Sostituito il timer mock in `handleMicClick` all'interno di `App.jsx` utilizzando le API native del browser (`navigator.mediaDevices.getUserMedia` e `MediaRecorder`). L'audio campionato viene racchiuso in un `Blob` e inviato asincronamente all'endpoint `v1/speech-to-text`, integrando il medesimo flusso usato precedentemente per l'upload dei file. Aggiunti gli hook `useRef` per la persistenza del `MediaRecorder` senza triggerare render.

- [2026-05-09/21:58]: UI Valutazione IA Multicategoria (Feedback QA)
  - *Details*: Migliorata drasticamente la componente visiva del feedback dell'IA dopo la registrazione di una risposta orale. Invece di un semplice testo, ora il sistema simula una valutazione analitica multicategoria (Coerenza, Fluidità, Precisione Lessicale, Completezza) visualizzata con grafici a barre eleganti.
  - *Tech Notes*: Modificata la funzione `handleEvaluateAudio` in `App.jsx` per generare un oggetto feedback complesso (`general` e `categories`). Sostituito il layout monolitico del `.ai-feedback-box` con una struttura a colonna contenente un grid `auto-fit` per le progress-bar di ogni metrica. Resa dinamica la colorazione delle barre.

- [2026-05-09/22:00]: Navigazione Calendario e Generazione Dinamica
  - *Details*: Implementata la navigazione nel calendario tramite i pulsanti freccia (avanti/indietro) e il pulsante "Oggi". La griglia dei giorni non è più hardcoded ma viene generata dinamicamente in base al mese e all'anno selezionati.
  - *Tech Notes*: Modificato `App.jsx`. Aggiunto lo stato `calendarDate` e la funzione helper `getCalendarDays` per calcolare i giorni del mese allineati alla settimana (Lunedì-Domenica). Aggiornata la vista `calendar` per usare queste nuove logiche e gestire l'evidenziazione del giorno corrente in modo dinamico.

- [2026-05-09/22:04]: Refactoring Architettura Upload File (Chunking e Subfolder)
  - *Details*: Modificato drasticamente il flusso di caricamento. Ora, quando si aggiunge un file, il sistema non lo inserisce in modo lineare nella cartella della materia, ma crea dinamicamente 5 sottocartelle ("Capitolo 1" a "Capitolo 5"). Il file caricato viene quindi spezzettato in 5 chunk e ogni porzione viene assegnata a una subdirectory diversa. È stata aggiunta un'interfaccia di navigazione a più livelli (Materia -> Sottocartella -> Chunk).
  - *Tech Notes*: Modificato `handleSaveUploadAndGoToGoals` in `App.jsx` per generare gli oggetti `isFolder: true` e splittare il payload `f.content` (e metadati proporzionali, come pagine/parole). Aggiunto lo stato `currentSubFolder` per consentire il drill-down all'interno della vista cartella. Aggiornati i contatori di risorse nella home e la UI di `currentView === 'folder'` per renderizzare condizionalmente le icone directory e la header di "ritorno" alla cartella root.

- [2026-05-09/22:07]: Refactoring Architettura Quiz (Studio Ancorato alle Sottocartelle)
  - *Details*: Modificato il livello gerarchico in cui avviene lo studio. Le flashcard e le domande aperte create durante la lettura di un chunk vengono ora salvate all'interno dello scope della sua sottocartella (es. "Capitolo 1"), invece che alla radice della materia. Il pulsante "Studia" è stato rimosso dai singoli file ed è stato spostato al livello della sottocartella.
  - *Tech Notes*: Modificata la struttura chiave di `subjectQuestions` passando da `currentFolder` a `${currentFolder}/${currentSubFolder}` per isolare il pool di domande per argomento. Aggiornato `handleCreateQuestion` per ereditare la sottocartella corretta. Rimossi i pulsanti di avvio studio (`handleStudyFile`) sui singoli chunk in `App.jsx` e inserito un nuovo pulsante `handleStudyFolder` sulle card directory per raggruppare le sessioni.

- [2026-05-09/22:08]: Integrazione Lettura Reale per File di Testo
  - *Details*: Aggiornata la logica di caricamento dei file. Ora, se si caricano file `.txt` o file di tipo testuale (`text/*`), il loro contenuto viene letto e importato realmente. I file audio/video continuano a passare da ElevenLabs per la trascrizione, mentre per i file binari generici (es. PDF complessi) viene ancora utilizzata la stringa di mock di base per evitare freeze del browser.
  - *Tech Notes*: Modificato `processFiles` in `App.jsx`. Inserita l'istanziazione nativa di `FileReader` e del metodo asincrono `readAsText()` all'interno dell'else branch per i file non-transcribing. Aggiornate le metriche `pages` e `words` basandosi sul reale volume del testo ingerito tramite split.

- [2026-05-09/22:10]: Rimozione Progetti Senza Nome
  - *Details*: Aggiunta una logica di cleanup in fase di inizializzazione dello stato per `fileSystem` e `goals`. Ora rimuove automaticamente qualsiasi chiave vuota o composta solo da spazi, risolvendo il problema dei progetti "senza nome" salvati nel `localStorage`.
  - *Tech Notes*: Modificato `App.jsx` aggiungendo l'iterazione `Object.keys().forEach()` con `delete` per le chiavi non valide durante il caricamento dei dati.

- [2026-05-09/22:25]: Sostituzione Difficoltà con Tipologia File
  - *Details*: Sostituita la label della difficoltà con la tipologia del file durante il caricamento. L'utente può ora scegliere tra "Personal Notes" (note/appunti) e "Official Documentation" (documentazione ufficiale).
  - *Tech Notes*: Modificati `App.jsx` e `App.css`. Aggiornato il selettore nella vista di upload e la visualizzazione del badge nella lista dei file. Aggiunti stili CSS per le nuove classi `.notes` e `.documentation`.

- [2026-05-09/22:30]: Full Translation to English
  - *Details*: Translated all user-facing text from Italian to English, including sidebar, calendar, upload section, goals, and statistics views.
  - *Tech Notes*: Modified `App.jsx`. Updated locale strings to `en-US` for date formatting and translated all hardcoded Italian strings in JSX.

- [2026-05-09/22:35]: Fix Calendar Empty Issue
  - *Details*: Fixed an issue where the calendar appeared empty after translation because it was looking for English day names while existing data in `localStorage` used Italian names.
  - *Tech Notes*: Modified `App.jsx`. Updated `DAYS` and `dayNames` to English, but added fallback checks for Italian day names in both the calendar loop and check-in logic to support legacy data.

- [2026-05-09/22:40]: Calendar Deadline Integration
  - *Details*: Made the calendar study plan coherent with the goal deadline. Sessions are now only displayed on the calendar up to the specified deadline date.
  - *Tech Notes*: Modified `App.jsx`. Added a date comparison check in the calendar grid loop to compare the cell date with the goal's `deadline` string.

- [2026-05-09/22:35]: Keywords/Hints for Question Answering
  - *Details*: Added the ability to define keywords or hints during the creation of flashcards and open questions. During the study phase, users can click to reveal these hints if they are having difficulty answering.
  - *Tech Notes*: Modified `App.jsx` to extend `createQuestionState` and `studyState` to include hints management. Added input field and badges for hints in the creation modal. In the study modes (flashcards and QA), added a hints section that conditionally renders and unmasks individual hints when clicked by the user, updating `activeHints` state.

- [2026-05-09/22:42]: Modal UI Improvements & Multi-add
  - *Details*: Improved the user interface of the modal used for adding flashcards and questions. It now features a more visually appealing header with a descriptive subtitle. The "Save" button was transformed into "Add Question" and the modal no longer closes automatically upon adding, allowing the user to seamlessly add multiple questions in succession. The "Cancel" button was changed to "Done" to better reflect its new purpose.
  - *Tech Notes*: Modified `App.jsx` CSS-in-JS styles for the `.modal-header` and `.modal-footer`. Updated the `handleCreateQuestion` to retain `isOpen: true` inside `createQuestionState`, clearing only the form inputs.

- [2026-05-09/22:45]: UI Refactoring: Two-column Layout for Question Creation
  - *Details*: Redesigned the question creation modal to feature a two-column layout, significantly reducing vertical scrolling. The left column now contains the Question and Answer input fields, while the right column hosts the Hints management interface. Additionally, the modal's maximum width was increased to properly accommodate the side-by-side arrangement.
  - *Tech Notes*: Modified `App.jsx` inline styles within the modal `form` to use a flex container (`display: flex`, `gap: 2rem`). Adjusted `App.css` by changing `.modal-content`'s `max-width` from `500px` to `800px`.

- [2026-05-09/22:46]: Modal Centering Fix
  - *Details*: Fixed a layout bug where the question creation modal was not perfectly centered relative to the entire screen. The modal was previously offset to the right because it was placed inside an animated container that established a new CSS containing block.
  - *Tech Notes*: Moved the `createQuestionState.isOpen` modal render block in `App.jsx` out of the `<AnimatePresence>` component and placed it directly inside the `<main>` tag, ensuring that its `position: fixed` behaves relative to the viewport.

- [2026-05-09/22:52]: Flashcard Session Summary Screen
  - *Details*: Enhanced the flashcard study experience by introducing a summary screen at the end of a study session. Instead of abruptly returning to the folder view, the user now sees a visually appealing summary containing the total number of cards reviewed, along with a breakdown of their answers ('Hard', 'Unsure', 'Easy') categorized by color.
  - *Tech Notes*: Updated `studyState` to track a `results` array and a `showResults` boolean flag. Modified `handleNextFlashcard` to accept the answer type and update the state accordingly. Added a conditional rendering block in `App.jsx` to display the  UI when all flashcards in the set are completed.

- [2026-05-09/22:52]: Flashcard Session Summary Screen
  - *Details*: Enhanced the flashcard study experience by introducing a summary screen at the end of a study session. Instead of abruptly returning to the folder view, the user now sees a visually appealing summary containing the total number of cards reviewed, along with a breakdown of their answers ('Hard', 'Unsure', 'Easy') categorized by color.
  - *Tech Notes*: Updated `studyState` to track a `results` array and a `showResults` boolean flag. Modified `handleNextFlashcard` to accept the answer type and update the state accordingly. Added a conditional rendering block in `App.jsx` to display the `.flashcard-summary` UI when all flashcards in the set are completed.

- [2026-05-09/23:01]: QA Study Mode UX Improvements
  - *Details*: Improved the user experience when answering open questions via voice. The main action button has been renamed from "Evaluate Answer with AI" to "Check answer". Additionally, a new "Re-record" button was added alongside it to allow users to easily discard their current transcript and try again without leaving the page or proceeding to evaluation.
  - *Tech Notes*: Modified `App.jsx` in the `studyState.type === 'qa'` render block. Replaced the single full-width button with a flex container holding the "Re-record" (`btn-skip`) and "Check answer" (`btn-save`) buttons. The re-record action simply resets `studyState.transcript` to an empty string, triggering the microphone UI to reappear.

- [2026-05-09/23:10]: Floating Action Button for Question Creation
  - *Details*: Replaced the inline "Create Flashcard / Question" button inside the file visualization view with a modern Floating Action Button (FAB) containing a "+" icon, positioned in the bottom right corner. This ensures the action is always accessible regardless of scroll position and improves overall aesthetics.
  - *Tech Notes*: Modified `App.jsx` to swap the inline button structure with a `<button className="fab-button">`. Added `.fab-button` CSS styles in `App.css` featuring a fixed position, gradient background, z-index management, and hover/active micro-animations.

- [2026-05-10/08:23]: Translate Remaining Italian UI Terms to English
  - *Details*: Translated all remaining Italian words and phrases in the user interface (such as "Studia", "Leggi", "Aggiungi", "Trascrizione non riuscita", etc.) into English to ensure full language consistency across the application. Also translated the Italian day names used in mock goals data.
  - *Tech Notes*: Executed multiple search and replace operations in `App.jsx`. Updated standard labels (`Read`, `Study`, `Add more resources`), component badges (`p.`, `words`, `topics`), and transcription error messages. Updated mock data entries in `App.jsx` to replace `["Lun", "Mer", "Ven"]` format to `["Mon", "Wed", "Fri"]` format.

- [2026-05-10/08:28]: Move Study Button to Subdirectory Level
  - *Details*: Removed the "Study" button from individual files and moved it to the subdirectory/folder level (e.g., for each part in "The Ethics of AI" collection). This enforces studying at the conceptual level rather than file by file.
  - *Tech Notes*: Modified `App.jsx` to remove `<button className="btn-study">` from individual file rendering blocks in both the standard folder view and part folder view. Injected the "Study" button directly inside the `part-folder-card` block and bound it to `handleStudyFolder`, which correctly scopes `currentSubFolder` to the selected part.

- [2026-05-10/08:38]: Audio Transcription Preview in Upload Modal
  - *Details*: Added a new feature to the upload modal allowing users to instantly preview the transcription text (or text content) of a file as soon as the ElevenLabs API finishes transcribing it. Users can click a "Preview" button on each file row to expand a scrollable box containing the full text.
  - *Tech Notes*: Updated `App.jsx` by introducing the `expandedTranscriptionIdx` state to track which file preview is open. Modified the `.preview-list` map function to include an "Eye" button and an animated `<motion.div>` that renders `file.content` conditionally based on the new state. Imported the `Eye` icon from `lucide-react`.

- [2026-05-10/08:44]: Explicit AI Study Plan Creation Workflow
  - *Details*: Changed the behavior after file upload. Instead of automatically chunking files into 5 chapters in the background and redirecting to the goals page, the user is now redirected to the folder view to see their raw uploaded files directly. A new "Create Plan" button was added at the top. Clicking it shows a 2-second AI analysis animation before reorganizing the flat files into a structured study plan with chapters.
  - *Tech Notes*: Extracted the auto-chunking logic from `handleSaveUploadAndGoToGoals` into a new `handleCreatePlanClick` function with a timeout animation powered by a new `isCreatingPlan` state. Refactored the `App.jsx` folder view logic to conditionally render either a list of flat files with a "Create Plan" button, a loading state, or the `parts-grid` interface once `hasSubfolders` becomes true.

- [2026-05-10/08:47]: Demo Redirection on Plan Creation
  - *Details*: Adjusted the study plan creation flow to guarantee that the user is immediately redirected to the highly-populated "The Ethics of AI" collection upon the completion of the 2-second loading animation. This ensures a seamless transition to the primary demonstration dataset during the hackathon.
  - *Tech Notes*: In `App.jsx`, appended a `setCurrentFolder('The Ethics of AI')` state update immediately following `setIsCreatingPlan(false)` inside the `handleCreatePlanClick` timeout callback.

- [2026-05-10/08:52]: Collection View Centered Layout
  - *Details*: Centered the entire content of a collection (both the overview and part folders) horizontally within the main viewport to create a more balanced, modern look when maximizing the window.
  - *Tech Notes*: Added a new `.collection-container` CSS class in `App.css` utilizing `margin: 0 auto` and `max-width: 1000px`. Wrapped the primary `<motion.div>` elements for both `currentView === 'folder'` and `currentView === 'part_folder'` in `App.jsx` with this class. Additionally, updated `.files-list`, `.parts-grid`, `.arguments-section`, and `.plan-proposal` to include `margin: 0 auto; width: 100%;` to ensure all nested blocks center perfectly within the 1000px container.

- [2026-05-10/08:55]: Renamed Default Hardcoded Collections
  - *Details*: Renamed default collections to English equivalents and added files to empty collections.
  - *Tech Notes*: In `App.jsx` within the initial state of `fileSystem` and `goals`, renamed `"Intelligenza Artificiale"` to `"Math"` and updated its files to `"Calculus I - Limits.pdf"` and `"Linear Algebra.docx"`. Added default files to `"History"` and `"Databases"`.

- [2026-05-10/09:02]: Translate Subject Name to English
  - *Details*: Translated "Diritto Privato" to "Private Law" in the goals state as requested by the user.
  - *Tech Notes*: Modified `App.jsx` to update the key in the initial state of `goals`.

- [2026-05-10/09:03]: Hardcode Resources Count for 'The Ethics of AI'
  - *Details*: Hardcoded the resources count to "2" for the "The Ethics of AI" project in the home view.
  - *Tech Notes*: Modified `App.jsx` to conditionally render `2` instead of calculating the length of the file list when the folder name is "The Ethics of AI".

- [2026-05-10/09:04]: Add Migration for 'Diritto Privato' to 'Private Law'
  - *Details*: Added a migration in the `goals` state initialization to rename "Diritto Privato" to "Private Law" if it exists in the loaded `localStorage` data. This fixes the issue where the user still saw the old name due to cached data.
  - *Tech Notes*: Modified `App.jsx` to check if `base["Diritto Privato"]` exists, assign it to `base["Private Law"]`, and delete the old key.

- [2026-05-10/09:07]: Granular Daily Hours Slider
  - *Details*: Modified the "Daily study hours" slider in the goals view to be more granular. It now has a step of 0.5 hours instead of 1 hour.
  - *Tech Notes*: Added `step="0.5"` to the `<input type="range">` and changed `parseInt` to `parseFloat` in the `onChange` handler in `App.jsx`.

- [2026-05-10/09:08]: Relocate and Expand AI Estimate Box
  - *Details*: Moved the "Braynr AI Estimate" box to the bottom of the "set_goals" view and made it expand to full width.
  - *Tech Notes*: Moved the `div.suggestion-box` outside of `div.goals-layout` and added inline styles `width: '100%'` and `marginTop: '2rem'`. Also set `flex: '1'` on `div.goals-form` to fill the space.

- [2026-05-10/09:09]: Compact Layout for Goals View
  - *Details*: Reduced padding and margins in the goals view to help fit all content on the screen without scrolling.
  - *Tech Notes*: Reduced padding in `.goals-form` and `.suggestion-box`, and reduced margin-bottom in `.form-group` in `App.css`. Also reduced `marginTop` of `suggestion-box` in `App.jsx`.

- [2026-05-10/09:10]: Manual Entry for Daily Hours
  - *Details*: Allowed users to manually enter the daily study hours by typing in a number input, in addition to using the slider.
  - *Tech Notes*: Replaced the `span` showing the hours with an `input type="number"` and added a label "hours" next to it in `App.jsx`.
