import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Home,
  Target,
  BarChart2,
  Settings,
  LogOut,
  UploadCloud,
  FileText,
  FileIcon,
  Video,
  Volume2,
  CheckCircle2,
  Bell,
  Folder,
  Plus,
  ArrowLeft,
  ChevronRight,
  FolderPlus,
  Calendar,
  Clock,
  Sparkles,
  CalendarDays,
  Activity,
  CheckCircle,
  XCircle,
  Flame,
  BrainCircuit,
  HelpCircle,
  Trash2,
  AlertTriangle,
  Mic,
  Square,
  RefreshCw,
  Zap
} from 'lucide-react';
import './App.css';

const getSubjectColor = (subject) => {
  const palette = [
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Yellow
    '#ef4444', // Red
    '#06b6d4', // Cyan
    '#a855f7', // Purple-light
  ];
  let hash = 0;
  for (let i = 0; i < subject.length; i++) {
    hash = subject.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
};

const getCalendarDays = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startDay = (firstDay.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = lastDay.getDate();

  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }
  while (days.length < 42) {
    days.push(null);
  }
  return days;
};

function App() {
  // Navigation & Hierarchy State
  const [currentView, setCurrentView] = useState('home'); // 'home', 'folder', 'create_name', 'upload_files', 'set_goals', 'obiettivi', 'select_subject_for_goal', 'statistiche', 'read_file', 'study_mode', 'calendar'
  const [currentFolder, setCurrentFolder] = useState(null);
  const [currentSubFolder, setCurrentSubFolder] = useState(null);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [previousView, setPreviousView] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);

  // Mock File System State
  const [fileSystem, setFileSystem] = useState(() => {
    const saved = localStorage.getItem('fileSystem');
    let data = saved ? JSON.parse(saved) : {
      "Intelligenza Artificiale": [
        { name: "Lezione 1 - Intro.pdf", type: "pdf", pages: 12, words: 2500, difficulty: 'semplice' },
        { name: "Reti Neurali.docx", type: "doc", pages: 25, words: 6000, difficulty: 'difficile' }
      ],
      "Fisica Quantistica": [
        { name: "Appunti Schrödinger.pdf", type: "pdf", pages: 8, words: 1800, difficulty: 'medio' }
      ],
      "Storia Contemporanea": [],
      "Basi di Dati": [],
      "Diritto Privato": []
    };
    // Cleanup empty keys
    Object.keys(data).forEach(key => {
      if (!key.trim()) delete data[key];
    });
    return data;
  });

  // Goals State
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('goals');
    let data = saved ? JSON.parse(saved) : {
      "Intelligenza Artificiale": {
        deadline: "2026-06-15",
        dailyHours: 2,
        daysOfWeek: ["Lun", "Mer", "Ven"],
        progress: 35
      },
      "Storia Contemporanea": {
        deadline: "2026-04-10",
        dailyHours: 1,
        daysOfWeek: ["Mar", "Gio"],
        progress: 100
      },
      "Basi di Dati": {
        deadline: "2026-04-20",
        dailyHours: 3,
        daysOfWeek: ["Lun", "Mer", "Ven"],
        progress: 100
      },
      "Diritto Privato": {
        deadline: "2026-05-01",
        dailyHours: 2,
        daysOfWeek: ["Sab", "Dom"],
        progress: 100
      }
    };
    // Cleanup empty keys
    Object.keys(data).forEach(key => {
      if (!key.trim()) delete data[key];
    });
    return data;
  });

  // Stats & Adherence State
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('stats');
    return saved ? JSON.parse(saved) : {
      flashcards: { reviewCount: 342, retentionRate: 85, streakDays: 14 },
      qa: { questionsAnswered: 89, averageScore: 78 },
      adherence: {
        completedDays: 20,
        missedDays: 4,
        history: [true, true, false, true, true, true, false, true, true, true, true, true, true, true]
      },
      lastCheckIn: null
    };
  });

  useEffect(() => {
    localStorage.setItem('fileSystem', JSON.stringify(fileSystem));
  }, [fileSystem]);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('stats', JSON.stringify(stats));
  }, [stats]);

  const [tempGoal, setTempGoal] = useState({
    deadline: "",
    dailyHours: 2,
    daysOfWeek: []
  });
  const [viewingGoal, setViewingGoal] = useState(null);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date(2026, 4, 1)); // May 2026

  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Upload State
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [checkedSubjects, setCheckedSubjects] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  const processFiles = async (files) => {
    setIsUploading(true);

    // First, create placeholders for all files
    const filePlaceholders = Array.from(files).map((f, idx) => {
      const isMedia = f.type.startsWith('audio/') || f.type.startsWith('video/');
      return {
        id: Date.now() + idx,
        originalFile: f,
        name: isMedia ? f.name : f.name,
        type: isMedia ? 'media' : (f.name.split('.').pop() || 'file'),
        difficulty: 'notes',
        pages: 0,
        words: 0,
        isTranscribing: isMedia,
        error: false
      };
    });

    // Add them to state immediately so the user sees them
    setUploadFiles(prev => [...prev, ...filePlaceholders]);

    for (const placeholder of filePlaceholders) {
      if (placeholder.isTranscribing) {
        try {
          const formData = new FormData();
          formData.append('file', placeholder.originalFile);
          formData.append('model_id', 'scribe_v1');

          const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
            method: 'POST',
            headers: {
              'xi-api-key': import.meta.env.VITE_ELEVENLABS_API_KEY
            },
            body: formData
          });

          if (!response.ok) {
            throw new Error(`ElevenLabs API error: ${response.statusText}`);
          }

          const data = await response.json();
          const txtFileName = placeholder.originalFile.name.replace(/\.[^/.]+$/, "") + ".txt";

          setUploadFiles(prev => prev.map(f => {
            if (f.id === placeholder.id) {
              return {
                ...f,
                name: txtFileName,
                type: 'txt',
                pages: Math.ceil((data.text.split(' ').length || 1) / 300),
                words: data.text.split(' ').length || 0,
                content: data.text,
                isTranscribing: false
              };
            }
            return f;
          }));
        } catch (error) {
          console.error("Transcription failed:", error);
          setUploadFiles(prev => prev.map(f => {
            if (f.id === placeholder.id) {
              return {
                ...f,
                isTranscribing: false,
                error: true
              };
            }
            return f;
          }));
        }
      } else {
        let extractedContent = "Questo è il contenuto simulato per il file: " + placeholder.originalFile.name;

        if (placeholder.originalFile && (placeholder.originalFile.type.startsWith('text/') || placeholder.originalFile.name.endsWith('.txt'))) {
          try {
            const text = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = (e) => resolve(e.target.result);
              reader.onerror = (e) => reject(e);
              reader.readAsText(placeholder.originalFile);
            });
            extractedContent = text;
          } catch (e) {
            console.error("Failed to read text file", e);
          }
        }

        setUploadFiles(prev => prev.map(f => {
          if (f.id === placeholder.id) {
            return {
              ...f,
              pages: Math.max(1, Math.ceil(extractedContent.split(/\s+/).length / 300)),
              words: extractedContent.split(/\s+/).length || 0,
              content: extractedContent
            };
          }
          return f;
        }));
      }
    }
    setIsUploading(false);
  };

  // Study Mode State
  const [studyState, setStudyState] = useState({
    type: 'flashcards', // 'flashcards' or 'qa'
    currentIndex: 0,
    isFlipped: false,
    isRecording: false,
    transcript: '',
    feedback: null,
    isProcessing: false,
    score: null,
    activeHints: [],
    results: [],
    showResults: false
  });

  const [subjectQuestions, setSubjectQuestions] = useState(() => {
    const saved = localStorage.getItem('subjectQuestions');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('subjectQuestions', JSON.stringify(subjectQuestions));
  }, [subjectQuestions]);

  const [createQuestionState, setCreateQuestionState] = useState({
    isOpen: false,
    type: 'flashcards',
    q: '',
    a: '',
    hints: [],
    newHint: ''
  });

  const handleAddHint = (e) => {
    e.preventDefault();
    if (createQuestionState.newHint.trim()) {
      setCreateQuestionState(prev => ({
        ...prev,
        hints: [...(prev.hints || []), prev.newHint.trim()],
        newHint: ''
      }));
    }
  };

  const handleRemoveHint = (index) => {
    setCreateQuestionState(prev => ({
      ...prev,
      hints: prev.hints.filter((_, i) => i !== index)
    }));
  };

  // Check-in logic
  const todayDateStr = new Date().toDateString();
  const [needsCheckIn, setNeedsCheckIn] = useState(true);

  const yesterday = new Date(Date.now() - 86400000);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayNamesIt = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
  const yesterdayDayName = dayNames[yesterday.getDay()];
  const yesterdayDayNameIt = dayNamesIt[yesterday.getDay()];

  const yesterdaySubjects = [];
  Object.entries(goals).forEach(([subject, goalInfo]) => {
    if (goalInfo.daysOfWeek.includes(yesterdayDayName) || goalInfo.daysOfWeek.includes(yesterdayDayNameIt)) {
      yesterdaySubjects.push(subject);
    }
  });

  const toggleCheckedSubject = (subject) => {
    setCheckedSubjects(prev => ({
      ...prev,
      [subject]: !prev[subject]
    }));
  };

  const submitCheckIn = () => {
    const atLeastOneStudied = yesterdaySubjects.length > 0
      ? yesterdaySubjects.some(s => checkedSubjects[s])
      : checkedSubjects['general'];

    handleCheckIn(atLeastOneStudied);
  };
  const handleDeleteFolder = (e, folderName) => {
    e.stopPropagation();
    setFolderToDelete(folderName);
  };

  const confirmDeleteFolder = () => {
    if (!folderToDelete) return;
    setFileSystem(prev => {
      const updated = { ...prev };
      delete updated[folderToDelete];
      return updated;
    });
    setGoals(prev => {
      const updated = { ...prev };
      delete updated[folderToDelete];
      return updated;
    });
    setFolderToDelete(null);
  };

  const handleCheckIn = (studied) => {
    setNeedsCheckIn(false);
    setStats(prev => {
      const newHistory = [...prev.adherence.history, studied];
      if (newHistory.length > 14) newHistory.shift();

      return {
        ...prev,
        lastCheckIn: todayDateStr,
        adherence: {
          ...prev.adherence,
          completedDays: studied ? prev.adherence.completedDays + 1 : prev.adherence.completedDays,
          missedDays: !studied ? prev.adherence.missedDays + 1 : prev.adherence.missedDays,
          history: newHistory
        },
        flashcards: {
          ...prev.flashcards,
          streakDays: studied ? prev.flashcards.streakDays + 1 : 0
        }
      };
    });
  };

  // Study Logic Handlers
  const subjectKey = currentSubFolder ? `${currentFolder}/${currentSubFolder}` : currentFolder;
  const currentSubjectFlashcards = subjectQuestions[subjectKey]?.flashcards || [];
  const currentSubjectQA = subjectQuestions[subjectKey]?.qa || [];

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleMicClick = async () => {
    if (studyState.isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      setStudyState({ ...studyState, isRecording: false, isProcessing: true });
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

          try {
            const formData = new FormData();
            formData.append('file', audioBlob, 'recording.webm');
            formData.append('model_id', 'scribe_v1');

            const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
              method: 'POST',
              headers: {
                'xi-api-key': import.meta.env.VITE_ELEVENLABS_API_KEY
              },
              body: formData
            });

            if (!response.ok) {
              throw new Error(`ElevenLabs API error: ${response.statusText}`);
            }

            const data = await response.json();

            setStudyState(prev => ({
              ...prev,
              isProcessing: false,
              transcript: data.text || "Trascrizione non riuscita o audio vuoto.",
            }));
          } catch (err) {
            console.error("Transcription failed", err);
            setStudyState(prev => ({
              ...prev,
              isProcessing: false,
              transcript: "Errore durante la trascrizione dell'audio.",
            }));
          }

          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setStudyState({ ...studyState, isRecording: true, transcript: '', feedback: null, score: null });
      } catch (err) {
        console.error("Mic access denied", err);
        alert("Impossibile accedere al microfono. Controlla i permessi.");
      }
    }
  };

  const handleEvaluateAudio = () => {
    setStudyState({ ...studyState, isProcessing: true });
    setTimeout(() => {
      setStudyState(prev => ({
        ...prev,
        isProcessing: false,
        feedback: {
          general: "Ottima spiegazione, concetti chiari! Hai centrato il punto. Ricorda solo di approfondire leggermente il contesto storico o l'applicazione pratica per renderla perfetta.",
          categories: [
            { name: "Coerenza", score: Math.floor(Math.random() * 20) + 80, color: '#10b981' },
            { name: "Fluidità", score: Math.floor(Math.random() * 30) + 70, color: '#3b82f6' },
            { name: "Precisione Lessicale", score: Math.floor(Math.random() * 25) + 75, color: '#8b5cf6' },
            { name: "Completezza", score: Math.floor(Math.random() * 40) + 60, color: '#f59e0b' },
          ]
        },
        score: Math.floor(Math.random() * 20) + 80 // Random score between 80 and 100
      }));
    }, 2000);
  };

  const handleNextFlashcard = (answer) => {
    const newResults = [...(studyState.results || []), answer];
    if (studyState.currentIndex < currentSubjectFlashcards.length - 1) {
      setStudyState({ ...studyState, currentIndex: studyState.currentIndex + 1, isFlipped: false, activeHints: [], results: newResults });
    } else {
      setStudyState({ ...studyState, isFlipped: false, activeHints: [], results: newResults, showResults: true });
    }
  };

  const handleNextQA = () => {
    if (studyState.currentIndex < currentSubjectQA.length - 1) {
      setStudyState({ ...studyState, currentIndex: studyState.currentIndex + 1, transcript: '', feedback: null, score: null, isRecording: false, activeHints: [] });
    } else {
      setCurrentView('folder');
    }
  };

  const handleCreateQuestion = (e) => {
    e.preventDefault();
    if (!createQuestionState.q.trim()) return;

    setSubjectQuestions(prev => {
      const subject = currentSubFolder ? `${currentFolder}/${currentSubFolder}` : currentFolder;
      const updated = { ...prev };
      if (!updated[subject]) {
        updated[subject] = { flashcards: [], qa: [] };
      }
      if (createQuestionState.type === 'flashcards') {
        updated[subject].flashcards.push({ q: createQuestionState.q, a: createQuestionState.a, hints: createQuestionState.hints || [] });
      } else {
        updated[subject].qa.push({ q: createQuestionState.q, hints: createQuestionState.hints || [] });
      }
      return updated;
    });

    setCreateQuestionState(prev => ({ ...prev, q: '', a: '', hints: [], newHint: '' }));
  };

  // Sidebar navigation handlers
  const navigateToHome = () => {
    setCurrentView('home');
    setCurrentFolder(null);
    setCurrentSubFolder(null);
    setNewSubjectName('');
    setNewSubjectName('');
    setPreviousView(null);
  };

  const navigateToObiettivi = () => {
    setCurrentView('obiettivi');
    setCurrentFolder(null);
    setPreviousView(null);
  };

  const navigateToStatistiche = () => {
    setCurrentView('statistiche');
    setCurrentFolder(null);
    setPreviousView(null);
  };

  const navigateToCalendar = () => {
    setCurrentView('calendar');
    setCurrentFolder(null);
    setPreviousView(null);
  }

  // Create Subject Flow
  const handleStartCreate = () => {
    setNewSubjectName('');
    setUploadFiles([]);
    setCurrentView('create_name');
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (newSubjectName.trim()) {
      setCurrentView('upload_files');
    }
  };

  const setFileDifficulty = (idx, difficulty) => {
    setUploadFiles(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], difficulty };
      return updated;
    });
  };

  const handleSaveUploadAndGoToGoals = () => {
    const targetFolder = currentView === 'upload_files' ? newSubjectName : currentFolder;

    setFileSystem(prev => {
      const updated = { ...prev };
      if (!updated[targetFolder]) {
        updated[targetFolder] = [];
      }

      let existingSubFolders = updated[targetFolder].filter(item => item.isFolder);
      if (existingSubFolders.length === 0) {
        for (let i = 1; i <= 5; i++) {
          updated[targetFolder].push({
            isFolder: true,
            name: `Capitolo ${i}`,
            files: []
          });
        }
        existingSubFolders = updated[targetFolder].filter(item => item.isFolder);
      }

      uploadFiles.forEach(f => {
        const contentStr = f.content || "Contenuto del file elaborato...";
        const chunkSize = Math.ceil(contentStr.length / 5) || 1;

        for (let i = 0; i < 5; i++) {
          const chunkStr = contentStr.slice(i * chunkSize, (i + 1) * chunkSize);
          existingSubFolders[i].files.push({
            name: `${f.name} - Parte ${i + 1}`,
            type: f.type || "pdf",
            difficulty: f.difficulty,
            pages: Math.ceil((f.pages || 1) / 5) || 1,
            words: Math.ceil((f.words || 1) / 5) || 1,
            content: chunkStr
          });
        }
      });
      return updated;
    });

    setUploadFiles([]);
    setCurrentFolder(targetFolder);
    setTempGoal({ deadline: "", dailyHours: 2, daysOfWeek: [] });
    setPreviousView(null);
    setCurrentView('set_goals');
  };

  const handleSaveGoals = () => {
    if (currentFolder) {
      setGoals(prev => ({
        ...prev,
        [currentFolder]: { ...tempGoal, progress: prev[currentFolder]?.progress || 0 }
      }));
    }

    if (previousView === 'obiettivi') {
      setCurrentView('obiettivi');
    } else {
      setCurrentView('folder');
    }
    setPreviousView(null);
  };

  const handleSkipGoals = () => {
    if (previousView === 'obiettivi') {
      setCurrentView('obiettivi');
    } else {
      setCurrentView('folder');
    }
    setPreviousView(null);
  };

  const toggleDay = (day) => {
    setTempGoal(prev => {
      const isSelected = prev.daysOfWeek.includes(day);
      return {
        ...prev,
        daysOfWeek: isSelected
          ? prev.daysOfWeek.filter(d => d !== day)
          : [...prev.daysOfWeek, day]
      };
    });
  };

  const handleReadFile = (file) => {
    setCurrentFile(file);
    setCurrentView('read_file');
  };

  const handleStudyFile = (file) => {
    setCurrentFile(file);
    setStudyState({ type: 'flashcards', currentIndex: 0, isFlipped: false, isRecording: false, transcript: '', feedback: null, isProcessing: false, score: null, activeHints: [], results: [], showResults: false });
    setCurrentView('study_mode');
  };

  const handleStudyFolder = (e, folderItem) => {
    e.stopPropagation();
    setCurrentSubFolder(folderItem.name);
    setCurrentFile({ name: folderItem.name });
    setStudyState({ type: 'flashcards', currentIndex: 0, isFlipped: false, isRecording: false, transcript: '', feedback: null, isProcessing: false, score: null, activeHints: [], results: [], showResults: false });
    setCurrentView('study_mode');
  };

  // Drag & Drop Handlers
  const onDragEnter = useCallback((e) => {
    e.preventDefault(); e.stopPropagation(); setIsDragActive(true);
  }, []);
  const onDragLeave = useCallback((e) => {
    e.preventDefault(); e.stopPropagation(); setIsDragActive(false);
  }, []);
  const onDragOver = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
  }, []);
  const onDrop = useCallback((e) => {
    e.preventDefault(); e.stopPropagation(); setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand" onClick={navigateToHome} style={{ cursor: 'pointer' }}>
          <Brain className="brand-icon" />
          Braynr
        </div>

        <nav className="nav-menu">
          <a onClick={navigateToHome} className={`nav-item ${['home', 'folder', 'read_file', 'study_mode'].includes(currentView) ? 'active' : ''}`}>
            <Home size={20} />
            <span>Home</span>
          </a>
          <a onClick={handleStartCreate} className={`nav-item ${['create_name', 'upload_files'].includes(currentView) ? 'active' : ''}`}>
            <UploadCloud size={20} />
            <span>Insert Sources</span>
          </a>
          <a onClick={navigateToObiettivi} className={`nav-item ${['obiettivi', 'select_subject_for_goal', 'set_goals'].includes(currentView) && previousView !== null ? 'active' : currentView === 'obiettivi' ? 'active' : ''}`}>
            <Target size={20} />
            <span>Goals</span>
          </a>
          <a onClick={navigateToCalendar} className={`nav-item ${currentView === 'calendar' ? 'active' : ''}`}>
            <CalendarDays size={20} />
            <span>Calendar</span>
          </a>
          <a onClick={navigateToStatistiche} className={`nav-item ${currentView === 'statistiche' ? 'active' : ''}`}>
            <BarChart2 size={20} />
            <span>Statistics</span>
          </a>
        </nav>

        <div className="nav-menu" style={{ flexGrow: 0, marginTop: 'auto' }}>
          <a className="nav-item">
            <Settings size={20} />
            <span>Settings</span>
          </a>
          <a className="nav-item">
            <LogOut size={20} />
            <span>Logout</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div className="greeting">
            {currentView === 'home' && (
              <>
                <h1>your collections</h1>
                <p>Select a subject to study or add new sources.</p>
              </>
            )}
            {currentView === 'folder' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={navigateToHome} className="btn-back">
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h1>{currentFolder}</h1>
                  <p>Your documents and notes for this subject.</p>
                </div>
              </div>
            )}
            {currentView === 'create_name' && (
              <>
                <h1>Create New Subject</h1>
                <p>Give the subject a name before uploading materials.</p>
              </>
            )}
            {currentView === 'upload_files' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 600 }}>
                  <span>Subject creation</span>
                  <ChevronRight size={16} />
                  <span style={{ color: 'var(--text-main)' }}>{newSubjectName}</span>
                </div>
                <h1>Add sources</h1>
                <p>Upload PDFs, slides, notes, audio or video to start studying.</p>
              </>
            )}
            {currentView === 'set_goals' && (
              <>
                {previousView === 'obiettivi' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 600 }}>
                    <span>Goals</span>
                    <ChevronRight size={16} />
                    <span style={{ color: 'var(--text-main)' }}>{currentFolder}</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 600 }}>
                    <span>Subject creation</span>
                    <ChevronRight size={16} />
                    <span>Source Upload</span>
                    <ChevronRight size={16} />
                    <span style={{ color: 'var(--text-main)' }}>Goals</span>
                  </div>
                )}

                <h1>{previousView === 'obiettivi' ? 'Edit or Set Goals' : 'Set Study Goals'}</h1>
                <p>Plan your study for <strong>{currentFolder}</strong>.</p>
              </>
            )}
            {currentView === 'select_subject_for_goal' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 600 }}>
                  <span style={{ cursor: 'pointer' }} onClick={navigateToObiettivi}>Goals</span>
                  <ChevronRight size={16} />
                  <span style={{ color: 'var(--text-main)' }}>Select Subject</span>
                </div>
                <h1>Add a new Goal</h1>
                <p>For which subject do you want to configure the study plan?</p>
              </>
            )}
            {currentView === 'obiettivi' && (
              <>
                <h1>Your Goals</h1>
                <p>Manage your deadlines and study pace for each subject.</p>
              </>
            )}
            {currentView === 'statistiche' && (
              <>
                <h1>Statistics and Progress</h1>
                <p>Monitor your results and consistency in studying.</p>
              </>
            )}
            {currentView === 'study_mode' && (
              <>
                <h1>Active Study Mode</h1>
                <p>Test yourself on the uploaded sources and receive immediate feedback.</p>
              </>
            )}
          </div>

          <div className="profile-section">
            <button className="btn-icon">
              <Bell size={24} />
              <span className="badge-dot"></span>
            </button>
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
              alt="User Profile"
              className="user-avatar"
            />
          </div>
        </header>

        <div className="content-area">
          {needsCheckIn && (
            <div className="modal-overlay">
              <motion.div className="modal-content" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}>
                <div className="modal-header">
                  <Activity size={32} color="var(--primary)" />
                  <h3>Daily Check-in</h3>
                </div>
                <div className="modal-body">
                  <p>Which subjects did you manage to study yesterday?</p>
                  <div className="checkin-subjects-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', margin: '1.5rem 0' }}>
                    {yesterdaySubjects.length > 0 ? (
                      yesterdaySubjects.map(subject => (
                        <label key={subject} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
                          <input type="checkbox" checked={checkedSubjects[subject] || false} onChange={() => toggleCheckedSubject(subject)} style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
                          <span style={{ fontSize: '1rem' }}>{subject}</span>
                        </label>
                      ))
                    ) : (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
                        <input type="checkbox" checked={checkedSubjects['general'] || false} onChange={() => toggleCheckedSubject('general')} style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
                        <span style={{ fontSize: '1rem' }}>I studied anyway outside the plan</span>
                      </label>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button onClick={() => { handleCheckIn(false); }} className="btn-checkin no"><XCircle size={18} /> I didn't study at all</button>
                  <button onClick={submitCheckIn} className="btn-checkin yes"><CheckCircle size={18} /> Save Answers</button>
                </div>
              </motion.div>
            </div>
          )}
          <AnimatePresence mode="wait">

            {/* VIEW: HOME (Folders) */}
            {currentView === 'home' && (
              <motion.div key="home" initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }} className="grid-container">
                {Object.keys(fileSystem).map((folderName, idx) => (
                  <motion.div key={idx} className="folder-card" whileHover={{ y: -5, scale: 1.02 }} onClick={() => { setCurrentFolder(folderName); setCurrentView('folder'); }} style={{ position: 'relative' }}>
                    <button className="btn-delete-folder" onClick={(e) => handleDeleteFolder(e, folderName)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', opacity: 0.5, transition: '0.2s' }}>
                      <Trash2 size={18} />
                    </button>
                    <div className="folder-icon-bg">
                      <Folder size={32} />
                    </div>
                    <h3>{folderName}</h3>
                    <p>{fileSystem[folderName].reduce((acc, curr) => curr.isFolder ? acc + curr.files.length : acc + 1, 0)} resources</p>
                  </motion.div>
                ))}

                <motion.div className="folder-card add-card" whileHover={{ y: -5, scale: 1.02 }} onClick={handleStartCreate}>
                  <div className="add-icon-bg">
                    <Plus size={36} />
                  </div>
                  <h3>New Subject</h3>
                </motion.div>

                {folderToDelete && (
                  <div className="modal-overlay" onClick={() => setFolderToDelete(null)}>
                    <motion.div className="modal-content" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }} onClick={(e) => e.stopPropagation()}>
                      <div className="modal-header">
                        <AlertTriangle size={32} color="#ef4444" />
                        <h3>Delete Subject</h3>
                      </div>
                      <div className="modal-body">
                        <p>Are you sure you want to delete the subject <strong>{folderToDelete}</strong>?</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>All uploaded files and associated goals will be permanently removed. This action is irreversible.</p>
                      </div>
                      <div className="modal-footer" style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => setFolderToDelete(null)} className="btn-skip" style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}>Cancel</button>
                        <button onClick={confirmDeleteFolder} className="btn-checkin no" style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}><Trash2 size={18} /> Delete</button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            )}

            {/* VIEW: FOLDER (Files inside) */}
            {currentView === 'folder' && (
              <motion.div key="folder" initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }}>
                {currentSubFolder && (
                  <div className="folder-header" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => setCurrentSubFolder(null)} className="btn-back" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%' }}>
                      <ArrowLeft size={20} />
                    </button>
                    <h2 style={{ margin: 0 }}>{currentSubFolder}</h2>
                  </div>
                )}
                <div className="files-list">
                  {!currentSubFolder ? (
                    fileSystem[currentFolder]?.map((item, idx) => (
                      item.isFolder ? (
                        <motion.div key={idx} className="file-card" style={{ cursor: 'pointer', background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)' }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} onClick={() => setCurrentSubFolder(item.name)}>
                          <div className="file-icon-bg" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                            <Folder size={24} color="#8b5cf6" />
                          </div>
                          <div className="file-info">
                            <h4>{item.name}</h4>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem' }}>
                              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{item.files?.length || 0} fragments present</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn-study" style={{ background: 'var(--primary)', color: 'white' }}>Open</button>
                            <button className="btn-study" onClick={(e) => handleStudyFolder(e, item)}><Zap size={16} /> Study</button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div key={idx} className="file-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                          <div className="file-icon-bg">
                            <FileText size={24} />
                          </div>
                          <div className="file-info">
                            <h4>{item.name}</h4>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem' }}>
                              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{item.pages || 15} p. • {item.words || 3000} words</span>
                              <span className={`difficulty-badge ${item.difficulty || 'notes'}`}>
                                {item.difficulty === 'notes' ? 'Personal Notes' : 
                                 item.difficulty === 'documentation' ? 'Official Documentation' : 
                                 (item.difficulty || 'medio')}
                              </span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn-read" onClick={() => handleReadFile(item)}>Read</button>
                          </div>
                        </motion.div>
                      )
                    ))
                  ) : (
                    fileSystem[currentFolder]?.find(f => f.name === currentSubFolder)?.files?.map((file, idx) => (
                      <motion.div key={idx} className="file-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                        <div className="file-icon-bg">
                          <FileText size={24} />
                        </div>
                        <div className="file-info">
                          <h4>{file.name}</h4>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem' }}>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{file.pages || 15} p. • {file.words || 3000} words</span>
                            <span className={`difficulty-badge ${file.difficulty || 'notes'}`}>
                              {file.difficulty === 'notes' ? 'Personal Notes' : 
                               file.difficulty === 'documentation' ? 'Official Documentation' : 
                               (file.difficulty || 'medio')}
                            </span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn-read" onClick={() => handleReadFile(file)}>Read</button>
                        </div>
                      </motion.div>
                    ))
                  )}

                  {((!currentSubFolder && fileSystem[currentFolder]?.length === 0) || (currentSubFolder && fileSystem[currentFolder]?.find(f => f.name === currentSubFolder)?.files?.length === 0)) && (
                    <div className="empty-state">
                      No files present in this {currentSubFolder ? 'subfolder' : 'subject'}.
                    </div>
                  )}

                  {!currentSubFolder && (
                    <motion.div
                      className="file-card add-file-card"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (fileSystem[currentFolder]?.length || 0) * 0.05 }}
                      onClick={() => { setUploadFiles([]); setCurrentView('upload_files'); }}
                    >
                      <Plus size={24} /> Add more resources
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* VIEW: READ FILE */}
            {currentView === 'read_file' && (
              <motion.div key="read_file" initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }} className="reader-container">
                <div className="reader-header">
                  <button onClick={() => setCurrentView('folder')} className="btn-back" style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ArrowLeft size={20} />
                  </button>
                  <h2 style={{ margin: 0 }}>{currentFile?.name}</h2>
                </div>
                <div className="reader-content">
                  {currentFile?.content ? (
                    <>
                      <h3>Audio Transcription</h3>
                      <div className="transcription-box" style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', marginTop: '1rem' }}>
                        <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', margin: 0 }}>{currentFile.content}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3>Introduction</h3>
                      <p>This is the content of the file <strong>{currentFile?.name}</strong>. In a real application, the PDF or selected document would be rendered here.</p>
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                      <h3>Key Concepts</h3>
                      <p>1. **Text Analysis**: The AI extracted keywords and key concepts to generate flashcards and mind maps.</p>
                      <p>2. **File Type**: This file is classified as <strong>{currentFile?.difficulty === 'notes' ? 'Personal Notes' : currentFile?.difficulty === 'documentation' ? 'Official Documentation' : (currentFile?.difficulty || 'Notes')}</strong>.</p>
                      <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.</p>
                    </>
                  )}

                  <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                    <button className="btn-save" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setCreateQuestionState({ ...createQuestionState, isOpen: true })}>
                      <Plus size={18} /> Create Flashcard / Question
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW: STUDY MODE */}
            {currentView === 'study_mode' && (
              <motion.div key="study_mode" initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }} className="study-container">

                <div className="study-header">
                  <button onClick={() => setCurrentView('folder')} className="btn-back">
                    <ArrowLeft size={20} />
                  </button>
                  <div>
                    <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Session in progress</span>
                    <h2 style={{ margin: '0.25rem 0 0 0' }}>{currentFile?.name}</h2>
                  </div>
                </div>

                <div className="study-toggle">
                  <button className={`toggle-btn ${studyState.type === 'flashcards' ? 'active' : ''}`} onClick={() => setStudyState({ ...studyState, type: 'flashcards', currentIndex: 0, activeHints: [], results: [], showResults: false })}>
                    Flashcards
                  </button>
                  <button className={`toggle-btn ${studyState.type === 'qa' ? 'active' : ''}`} onClick={() => setStudyState({ ...studyState, type: 'qa', currentIndex: 0, activeHints: [], results: [], showResults: false })}>
                    Open Questions (Audio)
                  </button>
                </div>

                {studyState.type === 'flashcards' && (
                  <div className="flashcard-area">
                    {currentSubjectFlashcards.length === 0 ? (
                      <div className="empty-state">
                        <BrainCircuit size={48} color="rgba(255,255,255,0.2)" style={{ marginBottom: '1rem' }} />
                        <h3>No Flashcards</h3>
                        <p>You haven't created any flashcards for this subject yet. Open a file to create them.</p>
                      </div>
                    ) : studyState.showResults ? (
                      <div className="flashcard-summary" style={{ textAlign: 'center', width: '100%', maxWidth: '700px', background: 'var(--panel-bg)', padding: '3rem', borderRadius: '24px', border: '1px solid var(--panel-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                        <BrainCircuit size={64} color="var(--primary)" style={{ marginBottom: '1.5rem', display: 'inline-block' }} />
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Session Complete!</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '3rem' }}>You've reviewed {currentSubjectFlashcards.length} flashcards.</p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                          <div style={{ background: 'rgba(239,68,68,0.1)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(239,68,68,0.2)' }}>
                            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#ef4444' }}>{studyState.results?.filter(r => r === 'hard').length || 0}</div>
                            <div style={{ fontSize: '1rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 600 }}>Hard</div>
                          </div>
                          <div style={{ background: 'rgba(245,158,11,0.1)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(245,158,11,0.2)' }}>
                            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#f59e0b' }}>{studyState.results?.filter(r => r === 'good').length || 0}</div>
                            <div style={{ fontSize: '1rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 600 }}>Unsure</div>
                          </div>
                          <div style={{ background: 'rgba(16,185,129,0.1)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(16,185,129,0.2)' }}>
                            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#10b981' }}>{studyState.results?.filter(r => r === 'easy').length || 0}</div>
                            <div style={{ fontSize: '1rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 600 }}>Easy</div>
                          </div>
                        </div>
                        
                        <button className="btn-save" onClick={() => setCurrentView('folder')} style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                          Back to Subject
                        </button>
                      </div>
                    ) : (
                      <>
                        <span style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Card {studyState.currentIndex + 1} of {currentSubjectFlashcards.length}</span>
                        <div className={`flashcard ${studyState.isFlipped ? 'flipped' : ''}`} onClick={() => setStudyState({ ...studyState, isFlipped: !studyState.isFlipped })}>
                          <div className="flashcard-inner">
                            <div className="flashcard-front">
                              <span className="flashcard-label">Question</span>
                              <p className="flashcard-text">{currentSubjectFlashcards[studyState.currentIndex]?.q}</p>
                              
                              {currentSubjectFlashcards[studyState.currentIndex]?.hints && currentSubjectFlashcards[studyState.currentIndex].hints.length > 0 && (
                                <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }} onClick={(e) => e.stopPropagation()}>
                                  {currentSubjectFlashcards[studyState.currentIndex].hints.map((hint, idx) => (
                                    <span key={idx} 
                                      onClick={() => {
                                        if (!studyState.activeHints?.includes(idx)) {
                                          setStudyState(prev => ({ ...prev, activeHints: [...(prev.activeHints || []), idx] }));
                                        }
                                      }}
                                      style={{ 
                                        backgroundColor: studyState.activeHints?.includes(idx) ? 'var(--primary)' : 'var(--surface)', 
                                        color: studyState.activeHints?.includes(idx) ? 'white' : 'var(--text-muted)',
                                        padding: '0.5rem 1rem', 
                                        borderRadius: '2rem', 
                                        fontSize: '0.875rem', 
                                        cursor: studyState.activeHints?.includes(idx) ? 'default' : 'pointer',
                                        border: '1px solid var(--border)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        transition: 'all 0.2s'
                                      }}>
                                      <Zap size={14} style={{ color: studyState.activeHints?.includes(idx) ? '#fef08a' : 'inherit' }} />
                                      {studyState.activeHints?.includes(idx) ? hint : 'Hint ' + (idx + 1)}
                                    </span>
                                  ))}
                                </div>
                              )}

                              <span style={{ position: 'absolute', bottom: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}><RefreshCw size={14} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> Click to flip</span>
                            </div>
                            <div className="flashcard-back">
                              <span className="flashcard-label" style={{ color: 'var(--success)' }}>Answer</span>
                              <p className="flashcard-text" style={{ fontSize: '1.25rem' }}>{currentSubjectFlashcards[studyState.currentIndex]?.a}</p>
                            </div>
                          </div>
                        </div>

                        {studyState.isFlipped && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flashcard-actions">
                            <button className="btn-fc hard" onClick={() => handleNextFlashcard('hard')}>I didn't know</button>
                            <button className="btn-fc good" onClick={() => handleNextFlashcard('good')}>Unsure</button>
                            <button className="btn-fc easy" onClick={() => handleNextFlashcard('easy')}>I knew</button>
                          </motion.div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {studyState.type === 'qa' && (
                  <div className="qa-area">
                    {currentSubjectQA.length === 0 ? (
                      <div className="empty-state">
                        <Mic size={48} color="rgba(255,255,255,0.2)" style={{ marginBottom: '1rem' }} />
                        <h3>No Open Questions</h3>
                        <p>You haven't created any open questions for this subject yet. Open a file to create them.</p>
                      </div>
                    ) : (
                      <>
                        <span style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Question {studyState.currentIndex + 1} of {currentSubjectQA.length}</span>
                        <div className="qa-question-box">
                          <p className="flashcard-text" style={{ margin: 0 }}>{currentSubjectQA[studyState.currentIndex]?.q}</p>
                          
                          {currentSubjectQA[studyState.currentIndex]?.hints && currentSubjectQA[studyState.currentIndex].hints.length > 0 && (
                            <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                              {currentSubjectQA[studyState.currentIndex].hints.map((hint, idx) => (
                                <span key={idx} 
                                  onClick={() => {
                                    if (!studyState.activeHints?.includes(idx)) {
                                      setStudyState(prev => ({ ...prev, activeHints: [...(prev.activeHints || []), idx] }));
                                    }
                                  }}
                                  style={{ 
                                    backgroundColor: studyState.activeHints?.includes(idx) ? 'var(--primary)' : 'var(--surface)', 
                                    color: studyState.activeHints?.includes(idx) ? 'white' : 'var(--text-muted)',
                                    padding: '0.5rem 1rem', 
                                    borderRadius: '2rem', 
                                    fontSize: '0.875rem', 
                                    cursor: studyState.activeHints?.includes(idx) ? 'default' : 'pointer',
                                    border: '1px solid var(--border)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.2s'
                                  }}>
                                  <Zap size={14} style={{ color: studyState.activeHints?.includes(idx) ? '#fef08a' : 'inherit' }} />
                                  {studyState.activeHints?.includes(idx) ? hint : 'Hint ' + (idx + 1)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {!studyState.transcript && !studyState.isProcessing && (
                          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                            <button className={`mic-btn ${studyState.isRecording ? 'recording' : ''}`} onClick={handleMicClick}>
                              {studyState.isRecording ? <Square size={32} /> : <Mic size={32} />}
                            </button>
                            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>{studyState.isRecording ? 'Listening... Click to end' : 'Click to record answer'}</p>
                          </div>
                        )}

                        {studyState.isProcessing && (
                          <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--primary)' }}>
                            <div className="icon-pulse" style={{ width: '60px', height: '60px', margin: '0 auto 1rem' }}><BrainCircuit size={30} /></div>
                            <p>Braynr AI analysis in progress...</p>
                          </div>
                        )}

                        {studyState.transcript && !studyState.isProcessing && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%', maxWidth: '700px' }}>
                            <div className="transcript-box">
                              <strong style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>YOUR ANSWER</strong>
                              "{studyState.transcript}"
                            </div>

                            {!studyState.feedback ? (
                              <button className="btn-save" style={{ width: '100%', marginTop: '2rem', padding: '1rem' }} onClick={handleEvaluateAudio}>
                                Evaluate Answer with AI
                              </button>
                            ) : (
                              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <div className="ai-feedback-box" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <div style={{ textAlign: 'center', minWidth: '80px' }}>
                                      <div className="ai-score">{studyState.score}</div>
                                      <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>POINTS</span>
                                    </div>
                                    <div style={{ borderLeft: '1px solid rgba(16, 185, 129, 0.3)', paddingLeft: '1.5rem' }}>
                                      <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#10b981' }}>
                                        <BrainCircuit size={18} /> AI FEEDBACK
                                      </strong>
                                      <p style={{ margin: 0, color: 'var(--text-main)', lineHeight: 1.6 }}>{studyState.feedback.general}</p>
                                    </div>
                                  </div>

                                  <div className="feedback-categories" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                    {studyState.feedback.categories.map((cat, idx) => (
                                      <div key={idx} className="category-bar">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                          <span style={{ color: 'var(--text-muted)' }}>{cat.name}</span>
                                          <span style={{ fontWeight: 600, color: cat.color }}>{cat.score}%</span>
                                        </div>
                                        <div className="progress-bar-bg" style={{ height: '6px' }}>
                                          <div className="progress-bar-fill" style={{ width: `${cat.score}%`, background: cat.color }}></div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <button className="btn-skip" style={{ width: '100%', marginTop: '1rem', padding: '1rem', border: '1px solid var(--primary)', color: 'var(--text-main)' }} onClick={handleNextQA}>
                                  Next Question
                                </button>
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* VIEW: CALENDAR */}
            {currentView === 'calendar' && (
              <motion.div key="calendar" initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }} className="calendar-view-container">
                <div className="calendar-header">
                  <h2 style={{ textTransform: 'capitalize' }}>{calendarDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</h2>
                  <div className="calendar-nav">
                    <button className="btn-nav" onClick={() => setCalendarDate(new Date())}>Today</button>
                    <button className="btn-nav" onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))}>&lt;</button>
                    <button className="btn-nav" onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))}>&gt;</button>
                  </div>
                </div>

                <div className="calendar-grid-header">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => <div key={d} className="weekday-label">{d}</div>)}
                </div>

                <div className="calendar-grid">
                  {getCalendarDays(calendarDate).map((day, idx) => {
                    const dayNameEn = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx % 7];
                    const dayNameIt = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"][idx % 7];
                    const activeSessions = [];

                    if (day) {
                      const year = calendarDate.getFullYear();
                      const month = String(calendarDate.getMonth() + 1).padStart(2, '0');
                      const dayStr = String(day).padStart(2, '0');
                      const cellDateStr = `${year}-${month}-${dayStr}`;

                      Object.entries(goals).forEach(([subject, goalInfo]) => {
                        const matchesDay = goalInfo.daysOfWeek.includes(dayNameEn) || goalInfo.daysOfWeek.includes(dayNameIt);
                        const isBeforeDeadline = !goalInfo.deadline || cellDateStr <= goalInfo.deadline;

                        if (matchesDay && isBeforeDeadline) {
                          activeSessions.push({ subject, hours: goalInfo.dailyHours, progress: goalInfo.progress });
                        }
                      });
                    }

                    const isToday = day &&
                      calendarDate.getFullYear() === new Date().getFullYear() &&
                      calendarDate.getMonth() === new Date().getMonth() &&
                      day === new Date().getDate();

                    return (
                      <div key={idx} className={`calendar-cell ${day ? '' : 'empty'} ${isToday ? 'today' : ''}`}>
                        {day && <span className="day-number">{day}</span>}
                        <div className="sessions-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          {activeSessions.length > 0 && (
                            <div className="interleaving-bar" style={{ display: 'flex', height: '10px', borderRadius: '5px', overflow: 'hidden', background: 'rgba(255,255,255,0.05)', marginTop: '0.5rem' }}>
                              {activeSessions.map((session, sIdx) => {
                                const totalHours = activeSessions.reduce((acc, s) => acc + s.hours, 0);
                                const widthPercent = (session.hours / totalHours) * 100;
                                return (
                                  <div
                                    key={sIdx}
                                    style={{
                                      width: `${widthPercent}%`,
                                      background: getSubjectColor(session.subject),
                                      opacity: session.progress === 100 ? 0.4 : 1,
                                      transition: 'all 0.3s ease'
                                    }}
                                    title={`${session.subject} (${session.hours}h)`}
                                  />
                                );
                              })}
                            </div>
                          )}

                          <div className="sessions-text-list" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            {activeSessions.map((session, sIdx) => (
                              <div key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '2px' }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: getSubjectColor(session.subject), flexShrink: 0 }}></span>
                                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{session.subject} ({session.hours}h)</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* VIEW: CREATE SUBJECT NAME */}
            {currentView === 'create_name' && (
              <motion.div key="create_name" initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }} className="center-container">
                <form onSubmit={handleNameSubmit} className="create-subject-form">
                  <div className="icon-pulse">
                    <FolderPlus size={48} />
                  </div>
                  <h2 style={{ marginBottom: '1.5rem' }}>What do you want to call the subject?</h2>
                  <input type="text" autoFocus placeholder="E.g. Calculus 2, Private Law..." value={newSubjectName} onChange={(e) => setNewSubjectName(e.target.value)} className="input-subject" />
                  <button type="submit" className="btn-upload" disabled={!newSubjectName.trim()} style={{ width: '100%', justifyContent: 'center' }}>
                    Next <ChevronRight size={20} />
                  </button>
                </form>
              </motion.div>
            )}

            {/* VIEW: UPLOAD FILES */}
            {currentView === 'upload_files' && (
              <motion.div key="upload_files" initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }} className="upload-container">
                <div className={`upload-zone ${isDragActive ? 'drag-active' : ''}`} onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDragOver={onDragOver} onDrop={onDrop}>
                  <div className="upload-icon-wrapper" style={{ transform: isDragActive ? 'scale(1.1)' : 'scale(1)', transition: '0.2s' }}>
                    <UploadCloud size={40} />
                  </div>

                  <h2>{isDragActive ? 'Drop files here...' : 'Drag and drop your files'}</h2>
                  <p>Add resources to <strong>{newSubjectName || currentFolder}</strong>. We support PDF, Word, PPT, images, audio and video.</p>

                  <input type="file" id="file-upload" style={{ display: 'none' }} multiple onChange={handleFileInput} disabled={isUploading} />
                  <label htmlFor="file-upload" className="btn-upload" style={{ opacity: isUploading ? 0.7 : 1, pointerEvents: isUploading ? 'none' : 'auto' }}>
                    {isUploading ? 'Processing in progress...' : 'Select from computer'}
                  </label>
                  {isUploading && (
                    <div style={{ marginTop: '1rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                      <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Audio transcription in progress with ElevenLabs...</span>
                    </div>
                  )}

                  <AnimatePresence>
                    {uploadFiles.length > 0 && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="files-preview-box">
                        <h3 className="preview-title"><CheckCircle2 size={18} color="#10b981" /> Files ready for analysis</h3>
                        <div className="preview-list">
                          {uploadFiles.map((file, idx) => (
                            <div key={idx} className="preview-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <FileIcon size={20} color="#a5b4fc" />
                                <div>
                                  <span style={{ display: 'block', fontWeight: 500 }}>{file.name}</span>
                                  {file.isTranscribing ? (
                                    <span style={{ fontSize: '0.75rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                      <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} /> Transcription in progress...
                                    </span>
                                  ) : file.error ? (
                                    <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>Error in transcription</span>
                                  ) : (
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{file.pages} p. • {file.words} words</span>
                                  )}
                                </div>
                              </div>
                              <div className="difficulty-selector">
                                {[
                                  { value: 'notes', label: 'Personal Notes' },
                                  { value: 'documentation', label: 'Official Documentation' }
                                ].map(type => (
                                  <button
                                    key={type.value}
                                    className={`diff-btn ${file.difficulty === type.value ? 'active' : ''} ${type.value}`}
                                    onClick={() => setFileDifficulty(idx, type.value)}
                                  >
                                    {type.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        <button className="btn-start-analysis" onClick={handleSaveUploadAndGoToGoals} disabled={isUploading} style={{ opacity: isUploading ? 0.5 : 1 }}>
                          {isUploading ? 'Please wait...' : 'Save and Continue'}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
                   {/* VIEW: SELECT SUBJECT FOR GOAL */}
            {currentView === 'select_subject_for_goal' && (
              <motion.div key="select_subject_for_goal" initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }} className="center-container">
                <div className="create-subject-form" style={{ padding: '3rem' }}>
                  <h2>Select the subject</h2>

                  <div className="subjects-list">
                    {Object.keys(fileSystem).length === 0 && (
                      <p style={{ color: 'var(--text-muted)' }}>You haven't created any subject yet.</p>
                    )}
                    {Object.keys(fileSystem).length > 0 && Object.keys(fileSystem).filter(subject => !goals[subject]).length === 0 && (
                      <p style={{ color: 'var(--text-muted)' }}>All your subjects already have a goal set.</p>
                    )}
                    {Object.keys(fileSystem).filter(subject => !goals[subject]).map(subject => (
                      <button
                        key={subject}
                        className="btn-subject-select"
                        onClick={() => {
                          setCurrentFolder(subject);
                          setTempGoal({ deadline: "", dailyHours: 2, daysOfWeek: [] });
                          setPreviousView('obiettivi');
                          setCurrentView('set_goals');
                        }}
                      >
                        <Folder size={20} color="#8b5cf6" /> {subject}
                      </button>
                    ))}
                  </div>

                  <button className="btn-skip" style={{ marginTop: '2rem' }} onClick={navigateToObiettivi}>
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            {/* VIEW: SET GOALS */}
            {currentView === 'set_goals' && (
              <motion.div key="set_goals" initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }} className="goals-view-container">
                <div className="goals-layout">
                  <div className="goals-form">
                    <div className="form-group">
                      <label><Calendar size={18} /> By when do you want to complete the study?</label>
                      <input type="date" className="input-date" value={tempGoal.deadline} onChange={(e) => setTempGoal({ ...tempGoal, deadline: e.target.value })} />
                    </div>

                    <div className="form-group">
                      <label><Clock size={18} /> Daily study hours (estimated)</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <input type="range" min="1" max="12" value={tempGoal.dailyHours} onChange={(e) => setTempGoal({ ...tempGoal, dailyHours: parseInt(e.target.value) })} className="range-slider" />
                        <span className="hours-display">{tempGoal.dailyHours} hours</span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label><CalendarDays size={18} /> On which days do you want to study?</label>
                      <div className="days-picker">
                        {DAYS.map(day => (
                          <button key={day} type="button" onClick={() => toggleDay(day)} className={`day-btn ${tempGoal.daysOfWeek.includes(day) ? 'active' : ''}`}>
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="goals-actions">
                      <button className="btn-skip" onClick={handleSkipGoals}>
                        {previousView === 'obiettivi' ? 'Cancel' : 'Skip (Optional)'}
                      </button>
                      <button className="btn-save" onClick={handleSaveGoals}>Save Goal</button>
                    </div>
                  </div>

                  <div className="suggestion-box">
                    <div className="suggestion-header">
                      <Sparkles size={20} color="#a78bfa" />
                      <span>Braynr AI Estimate</span>
                    </div>
                    <div className="suggestion-body">
                      {Object.values(goals).filter(g => g.progress === 100).length >= 3 ? (
                        <>
                          <p>Based on the analyzed materials ({fileSystem[currentFolder]?.length || 0} files) and your <strong>{Object.values(goals).filter(g => g.progress === 100).length} previous projects</strong>, we calculate that approximately <strong>14 hours</strong> of active study are necessary for deep learning.</p>
                          {tempGoal.daysOfWeek.length > 0 ? (
                            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
                              Studying <strong>{tempGoal.dailyHours} hours</strong> for <strong>{tempGoal.daysOfWeek.length} days</strong> per week, you will complete the subject in about <strong>{Math.ceil(14 / (tempGoal.dailyHours * tempGoal.daysOfWeek.length))} weeks</strong>.
                            </p>
                          ) : (
                            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Select study days to get a more accurate completion estimate.</p>
                          )}
                        </>
                      ) : (
                        <p style={{ color: 'var(--text-muted)' }}>
                          The AI estimation algorithm will activate after you have completed at least <strong>3 projects</strong>. This allows us to offer you a personalized and consistent estimate with your pace.
                          <br /><br />
                          You have currently completed <strong>{Object.values(goals).filter(g => g.progress === 100).length}</strong> projects.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW: OBIETTIVI */}
            {currentView === 'obiettivi' && (
              <motion.div key="obiettivi" initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }}>
                <div className="grid-container">
                  {Object.keys(goals).length === 0 && (
                    <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                      <Target size={48} color="rgba(255,255,255,0.2)" style={{ marginBottom: '1rem' }} />
                      <h3>No goal set</h3>
                      <p>Create a new goal or set one after uploading sources.</p>
                    </div>
                  )}

                  {Object.entries(goals).map(([subject, goalInfo]) => (
                    <div key={subject} className="goal-card" onClick={() => setViewingGoal(subject)}>
                      <div className="goal-header">
                        <Target size={24} color="var(--primary)" />
                        <h3>{subject}</h3>
                        {goalInfo.progress === 100 && <span className="badge-completed" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)', fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '6px', fontWeight: 600, marginLeft: 'auto' }}>Completed</span>}
                      </div>
                      <div className="goal-detail">
                        <Calendar size={16} />
                        <span>Deadline: {goalInfo.deadline ? new Date(goalInfo.deadline).toLocaleDateString('en-US') : 'Not set'}</span>
                      </div>
                      <div className="goal-detail">
                        <Clock size={16} />
                        <span>{goalInfo.dailyHours} hours per day</span>
                      </div>
                      <div className="goal-detail">
                        <CalendarDays size={16} />
                        <span>{goalInfo.daysOfWeek.length > 0 ? goalInfo.daysOfWeek.join(', ') : 'No days'}</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${goalInfo.progress || 0}%`, background: goalInfo.progress === 100 ? 'var(--success)' : 'var(--primary)' }}></div>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'block' }}>{goalInfo.progress || 0}% completed</span>
                    </div>
                  ))}

                  <motion.div
                    className="folder-card add-card"
                    whileHover={{ y: -5, scale: 1.02 }}
                    onClick={() => setCurrentView('select_subject_for_goal')}
                  >
                    <div className="add-icon-bg">
                      <Plus size={36} />
                    </div>
                    <h3>New Goal</h3>
                  </motion.div>

                </div>

                {viewingGoal && (
                  <div className="modal-overlay" onClick={() => setViewingGoal(null)}>
                    <motion.div className="modal-content" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }} onClick={(e) => e.stopPropagation()}>
                      <div className="modal-header">
                        <Target size={32} color="var(--primary)" />
                        <h3>{viewingGoal}</h3>
                        {goals[viewingGoal].progress === 100 && <span className="badge-completed" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)', fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '6px', fontWeight: 600, marginLeft: 'auto' }}>Completed</span>}
                      </div>
                      <div className="modal-body">
                        <div className="goal-detail" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Calendar size={18} />
                          <span><strong>Deadline:</strong> {goals[viewingGoal].deadline ? new Date(goals[viewingGoal].deadline).toLocaleDateString('en-US') : 'Not set'}</span>
                        </div>
                        <div className="goal-detail" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Clock size={18} />
                          <span><strong>Pace:</strong> {goals[viewingGoal].dailyHours} hours per day</span>
                        </div>
                        <div className="goal-detail" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <CalendarDays size={18} />
                          <span><strong>Days:</strong> {goals[viewingGoal].daysOfWeek.length > 0 ? goals[viewingGoal].daysOfWeek.join(', ') : 'No days'}</span>
                        </div>
                        <div style={{ marginTop: '1.5rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Progress</span>
                            <span>{goals[viewingGoal].progress || 0}%</span>
                          </div>
                          <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: `${goals[viewingGoal].progress || 0}%`, background: goals[viewingGoal].progress === 100 ? 'var(--success)' : 'var(--primary)' }}></div>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer" style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => setViewingGoal(null)} className="btn-skip" style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}>Close</button>
                        <button onClick={() => {
                          setCurrentFolder(viewingGoal);
                          setTempGoal(goals[viewingGoal]);
                          setPreviousView('obiettivi');
                          setCurrentView('set_goals');
                          setViewingGoal(null);
                        }} className="btn-save" style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'var(--primary)', color: 'white', border: 'none' }}>Edit</button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            )}

            {/* VIEW: STATISTICHE */}
            {currentView === 'statistiche' && (
              <motion.div key="statistiche" initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }}>
                <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>

                  {/* CARD 1: STREAK */}
                  <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div className="stat-header"><Flame color="#f97316" /> <h3>Daily Streak</h3></div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '1rem 0' }}>
                      <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.flashcards.streakDays}</span>
                      <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>days</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)' }}>Consecutive studies completed. Keep it up!</p>
                  </div>

                  {/* CARD 2: RETENTION CIRCLE */}
                  <div className="stat-card">
                    <div className="stat-header"><BrainCircuit color="#3b82f6" /> <h3>Flashcard Retention</h3></div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px', margin: '1rem 0' }}>
                      <svg width="120" height="120" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                        <circle cx="60" cy="60" r="50" fill="none" stroke="#3b82f6" strokeWidth="8"
                          strokeDasharray={`${2 * Math.PI * 50}`}
                          strokeDashoffset={`${2 * Math.PI * 50 * (1 - stats.flashcards.retentionRate / 100)}`}
                          strokeLinecap="round"
                          transform="rotate(-90 60 60)"
                          style={{ transition: 'stroke-dashoffset 1s ease' }}
                        />
                        <text x="60" y="68" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">{stats.flashcards.retentionRate}%</text>
                      </svg>
                    </div>
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Out of {stats.flashcards.reviewCount} total reviews.</p>
                  </div>

                  {/* CARD 3: QA SCORE CIRCLE */}
                  <div className="stat-card">
                    <div className="stat-header"><HelpCircle color="#10b981" /> <h3>Q&A Evaluation</h3></div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px', margin: '1rem 0' }}>
                      <svg width="120" height="120" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                        <circle cx="60" cy="60" r="50" fill="none" stroke="#10b981" strokeWidth="8"
                          strokeDasharray={`${2 * Math.PI * 50}`}
                          strokeDashoffset={`${2 * Math.PI * 50 * (1 - stats.qa.averageScore / 100)}`}
                          strokeLinecap="round"
                          transform="rotate(-90 60 60)"
                          style={{ transition: 'stroke-dashoffset 1s ease' }}
                        />
                        <text x="60" y="68" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">{stats.qa.averageScore}</text>
                      </svg>
                    </div>
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Average out of {stats.qa.questionsAnswered} answers given.</p>
                  </div>

                </div>

                {/* CARD 4: BAR CHART (WIDE) */}
                <div className="stat-card wide" style={{ marginBottom: '1.5rem' }}>
                  <div className="stat-header"><Clock color="#f59e0b" /> <h3>Weekly Study Hours Distribution</h3></div>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Total hours planned for each subject based on your goals.</p>
                  <div className="bar-chart" style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', height: '200px', marginTop: '2.5rem', paddingBottom: '1.5rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
                    {Object.keys(goals).length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', width: '100%', textAlign: 'center', alignSelf: 'center' }}>No goal set to calculate hours.</p>
                    ) : (
                      Object.entries(goals).map(([subject, goalInfo]) => {
                        const hours = goalInfo.dailyHours * goalInfo.daysOfWeek.length;
                        const maxHours = Math.max(...Object.values(goals).map(g => g.dailyHours * g.daysOfWeek.length), 1);
                        const heightPercent = (hours / maxHours) * 100;
                        return (
                          <div key={subject} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', height: '100%' }}>
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                              <div style={{ width: '100%', height: `${heightPercent}%`, background: getSubjectColor(subject), borderRadius: '8px 8px 0 0', position: 'relative', minHeight: '5px' }}>
                                <span style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.85rem', fontWeight: 'bold' }}>{hours}h</span>
                              </div>
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>{subject}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* CARD 5: ADHERENCE (WIDE) */}
                <div className="stat-card wide">
                  <div className="stat-header"><Activity color="#8b5cf6" /> <h3>Consistency with Study Plan</h3></div>
                  <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                    Your last two weeks. You have an adherence rate of <strong style={{ color: 'white' }}>{Math.round((stats.adherence.completedDays / Math.max(1, (stats.adherence.completedDays + stats.adherence.missedDays))) * 100)}%</strong>.
                  </p>
                  <div className="adherence-graph" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}>
                    {stats.adherence.history.map((studied, i) => (
                      <div key={i} className={`adherence-day ${studied ? 'studied' : 'missed'}`} title={studied ? "Studied" : "Skipped"} style={{ flex: 1, height: '30px', borderRadius: '6px', cursor: 'pointer' }}></div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {createQuestionState.isOpen && (
          <div className="modal-overlay" onClick={() => setCreateQuestionState({ ...createQuestionState, isOpen: false })}>
            <motion.div className="modal-content" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header" style={{ flexDirection: 'column', textAlign: 'center', paddingBottom: 0 }}>
                <div style={{ backgroundColor: 'var(--surface)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem', display: 'inline-flex' }}>
                  <BrainCircuit size={32} color="var(--primary)" />
                </div>
                <h3 style={{ margin: 0 }}>Create Questions</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem', marginBottom: 0 }}>Add multiple flashcards or open questions to test your knowledge.</p>
              </div>
              <div className="modal-body" style={{ paddingTop: '1.5rem' }}>
                <div className="study-toggle" style={{ margin: '0 0 1.5rem 0', width: '100%', display: 'flex' }}>
                  <button type="button" className={`toggle-btn ${createQuestionState.type === 'flashcards' ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setCreateQuestionState({ ...createQuestionState, type: 'flashcards' })}>Flashcard</button>
                  <button type="button" className={`toggle-btn ${createQuestionState.type === 'qa' ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setCreateQuestionState({ ...createQuestionState, type: 'qa' })}>Open Question</button>
                </div>
                <form onSubmit={handleCreateQuestion}>
                  <div style={{ display: 'flex', gap: '2rem' }}>
                    {/* Left Column: Q & A */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div className="form-group" style={{ marginBottom: '1rem', flex: createQuestionState.type === 'flashcards' ? 1 : 'none', display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Question</label>
                        <textarea className="input-subject" style={{ minHeight: createQuestionState.type === 'flashcards' ? '80px' : '150px', marginBottom: 0, fontSize: '1rem', flex: 1 }} placeholder="Enter the question..." value={createQuestionState.q} onChange={e => setCreateQuestionState({ ...createQuestionState, q: e.target.value })} required />
                      </div>
                      {createQuestionState.type === 'flashcards' && (
                        <div className="form-group" style={{ marginBottom: '0', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <label style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Answer (for you)</label>
                          <textarea className="input-subject" style={{ minHeight: '80px', marginBottom: 0, fontSize: '1rem', flex: 1 }} placeholder="Enter the answer..." value={createQuestionState.a} onChange={e => setCreateQuestionState({ ...createQuestionState, a: e.target.value })} required />
                        </div>
                      )}
                    </div>

                    {/* Right Column: Hints */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div className="form-group" style={{ marginBottom: '0', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Hints / Keywords (Optional)</label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <input type="text" className="input-subject" style={{ marginBottom: 0 }} placeholder="Add a hint..." value={createQuestionState.newHint || ''} onChange={e => setCreateQuestionState({ ...createQuestionState, newHint: e.target.value })} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddHint(e); } }} />
                          <button type="button" className="btn-save" onClick={handleAddHint} style={{ padding: '0.5rem 1rem' }}>Add</button>
                        </div>
                        <div style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.1)', padding: '1rem', borderRadius: '0.5rem', overflowY: 'auto', minHeight: '120px' }}>
                          {createQuestionState.hints && createQuestionState.hints.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignContent: 'flex-start' }}>
                              {createQuestionState.hints.map((hint, idx) => (
                                <span key={idx} style={{ backgroundColor: 'var(--surface)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--border)' }}>
                                  {hint}
                                  <XCircle size={14} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => handleRemoveHint(idx)} />
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'block', textAlign: 'center', marginTop: '1rem' }}>No hints added yet.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button type="button" onClick={() => setCreateQuestionState({ ...createQuestionState, isOpen: false })} className="btn-skip" style={{ margin: 0 }}>Done</button>
                    <button type="submit" className="btn-save" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Plus size={18} /> Add Question</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
