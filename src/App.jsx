import React, { useState, useCallback, useEffect } from 'react';
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
  Zap,
  BookOpen
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

const ETHICS_OF_AI_PARTS = [
  {
    id: "intro",
    name: "Introduction",
    color: "#8b5cf6",
    chapters: [
      { id: 9001, name: "Introduction", difficulty: "medio", pages: 18, words: 4800, content: "§ Intervening in the ethics of AI: a systematic delineation of the power-aware approach\n§ We must adopt a critical anthropocentrism in the ethics of AI\n§ The ethics of AI needs to forge an alliance with social philosophy and critical theories\n§ Ethics needs a two-step methodology: from critique to normativity\n§ Structure of the book" }
    ]
  },
  {
    id: "part1",
    name: "Part I – The Power of AI",
    color: "#3b82f6",
    chapters: [
      { id: 9002, name: "Ch.1 – What AI Are We Talking About?", difficulty: "medio", pages: 22, words: 6200, content: "§ What concept of AI we use is an ethical and political, not an objective question\n§ Ethics of AI beyond anthropomorphism\n§ Working in the ethics of AI requires cultivating an ethos of seeing power structures\n§ The assemblage perspective on AI is not an alternative ontology but an ethical stance" },
      { id: 9003, name: "Ch.2 – Human-Aided AI", difficulty: "medio", pages: 28, words: 7900, content: "§ Contemporary AI systems as hybrid computing networks\n§ The first thesis of Human-Aided AI\n§ The second thesis of Human-Aided AI\n§ The third thesis of Human-Aided AI\n§ The reproduction of Human-Aided AI\n§ Click-work\n§ Commercial content moderation and the social costs of click-work" },
      { id: 9004, name: "Ch.3 – Digital Counter-Enlightenment and the Power of Design", difficulty: "difficile", pages: 24, words: 6800, content: "§ Interface nudges and digital choice architectures\n§ Sealed surfaces and the demobilisation of instrumentality\n§ Subjectivity of digital counter-enlightenment\n§ AI in the history of networked media\n§ The Web as a real-time behavioural laboratory\n§ The dual business model of digital media" },
      { id: 9005, name: "Ch.4 – Subjectivity and Power in the Ethics of AI", difficulty: "difficile", pages: 20, words: 5600, content: "§ Subjectivity and power in contemporary AI\n§ AI and social structures\n§ AI extractivism and digital colonialism\n§ AI extractivism revisited\n§ Systemic critique and ethics beyond individualism" }
    ]
  },
  {
    id: "part2",
    name: "Part II – The Power of Prediction",
    color: "#10b981",
    chapters: [
      { id: 9006, name: "Ch.5 – AI Systems as Prediction Machines", difficulty: "difficile", pages: 22, words: 6100, content: "§ Predictive analytics: functional characterisation\n§ Inference vs prediction: the prediction gap\n§ Predictive performance as the new truth\n§ Frequentist vs Bayesian probability\n§ Automating Sherlock Holmes and the ethics of statistical reasoning\n§ Contemporary AI as prediction power" },
      { id: 9007, name: "Ch.6 – Predictive Privacy", difficulty: "difficile", pages: 20, words: 5500, content: "§ The concept of predictive privacy (first definition)\n§ A new form of privacy violation\n§ Collective harms: our data affect others\n§ Predictive privacy as a collective interest (second definition)\n§ Targeted advertising\n§ Case study: psychological targeting in election campaigns\n§ Regulating prediction power: why we need a preventive approach" },
      { id: 9008, name: "Ch.7 – The Culture of Prediction: Ethics and Epistemology", difficulty: "difficile", pages: 18, words: 5000, content: "§ A brief genealogy of predictive targeting in the history of cybernetics\n§ The new culture of algorithmic modelling\n§ The demise of explainability\n§ Two demands of explainability\n§ Case-based vs system-level explainability\n§ Ethics at the end of theory" }
    ]
  },
  {
    id: "part3",
    name: "Part III – The Power of Control",
    color: "#ef4444",
    chapters: [
      { id: 9009, name: "Ch.8 – AI Cybernetics", difficulty: "difficile", pages: 16, words: 4400, content: "§ A brief genealogy of predictive targeting in the history of cybernetics\n§ Cybernetics of social structures\n§ The performativity of predictive AI\n§ The cybernetic leviathan?\n§ Prediction power" },
      { id: 9010, name: "Ch.9 – Opacity in Machine Learning and Predictive Analytics", difficulty: "difficile", pages: 14, words: 3900, content: "§ Control power: manipulation and discrimination\n§ The demise of explainability\n§ Responsibility is greater than instrumental control\n§ Case-based vs system-level explainability" },
      { id: 9011, name: "Ch.10 – Bias in Cybernetic AI Systems", difficulty: "difficile", pages: 16, words: 4500, content: "§ First- vs second-degree bias\n§ Biased feasibility of feedback loops\n§ Cybernetic leviathan and control power\n§ Ethics of AI beyond individualism" },
      { id: 9012, name: "Ch.11 – Collective Responsibility in the Ethics of AI", difficulty: "medio", pages: 18, words: 5100, content: "§ Collective responsibility without responsibilisation\n§ Political action without paternalism\n§ Collective responsibility\n§ Ethics of AI as digital enlightenment" }
    ]
  },
  {
    id: "conclusion",
    name: "Conclusion – Manifesto for a Power-Aware Ethics of AI",
    color: "#a855f7",
    chapters: [
      { id: 9013, name: "Conclusion – Manifesto", difficulty: "medio", pages: 12, words: 3400, content: "§ Ethics of AI as digital enlightenment\n§ Ethics needs a two-step methodology: from critique to normativity\n§ Working in the ethics of AI requires cultivating an ethos of seeing power structures\n§ We must adopt a critical anthropocentrism in the ethics of AI\n§ Responsibility is greater than instrumental control\n§ Collective responsibility without responsibilisation; political action without paternalism" }
    ]
  }
];

function computeArgumentSchedule(goals, subjectArguments) {
  const schedule = {};
  const dayNames = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
  Object.entries(subjectArguments).forEach(([subject, args]) => {
    if (!args || args.length === 0) return;
    const goalInfo = goals[subject];
    if (!goalInfo?.daysOfWeek?.length) return;
    let deadlineDay = 31;
    if (goalInfo.deadline) {
      const d = new Date(goalInfo.deadline);
      if (d.getFullYear() === 2026 && d.getMonth() === 4) deadlineDay = d.getDate();
      else if (d < new Date('2026-05-01')) return;
    }
    const studyDays = [];
    for (let day = 1; day <= deadlineDay; day++) {
      const weekday = dayNames[new Date(2026, 4, day).getDay()];
      if (goalInfo.daysOfWeek.includes(weekday)) studyDays.push(day);
    }
    if (!studyDays.length) return;
    const sortedArgs = [...args].sort((a, b) => a.order - b.order);
    const daysPerArg = studyDays.length / sortedArgs.length;
    sortedArgs.forEach((arg, i) => {
      const start = Math.floor(i * daysPerArg);
      const end = Math.floor((i + 1) * daysPerArg);
      for (let d = start; d < end && d < studyDays.length; d++) {
        const key = `2026-05-${String(studyDays[d]).padStart(2, '0')}`;
        if (!schedule[key]) schedule[key] = {};
        schedule[key][subject] = arg.title;
      }
    });
    const lastConsumed = Math.floor(sortedArgs.length * daysPerArg);
    for (let d = lastConsumed; d < studyDays.length; d++) {
      const key = `2026-05-${String(studyDays[d]).padStart(2, '0')}`;
      if (!schedule[key]) schedule[key] = {};
      schedule[key][subject] = sortedArgs[sortedArgs.length - 1].title;
    }
  });
  return schedule;
}

function App() {
  // Navigation & Hierarchy State
  const [currentView, setCurrentView] = useState('home'); // 'home', 'folder', 'create_name', 'upload_files', 'set_goals', 'obiettivi', 'select_subject_for_goal', 'statistiche', 'read_file', 'study_mode', 'calendar'
  const [currentFolder, setCurrentFolder] = useState(null);
  const [currentPart, setCurrentPart] = useState(null);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [previousView, setPreviousView] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  
  // Mock File System State
  const [fileSystem, setFileSystem] = useState(() => {
    const saved = localStorage.getItem('fileSystem');
    const base = saved ? JSON.parse(saved) : {
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
    if (!base["The Ethics of AI"]) {
      base["The Ethics of AI"] = [];
    }
    return base;
  });

  // Goals State
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('goals');
    const base = saved ? JSON.parse(saved) : {
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
    if (!base["The Ethics of AI"]) {
      base["The Ethics of AI"] = {
        deadline: "2026-05-31",
        dailyHours: 2,
        daysOfWeek: ["Lun", "Mer", "Ven"],
        progress: 8
      };
    }
    return base;
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

  const DAYS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

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
        difficulty: 'medio',
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
        setUploadFiles(prev => prev.map(f => {
          if (f.id === placeholder.id) {
            return {
              ...f,
              pages: Math.floor(Math.random() * 40) + 10,
              words: Math.floor(Math.random() * 10000) + 2000
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
    score: null
  });

  const [subjectQuestions, setSubjectQuestions] = useState(() => {
    const saved = localStorage.getItem('subjectQuestions');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('subjectQuestions', JSON.stringify(subjectQuestions));
  }, [subjectQuestions]);

  const [subjectArguments, setSubjectArguments] = useState(() => {
    const saved = localStorage.getItem('subjectArguments');
    const base = saved ? JSON.parse(saved) : {};
    if (!base["The Ethics of AI"]) {
      base["The Ethics of AI"] = [
        { id: 1,  title: "Introduction", order: 0 },
        { id: 2,  title: "Ch.1 – What AI Are We Talking About?", order: 1 },
        { id: 3,  title: "Ch.2 – Human-Aided AI", order: 2 },
        { id: 4,  title: "Ch.3 – Digital Counter-Enlightenment and the Power of Design", order: 3 },
        { id: 5,  title: "Ch.4 – Subjectivity and Power in the Ethics of AI", order: 4 },
        { id: 6,  title: "Ch.5 – AI Systems as Prediction Machines", order: 5 },
        { id: 7,  title: "Ch.6 – Predictive Privacy", order: 6 },
        { id: 8,  title: "Ch.7 – The Culture of Prediction: Ethics and Epistemology", order: 7 },
        { id: 9,  title: "Ch.8 – AI Cybernetics", order: 8 },
        { id: 10, title: "Ch.9 – Opacity in ML and Predictive Analytics", order: 9 },
        { id: 11, title: "Ch.10 – Bias in Cybernetic AI Systems", order: 10 },
        { id: 12, title: "Ch.11 – Collective Responsibility in the Ethics of AI", order: 11 },
        { id: 13, title: "Conclusion – Manifesto for a Power-Aware Ethics of AI", order: 12 }
      ];
    }
    return base;
  });

  useEffect(() => {
    localStorage.setItem('subjectArguments', JSON.stringify(subjectArguments));
  }, [subjectArguments]);

  const [argumentManagerOpen, setArgumentManagerOpen] = useState(false);
  const [newArgumentTitle, setNewArgumentTitle] = useState('');

  const [createQuestionState, setCreateQuestionState] = useState({
    isOpen: false,
    type: 'flashcards',
    q: '',
    a: ''
  });

  // Check-in logic
  const todayDateStr = new Date().toDateString();
  const [needsCheckIn, setNeedsCheckIn] = useState(true);

  const yesterday = new Date(Date.now() - 86400000);
  const dayNames = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
  const yesterdayDayName = dayNames[yesterday.getDay()];

  const yesterdaySubjects = [];
  Object.entries(goals).forEach(([subject, goalInfo]) => {
    if (goalInfo.daysOfWeek.includes(yesterdayDayName)) {
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
    setSubjectArguments(prev => {
      const updated = { ...prev };
      delete updated[folderToDelete];
      return updated;
    });
    setFolderToDelete(null);
  };

  const handleAddArgument = (e) => {
    e.preventDefault();
    if (!newArgumentTitle.trim() || !currentFolder) return;
    const existing = subjectArguments[currentFolder] || [];
    setSubjectArguments(prev => ({
      ...prev,
      [currentFolder]: [...existing, { id: Date.now(), title: newArgumentTitle.trim(), order: existing.length }]
    }));
    setNewArgumentTitle('');
  };

  const handleDeleteArgument = (argId) => {
    if (!currentFolder) return;
    setSubjectArguments(prev => ({
      ...prev,
      [currentFolder]: (prev[currentFolder] || [])
        .filter(a => a.id !== argId)
        .map((a, idx) => ({ ...a, order: idx }))
    }));
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
  const currentSubjectFlashcards = subjectQuestions[currentFolder]?.flashcards || [];
  const currentSubjectQA = subjectQuestions[currentFolder]?.qa || [];

  const handleMicClick = () => {
    if (studyState.isRecording) {
      setStudyState({ ...studyState, isRecording: false, isProcessing: true });
      setTimeout(() => {
        setStudyState(prev => ({
          ...prev, 
          isProcessing: false,
          transcript: "Questa è una risposta vocale simulata dall'IA dopo aver ascoltato il tuo audio per la domanda: " + (currentSubjectQA[prev.currentIndex]?.q || ''),
        }));
      }, 1500);
    } else {
      setStudyState({ ...studyState, isRecording: true, transcript: '', feedback: null, score: null });
    }
  };

  const handleEvaluateAudio = () => {
    setStudyState({ ...studyState, isProcessing: true });
    setTimeout(() => {
      setStudyState(prev => ({
        ...prev, 
        isProcessing: false,
        feedback: "Feedback IA simulato: Ottima spiegazione, concetti chiari! Ricorda solo di approfondire leggermente il contesto.",
        score: Math.floor(Math.random() * 30) + 70 // Random score between 70 and 100
      }));
    }, 2000);
  };

  const handleNextFlashcard = () => {
    if (studyState.currentIndex < currentSubjectFlashcards.length - 1) {
      setStudyState({ ...studyState, currentIndex: studyState.currentIndex + 1, isFlipped: false });
    } else {
      setCurrentView('folder'); // Or show completion screen
    }
  };

  const handleNextQA = () => {
    if (studyState.currentIndex < currentSubjectQA.length - 1) {
      setStudyState({ ...studyState, currentIndex: studyState.currentIndex + 1, transcript: '', feedback: null, score: null, isRecording: false });
    } else {
      setCurrentView('folder');
    }
  };

  const handleCreateQuestion = (e) => {
    e.preventDefault();
    if (!createQuestionState.q.trim()) return;

    setSubjectQuestions(prev => {
      const subject = currentFolder;
      const updated = { ...prev };
      if (!updated[subject]) {
        updated[subject] = { flashcards: [], qa: [] };
      }
      if (createQuestionState.type === 'flashcards') {
        updated[subject].flashcards.push({ q: createQuestionState.q, a: createQuestionState.a });
      } else {
        updated[subject].qa.push({ q: createQuestionState.q });
      }
      return updated;
    });

    setCreateQuestionState({ isOpen: false, type: 'flashcards', q: '', a: '' });
  };

  // Sidebar navigation handlers
  const navigateToHome = () => {
    setCurrentView('home');
    setCurrentFolder(null);
    setUploadFiles([]);
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
      
      const formattedFiles = uploadFiles.map(f => ({ 
        name: f.name, 
        type: f.type || "pdf",
        difficulty: f.difficulty,
        pages: f.pages,
        words: f.words,
        content: f.content
      }));
      updated[targetFolder] = [...updated[targetFolder], ...formattedFiles];
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
    setStudyState({ type: 'flashcards', currentIndex: 0, isFlipped: false, isRecording: false, transcript: '', feedback: null, isProcessing: false, score: null });
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
        <div className="brand" onClick={navigateToHome} style={{cursor: 'pointer'}}>
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
            <span>Inserisci Fonti</span>
          </a>
          <a onClick={navigateToObiettivi} className={`nav-item ${['obiettivi', 'select_subject_for_goal', 'set_goals'].includes(currentView) && previousView !== null ? 'active' : currentView === 'obiettivi' ? 'active' : ''}`}>
            <Target size={20} />
            <span>Obiettivi</span>
          </a>
          <a onClick={navigateToCalendar} className={`nav-item ${currentView === 'calendar' ? 'active' : ''}`}>
            <CalendarDays size={20} />
            <span>Calendario</span>
          </a>
          <a onClick={navigateToStatistiche} className={`nav-item ${currentView === 'statistiche' ? 'active' : ''}`}>
            <BarChart2 size={20} />
            <span>Statistiche</span>
          </a>
        </nav>

        <div className="nav-menu" style={{ flexGrow: 0, marginTop: 'auto' }}>
          <a className="nav-item">
            <Settings size={20} />
            <span>Impostazioni</span>
          </a>
          <a className="nav-item">
            <LogOut size={20} />
            <span>Esci</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div className="greeting">
            {currentView === 'home' && (
              <>
                <h1>Il tuo Knowledge</h1>
                <p>Seleziona una materia per studiare o aggiungi nuove fonti.</p>
              </>
            )}
            {currentView === 'folder' && (
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <button onClick={navigateToHome} className="btn-back">
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h1>{currentFolder}</h1>
                  <p>{currentFolder === 'The Ethics of AI' ? 'Rainer Mühlhoff · Seleziona un argomento per iniziare.' : 'I tuoi documenti e appunti per questa materia.'}</p>
                </div>
              </div>
            )}
            {currentView === 'part_folder' && (
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <button onClick={() => { setCurrentPart(null); setCurrentView('folder'); }} className="btn-back">
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.25rem', fontWeight: 600, fontSize: '0.85rem'}}>
                    <span style={{cursor:'pointer'}} onClick={() => { setCurrentPart(null); setCurrentView('folder'); }}>{currentFolder}</span>
                    <ChevronRight size={14} />
                    <span style={{color: 'var(--text-muted)'}}>{currentPart?.name}</span>
                  </div>
                  <h1>{currentPart?.name}</h1>
                  <p>{currentPart?.chapters?.length} capitoli in questo argomento.</p>
                </div>
              </div>
            )}
            {currentView === 'create_name' && (
              <>
                <h1>Crea Nuova Materia</h1>
                <p>Dai un nome alla materia prima di caricare i materiali.</p>
              </>
            )}
            {currentView === 'upload_files' && (
              <>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 600}}>
                  <span>Creazione materia</span>
                  <ChevronRight size={16} />
                  <span style={{color: 'var(--text-main)'}}>{newSubjectName}</span>
                </div>
                <h1>Aggiungi le fonti</h1>
                <p>Carica PDF, slide, appunti, audio o video per iniziare a studiare.</p>
              </>
            )}
            {currentView === 'set_goals' && (
              <>
                {previousView === 'obiettivi' ? (
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 600}}>
                    <span>Obiettivi</span>
                    <ChevronRight size={16} />
                    <span style={{color: 'var(--text-main)'}}>{currentFolder}</span>
                  </div>
                ) : (
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 600}}>
                    <span>Creazione materia</span>
                    <ChevronRight size={16} />
                    <span>Upload Fonti</span>
                    <ChevronRight size={16} />
                    <span style={{color: 'var(--text-main)'}}>Obiettivi</span>
                  </div>
                )}
                
                <h1>{previousView === 'obiettivi' ? 'Modifica o Imposta Obiettivi' : 'Imposta Obiettivi di Studio'}</h1>
                <p>Pianifica lo studio per <strong>{currentFolder}</strong>.</p>
              </>
            )}
            {currentView === 'select_subject_for_goal' && (
              <>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 600}}>
                  <span style={{cursor: 'pointer'}} onClick={navigateToObiettivi}>Obiettivi</span>
                  <ChevronRight size={16} />
                  <span style={{color: 'var(--text-main)'}}>Seleziona Materia</span>
                </div>
                <h1>Aggiungi un nuovo Obiettivo</h1>
                <p>Per quale materia vuoi configurare il piano di studio?</p>
              </>
            )}
            {currentView === 'obiettivi' && (
              <>
                <h1>I tuoi Obiettivi</h1>
                <p>Gestisci le tue scadenze e ritmi di studio per ogni materia.</p>
              </>
            )}
            {currentView === 'statistiche' && (
              <>
                <h1>Statistiche e Progressi</h1>
                <p>Monitora i tuoi risultati e la costanza nello studio.</p>
              </>
            )}
            {currentView === 'study_mode' && (
              <>
                <h1>Modalità Studio Attivo</h1>
                <p>Mettiti alla prova sulle fonti caricate e ricevi feedback immediato.</p>
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
              alt="Profilo Utente" 
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
                  <h3>Check-in Giornaliero</h3>
                </div>
                <div className="modal-body">
                  <p>Quali materie sei riuscito a studiare ieri?</p>
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
                        <span style={{ fontSize: '1rem' }}>Ho studiato comunque extra-piano</span>
                      </label>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button onClick={() => { handleCheckIn(false); }} className="btn-checkin no"><XCircle size={18} /> Non ho studiato affatto</button>
                  <button onClick={submitCheckIn} className="btn-checkin yes"><CheckCircle size={18} /> Salva Risposte</button>
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
                    <p>{fileSystem[folderName].length} risorse</p>
                  </motion.div>
                ))}
                
                <motion.div className="folder-card add-card" whileHover={{ y: -5, scale: 1.02 }} onClick={handleStartCreate}>
                  <div className="add-icon-bg">
                    <Plus size={36} />
                  </div>
                  <h3>Nuova Materia</h3>
                </motion.div>

                {folderToDelete && (
                  <div className="modal-overlay" onClick={() => setFolderToDelete(null)}>
                    <motion.div className="modal-content" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }} onClick={(e) => e.stopPropagation()}>
                      <div className="modal-header">
                        <AlertTriangle size={32} color="#ef4444" />
                        <h3>Elimina Materia</h3>
                      </div>
                      <div className="modal-body">
                        <p>Sei sicuro di voler eliminare la materia <strong>{folderToDelete}</strong>?</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Tutti i file caricati e gli obiettivi associati verranno rimossi permanentemente. Questa azione non è reversibile.</p>
                      </div>
                      <div className="modal-footer" style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => setFolderToDelete(null)} className="btn-skip" style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}>Annulla</button>
                        <button onClick={confirmDeleteFolder} className="btn-checkin no" style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}><Trash2 size={18} /> Elimina</button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            )}

            {/* VIEW: FOLDER (Files inside) */}
            {currentView === 'folder' && (
              <motion.div key="folder" initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }}>
                {currentFolder === 'The Ethics of AI' ? (
                  /* BOOK VIEW: show argument/part subfolder cards */
                  <div className="parts-grid">
                    {ETHICS_OF_AI_PARTS.map((part, idx) => (
                      <motion.div
                        key={part.id}
                        className="part-folder-card"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.07 }}
                        onClick={() => { setCurrentPart(part); setCurrentView('part_folder'); }}
                        style={{ '--part-color': part.color }}
                      >
                        <div className="part-folder-icon">
                          <BookOpen size={26} color={part.color} />
                        </div>
                        <div className="part-folder-info">
                          <h4>{part.name}</h4>
                          <span className="part-chapter-count">{part.chapters.length} {part.chapters.length === 1 ? 'capitolo' : 'capitoli'}</span>
                        </div>
                        <ChevronRight size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  /* REGULAR FOLDER: show flat file list */
                  <div className="files-list">
                    {fileSystem[currentFolder]?.map((file, idx) => (
                      <motion.div key={idx} className="file-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                        <div className="file-icon-bg">
                          <FileText size={24} />
                        </div>
                        <div className="file-info">
                          <h4>{file.name}</h4>
                          <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem'}}>
                            <span style={{fontSize: '0.875rem', color: 'var(--text-muted)'}}>{file.pages || 15} pag. • {file.words || 3000} parole</span>
                            <span className={`difficulty-badge ${file.difficulty || 'medio'}`}>{file.difficulty || 'medio'}</span>
                          </div>
                        </div>
                        <div style={{display: 'flex', gap: '0.5rem'}}>
                          <button className="btn-read" onClick={() => handleReadFile(file)}>Leggi</button>
                          <button className="btn-study" onClick={() => handleStudyFile(file)}><Zap size={16} /> Studia</button>
                        </div>
                      </motion.div>
                    ))}
                    {fileSystem[currentFolder]?.length === 0 && (
                      <div className="empty-state">Nessun file presente in questa materia.</div>
                    )}
                    <motion.div
                      className="file-card add-file-card"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (fileSystem[currentFolder]?.length || 0) * 0.05 }}
                      onClick={() => { setUploadFiles([]); setCurrentView('upload_files'); }}
                    >
                      <Plus size={24} /> Aggiungi altre risorse
                    </motion.div>
                  </div>
                )}

                {/* ARGUMENT MANAGER */}
                <div className="arguments-section" style={{ marginTop: '2rem' }}>
                  <button className="arguments-section-header" onClick={() => setArgumentManagerOpen(prev => !prev)}>
                    <BookOpen size={18} />
                    <span>Argomenti / Capitoli</span>
                    <span className="arg-count-badge">{(subjectArguments[currentFolder] || []).length}</span>
                    <ChevronRight size={16} style={{ marginLeft: 'auto', transform: argumentManagerOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
                  </button>

                  {argumentManagerOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="arguments-list-container">
                      {(subjectArguments[currentFolder] || []).sort((a, b) => a.order - b.order).map((arg, idx) => (
                        <div key={arg.id} className="argument-item">
                          <span className="argument-order-badge">{idx + 1}</span>
                          <span className="argument-title">{arg.title}</span>
                          <button className="btn-delete-argument" onClick={() => handleDeleteArgument(arg.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      {(subjectArguments[currentFolder] || []).length === 0 && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '0.5rem 0' }}>Nessun argomento ancora. Aggiungine uno qui sotto.</p>
                      )}
                      <form onSubmit={handleAddArgument} className="add-argument-form">
                        <input
                          type="text"
                          className="input-argument"
                          placeholder="Es. Capitolo 3: Algoritmi di ricerca..."
                          value={newArgumentTitle}
                          onChange={e => setNewArgumentTitle(e.target.value)}
                        />
                        <button type="submit" className="btn-add-argument" disabled={!newArgumentTitle.trim()}>
                          <Plus size={16} />
                        </button>
                      </form>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* VIEW: PART FOLDER (chapters inside one argument part) */}
            {currentView === 'part_folder' && currentPart && (
              <motion.div key="part_folder" initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }}>
                <div className="files-list">
                  {currentPart.chapters.map((chapter, idx) => (
                    <motion.div key={chapter.id} className="file-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}>
                      <div className="file-icon-bg" style={{ background: `${currentPart.color}22`, border: `1px solid ${currentPart.color}44` }}>
                        <FileText size={24} color={currentPart.color} />
                      </div>
                      <div className="file-info">
                        <h4>{chapter.name}</h4>
                        <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem'}}>
                          <span style={{fontSize: '0.875rem', color: 'var(--text-muted)'}}>{chapter.pages} pag. • {chapter.words} parole</span>
                          <span className={`difficulty-badge ${chapter.difficulty}`}>{chapter.difficulty}</span>
                          <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>
                            {chapter.content.split('\n').filter(l => l.trim()).length} argomenti
                          </span>
                        </div>
                      </div>
                      <div style={{display: 'flex', gap: '0.5rem'}}>
                        <button className="btn-read" onClick={() => { setPreviousView('part_folder'); handleReadFile(chapter); }}>Leggi</button>
                        <button className="btn-study" onClick={() => { setPreviousView('part_folder'); handleStudyFile(chapter); }}><Zap size={16} /> Studia</button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* VIEW: READ FILE */}
            {currentView === 'read_file' && (
              <motion.div key="read_file" initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }} className="reader-container">
                <div className="reader-header">
                  <button onClick={() => setCurrentView(previousView === 'part_folder' ? 'part_folder' : 'folder')} className="btn-back" style={{padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <ArrowLeft size={20} />
                  </button>
                  <h2 style={{margin: 0}}>{currentFile?.name}</h2>
                </div>
                <div className="reader-content">
                  {currentFile?.content ? (
                    currentFile.content.includes('§') ? (
                      <>
                        <h3 style={{ marginBottom: '1.25rem', color: 'var(--text-main)' }}>Argomenti del Capitolo</h3>
                        <div className="chapter-sections">
                          {currentFile.content.split('\n').filter(l => l.trim()).map((section, i) => (
                            <div key={i} className="chapter-section-card">
                              <span className="section-number">{i + 1}</span>
                              <span className="section-title">{section.replace('§ ', '')}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <h3>Trascrizione Audio</h3>
                        <div className="transcription-box" style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', marginTop: '1rem' }}>
                          <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', margin: 0 }}>{currentFile.content}</p>
                        </div>
                      </>
                    )
                  ) : (
                    <>
                      <h3>Introduzione</h3>
                      <p>Questo è il contenuto del file <strong>{currentFile?.name}</strong>. In un'applicazione reale, qui verrebbe renderizzato il PDF o il documento selezionato.</p>
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                      <h3>Concetti Chiave</h3>
                      <p>1. **Analisi del Testo**: L'IA ha estratto le parole chiave e i concetti fondamentali per generare flashcard e mappe mentali.</p>
                      <p>2. **Difficoltà**: Questo file è stato classificato come <strong>{currentFile?.difficulty || 'medio'}</strong>, il che influisce sulla stima del tempo di studio.</p>
                      <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.</p>
                    </>
                  )}
                  
                  <div style={{marginTop: '2rem', display: 'flex', justifyContent: 'center'}}>
                    <button className="btn-save" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setCreateQuestionState({...createQuestionState, isOpen: true})}>
                      <Plus size={18} /> Crea Flashcard / Domanda
                    </button>
                  </div>
                </div>

                {createQuestionState.isOpen && (
                  <div className="modal-overlay" onClick={() => setCreateQuestionState({...createQuestionState, isOpen: false})}>
                    <motion.div className="modal-content" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }} onClick={(e) => e.stopPropagation()}>
                      <div className="modal-header">
                        <BrainCircuit size={32} color="var(--primary)" />
                        <h3>Crea Domanda per il Testing</h3>
                      </div>
                      <div className="modal-body">
                        <div className="study-toggle" style={{ margin: '0 0 1.5rem 0', width: '100%', display: 'flex' }}>
                          <button type="button" className={`toggle-btn ${createQuestionState.type === 'flashcards' ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setCreateQuestionState({...createQuestionState, type: 'flashcards'})}>Flashcard</button>
                          <button type="button" className={`toggle-btn ${createQuestionState.type === 'qa' ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setCreateQuestionState({...createQuestionState, type: 'qa'})}>Domanda Aperta</button>
                        </div>
                        <form onSubmit={handleCreateQuestion}>
                          <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Domanda</label>
                            <textarea className="input-subject" style={{ minHeight: '80px', marginBottom: 0, fontSize: '1rem' }} placeholder="Inserisci la domanda..." value={createQuestionState.q} onChange={e => setCreateQuestionState({...createQuestionState, q: e.target.value})} required />
                          </div>
                          {createQuestionState.type === 'flashcards' && (
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                              <label style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Risposta (per te)</label>
                              <textarea className="input-subject" style={{ minHeight: '80px', marginBottom: 0, fontSize: '1rem' }} placeholder="Inserisci la risposta..." value={createQuestionState.a} onChange={e => setCreateQuestionState({...createQuestionState, a: e.target.value})} required />
                            </div>
                          )}
                          <div className="modal-footer" style={{ marginTop: '2rem' }}>
                            <button type="button" onClick={() => setCreateQuestionState({...createQuestionState, isOpen: false})} className="btn-skip">Annulla</button>
                            <button type="submit" className="btn-save">Salva</button>
                          </div>
                        </form>
                      </div>
                    </motion.div>
                  </div>
                )}
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
                    <span style={{color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px'}}>Sessione in corso</span>
                    <h2 style={{margin: '0.25rem 0 0 0'}}>{currentFile?.name}</h2>
                  </div>
                </div>

                <div className="study-toggle">
                  <button className={`toggle-btn ${studyState.type === 'flashcards' ? 'active' : ''}`} onClick={() => setStudyState({...studyState, type: 'flashcards', currentIndex: 0})}>
                    Flashcards
                  </button>
                  <button className={`toggle-btn ${studyState.type === 'qa' ? 'active' : ''}`} onClick={() => setStudyState({...studyState, type: 'qa', currentIndex: 0})}>
                    Domande Aperte (Audio)
                  </button>
                </div>

                {studyState.type === 'flashcards' && (
                  <div className="flashcard-area">
                    {currentSubjectFlashcards.length === 0 ? (
                      <div className="empty-state">
                        <BrainCircuit size={48} color="rgba(255,255,255,0.2)" style={{marginBottom: '1rem'}} />
                        <h3>Nessuna Flashcard</h3>
                        <p>Non hai ancora creato flashcard per questa materia. Apri un file per crearle.</p>
                      </div>
                    ) : (
                      <>
                        <span style={{marginBottom: '1rem', color: 'var(--text-muted)'}}>Card {studyState.currentIndex + 1} di {currentSubjectFlashcards.length}</span>
                        <div className={`flashcard ${studyState.isFlipped ? 'flipped' : ''}`} onClick={() => setStudyState({...studyState, isFlipped: !studyState.isFlipped})}>
                          <div className="flashcard-inner">
                            <div className="flashcard-front">
                              <span className="flashcard-label">Domanda</span>
                              <p className="flashcard-text">{currentSubjectFlashcards[studyState.currentIndex]?.q}</p>
                              <span style={{position: 'absolute', bottom: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)'}}><RefreshCw size={14} style={{verticalAlign: 'middle', marginRight: '0.5rem'}}/> Clicca per girare</span>
                            </div>
                            <div className="flashcard-back">
                              <span className="flashcard-label" style={{color: 'var(--success)'}}>Risposta</span>
                              <p className="flashcard-text" style={{fontSize: '1.25rem'}}>{currentSubjectFlashcards[studyState.currentIndex]?.a}</p>
                            </div>
                          </div>
                        </div>
                        
                        {studyState.isFlipped && (
                          <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="flashcard-actions">
                            <button className="btn-fc hard" onClick={handleNextFlashcard}>Non Sapevo</button>
                            <button className="btn-fc good" onClick={handleNextFlashcard}>Incerto</button>
                            <button className="btn-fc easy" onClick={handleNextFlashcard}>Sapevo</button>
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
                        <Mic size={48} color="rgba(255,255,255,0.2)" style={{marginBottom: '1rem'}} />
                        <h3>Nessuna Domanda Aperta</h3>
                        <p>Non hai ancora creato domande aperte per questa materia. Apri un file per crearle.</p>
                      </div>
                    ) : (
                      <>
                        <span style={{marginBottom: '1rem', color: 'var(--text-muted)'}}>Domanda {studyState.currentIndex + 1} di {currentSubjectQA.length}</span>
                        <div className="qa-question-box">
                          <p className="flashcard-text" style={{margin: 0}}>{currentSubjectQA[studyState.currentIndex]?.q}</p>
                        </div>

                        {!studyState.transcript && !studyState.isProcessing && (
                          <div style={{textAlign: 'center', marginTop: '2rem'}}>
                            <button className={`mic-btn ${studyState.isRecording ? 'recording' : ''}`} onClick={handleMicClick}>
                              {studyState.isRecording ? <Square size={32} /> : <Mic size={32} />}
                            </button>
                            <p style={{marginTop: '1rem', color: 'var(--text-muted)'}}>{studyState.isRecording ? 'In ascolto... Clicca per terminare' : 'Clicca per registrare la risposta'}</p>
                          </div>
                        )}

                        {studyState.isProcessing && (
                          <div style={{textAlign: 'center', marginTop: '4rem', color: 'var(--primary)'}}>
                            <div className="icon-pulse" style={{width: '60px', height: '60px', margin: '0 auto 1rem'}}><BrainCircuit size={30} /></div>
                            <p>Analisi Braynr AI in corso...</p>
                          </div>
                        )}

                        {studyState.transcript && !studyState.isProcessing && (
                          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} style={{width: '100%', maxWidth: '700px'}}>
                            <div className="transcript-box">
                              <strong style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem'}}>LA TUA RISPOSTA</strong>
                              "{studyState.transcript}"
                            </div>
                            
                            {!studyState.feedback ? (
                              <button className="btn-save" style={{width: '100%', marginTop: '2rem', padding: '1rem'}} onClick={handleEvaluateAudio}>
                                Valuta Risposta con IA
                              </button>
                            ) : (
                              <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}>
                                <div className="ai-feedback-box">
                                  <div style={{textAlign: 'center', minWidth: '80px'}}>
                                    <div className="ai-score">{studyState.score}</div>
                                    <span style={{fontSize: '0.8rem', color: '#10b981', fontWeight: 600}}>PUNTI</span>
                                  </div>
                                  <div style={{borderLeft: '1px solid rgba(16, 185, 129, 0.3)', paddingLeft: '1.5rem'}}>
                                    <strong style={{display: 'block', marginBottom: '0.5rem', color: '#10b981'}}>FEEDBACK IA</strong>
                                    <p style={{margin: 0, color: 'var(--text-main)', lineHeight: 1.6}}>{studyState.feedback}</p>
                                  </div>
                                </div>
                                <button className="btn-skip" style={{width: '100%', marginTop: '1rem', padding: '1rem', border: '1px solid var(--primary)', color: 'var(--text-main)'}} onClick={handleNextQA}>
                                  Prossima Domanda
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
                  <h2>Maggio 2026</h2>
                  <div className="calendar-nav">
                    <button className="btn-nav">Oggi</button>
                    <button className="btn-nav">&lt;</button>
                    <button className="btn-nav">&gt;</button>
                  </div>
                </div>
                
                <div className="calendar-grid-header">
                  {["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"].map(d => <div key={d} className="weekday-label">{d}</div>)}
                </div>
                
                <div className="calendar-grid">
                  {(() => {
                    const argumentSchedule = computeArgumentSchedule(goals, subjectArguments);
                    return [
                      null, null, null, null, 1, 2, 3,
                      4, 5, 6, 7, 8, 9, 10,
                      11, 12, 13, 14, 15, 16, 17,
                      18, 19, 20, 21, 22, 23, 24,
                      25, 26, 27, 28, 29, 30, 31,
                      null, null, null, null
                    ].map((day, idx) => {
                      const dayName = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"][idx % 7];
                      const activeSessions = [];
                      const dayKey = day ? `2026-05-${String(day).padStart(2, '0')}` : null;
                      const dayArguments = (dayKey && argumentSchedule[dayKey]) || {};

                      if (day) {
                        Object.entries(goals).forEach(([subject, goalInfo]) => {
                          if (goalInfo.daysOfWeek.includes(dayName)) {
                            activeSessions.push({ subject, hours: goalInfo.dailyHours, progress: goalInfo.progress });
                          }
                        });
                      }

                      return (
                        <div key={idx} className={`calendar-cell ${day ? '' : 'empty'} ${day === 9 ? 'today' : ''}`}>
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
                                <div key={sIdx} style={{ marginBottom: '3px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: getSubjectColor(session.subject), flexShrink: 0 }}></span>
                                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{session.subject} ({session.hours}h)</span>
                                  </div>
                                  {dayArguments[session.subject] && (
                                    <div className="calendar-argument-chip">{dayArguments[session.subject]}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
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
                  <h2 style={{ marginBottom: '1.5rem' }}>Come vuoi chiamare la materia?</h2>
                  <input type="text" autoFocus placeholder="Es. Analisi Matematica 2, Diritto Privato..." value={newSubjectName} onChange={(e) => setNewSubjectName(e.target.value)} className="input-subject" />
                  <button type="submit" className="btn-upload" disabled={!newSubjectName.trim()} style={{ width: '100%', justifyContent: 'center' }}>
                    Avanti <ChevronRight size={20} />
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
                  
                  <h2>{isDragActive ? 'Rilascia i file qui...' : 'Trascina e rilascia i tuoi file'}</h2>
                  <p>Aggiungi risorse a <strong>{newSubjectName || currentFolder}</strong>. Supportiamo PDF, Word, PPT, immagini, audio e video.</p>
                  
                  <input type="file" id="file-upload" style={{ display: 'none' }} multiple onChange={handleFileInput} disabled={isUploading} />
                  <label htmlFor="file-upload" className="btn-upload" style={{ opacity: isUploading ? 0.7 : 1, pointerEvents: isUploading ? 'none' : 'auto' }}>
                    {isUploading ? 'Elaborazione in corso...' : 'Seleziona dal computer'}
                  </label>
                  {isUploading && (
                    <div style={{ marginTop: '1rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                      <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Trascrizione audio in corso con ElevenLabs...</span>
                    </div>
                  )}

                  <AnimatePresence>
                    {uploadFiles.length > 0 && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="files-preview-box">
                        <h3 className="preview-title"><CheckCircle2 size={18} color="#10b981" /> File pronti per l'analisi</h3>
                        <div className="preview-list">
                          {uploadFiles.map((file, idx) => (
                            <div key={idx} className="preview-item" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                              <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                                <FileIcon size={20} color="#a5b4fc" />
                                <div>
                                  <span style={{display: 'block', fontWeight: 500}}>{file.name}</span>
                                  {file.isTranscribing ? (
                                    <span style={{fontSize: '0.75rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px'}}>
                                      <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} /> Trascrizione in corso...
                                    </span>
                                  ) : file.error ? (
                                    <span style={{fontSize: '0.75rem', color: '#ef4444'}}>Errore nella trascrizione</span>
                                  ) : (
                                    <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{file.pages} pag. • {file.words} parole</span>
                                  )}
                                </div>
                              </div>
                              <div className="difficulty-selector">
                                {['semplice', 'medio', 'difficile'].map(level => (
                                  <button 
                                    key={level} 
                                    className={`diff-btn ${file.difficulty === level ? 'active' : ''} ${level}`}
                                    onClick={() => setFileDifficulty(idx, level)}
                                  >
                                    {level.charAt(0).toUpperCase() + level.slice(1)}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        <button className="btn-start-analysis" onClick={handleSaveUploadAndGoToGoals} disabled={isUploading} style={{ opacity: isUploading ? 0.5 : 1 }}>
                          {isUploading ? 'Attendere...' : 'Salva e Continua'}
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
                <div className="create-subject-form" style={{padding: '3rem'}}>
                  <h2>Seleziona la materia</h2>
                  
                  <div className="subjects-list">
                    {Object.keys(fileSystem).length === 0 && (
                      <p style={{ color: 'var(--text-muted)' }}>Non hai ancora creato nessuna materia.</p>
                    )}
                    {Object.keys(fileSystem).length > 0 && Object.keys(fileSystem).filter(subject => !goals[subject]).length === 0 && (
                      <p style={{ color: 'var(--text-muted)' }}>Tutte le tue materie hanno già un obiettivo impostato.</p>
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

                  <button className="btn-skip" style={{marginTop: '2rem'}} onClick={navigateToObiettivi}>
                    Annulla
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
                      <label><Calendar size={18}/> Entro quando vuoi completare lo studio?</label>
                      <input type="date" className="input-date" value={tempGoal.deadline} onChange={(e) => setTempGoal({...tempGoal, deadline: e.target.value})} />
                    </div>
                    
                    <div className="form-group">
                      <label><Clock size={18}/> Ore di studio giornaliere (stimate)</label>
                      <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                        <input type="range" min="1" max="12" value={tempGoal.dailyHours} onChange={(e) => setTempGoal({...tempGoal, dailyHours: parseInt(e.target.value)})} className="range-slider" />
                        <span className="hours-display">{tempGoal.dailyHours} ore</span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label><CalendarDays size={18}/> In quali giorni vuoi studiare?</label>
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
                        {previousView === 'obiettivi' ? 'Annulla' : 'Salta (Opzionale)'}
                      </button>
                      <button className="btn-save" onClick={handleSaveGoals}>Salva Obiettivo</button>
                    </div>
                  </div>

                  <div className="suggestion-box">
                    <div className="suggestion-header">
                      <Sparkles size={20} color="#a78bfa" />
                      <span>Stima Braynr AI</span>
                    </div>
                    <div className="suggestion-body">
                      {Object.values(goals).filter(g => g.progress === 100).length >= 3 ? (
                        <>
                          <p>In base ai materiali analizzati ({fileSystem[currentFolder]?.length || 0} file) e ai tuoi <strong>{Object.values(goals).filter(g => g.progress === 100).length} progetti precedenti</strong>, calcoliamo che siano necessarie circa <strong>14 ore</strong> di studio attivo per un apprendimento profondo.</p>
                          {tempGoal.daysOfWeek.length > 0 ? (
                            <p style={{marginTop: '1rem', color: 'var(--text-muted)'}}>
                              Studiando <strong>{tempGoal.dailyHours} ore</strong> per <strong>{tempGoal.daysOfWeek.length} giorni</strong> a settimana, completerai la materia in circa <strong>{Math.ceil(14 / (tempGoal.dailyHours * tempGoal.daysOfWeek.length))} settimane</strong>.
                            </p>
                          ) : (
                            <p style={{marginTop: '1rem', color: 'var(--text-muted)'}}>Seleziona i giorni di studio per avere una stima di completamento più precisa.</p>
                          )}
                        </>
                      ) : (
                        <p style={{color: 'var(--text-muted)'}}>
                          L'algoritmo di stima IA si attiverà dopo che avrai completato almeno <strong>3 progetti</strong>. Questo ci permette di offrirti una stima personalizzata e coerente con i tuoi ritmi.
                          <br/><br/>
                          Attualmente hai completato <strong>{Object.values(goals).filter(g => g.progress === 100).length}</strong> progetti.
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
                    <div className="empty-state" style={{gridColumn: '1 / -1'}}>
                      <Target size={48} color="rgba(255,255,255,0.2)" style={{marginBottom: '1rem'}} />
                      <h3>Nessun obiettivo impostato</h3>
                      <p>Crea un nuovo obiettivo o impostane uno dopo aver caricato le fonti.</p>
                    </div>
                  )}

                  {Object.entries(goals).map(([subject, goalInfo]) => (
                    <div key={subject} className="goal-card" onClick={() => setViewingGoal(subject)}>
                      <div className="goal-header">
                        <Target size={24} color="var(--primary)" />
                        <h3>{subject}</h3>
                        {goalInfo.progress === 100 && <span className="badge-completed" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)', fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '6px', fontWeight: 600, marginLeft: 'auto' }}>Completato</span>}
                      </div>
                      <div className="goal-detail">
                        <Calendar size={16} />
                        <span>Deadline: {goalInfo.deadline ? new Date(goalInfo.deadline).toLocaleDateString('it-IT') : 'Non impostata'}</span>
                      </div>
                      <div className="goal-detail">
                        <Clock size={16} />
                        <span>{goalInfo.dailyHours} ore al giorno</span>
                      </div>
                      <div className="goal-detail">
                        <CalendarDays size={16} />
                        <span>{goalInfo.daysOfWeek.length > 0 ? goalInfo.daysOfWeek.join(', ') : 'Nessun giorno'}</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${goalInfo.progress || 0}%`, background: goalInfo.progress === 100 ? 'var(--success)' : 'var(--primary)' }}></div>
                      </div>
                      <span style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'block'}}>{goalInfo.progress || 0}% completato</span>
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
                    <h3>Nuovo Obiettivo</h3>
                  </motion.div>

                </div>

                {viewingGoal && (
                  <div className="modal-overlay" onClick={() => setViewingGoal(null)}>
                    <motion.div className="modal-content" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }} onClick={(e) => e.stopPropagation()}>
                      <div className="modal-header">
                        <Target size={32} color="var(--primary)" />
                        <h3>{viewingGoal}</h3>
                        {goals[viewingGoal].progress === 100 && <span className="badge-completed" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)', fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '6px', fontWeight: 600, marginLeft: 'auto' }}>Completato</span>}
                      </div>
                      <div className="modal-body">
                        <div className="goal-detail" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Calendar size={18} />
                          <span><strong>Deadline:</strong> {goals[viewingGoal].deadline ? new Date(goals[viewingGoal].deadline).toLocaleDateString('it-IT') : 'Non impostata'}</span>
                        </div>
                        <div className="goal-detail" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Clock size={18} />
                          <span><strong>Ritmo:</strong> {goals[viewingGoal].dailyHours} ore al giorno</span>
                        </div>
                        <div className="goal-detail" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <CalendarDays size={18} />
                          <span><strong>Giorni:</strong> {goals[viewingGoal].daysOfWeek.length > 0 ? goals[viewingGoal].daysOfWeek.join(', ') : 'Nessun giorno'}</span>
                        </div>
                        <div style={{ marginTop: '1.5rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Progresso</span>
                            <span>{goals[viewingGoal].progress || 0}%</span>
                          </div>
                          <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: `${goals[viewingGoal].progress || 0}%`, background: goals[viewingGoal].progress === 100 ? 'var(--success)' : 'var(--primary)' }}></div>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer" style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => setViewingGoal(null)} className="btn-skip" style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}>Chiudi</button>
                        <button onClick={() => {
                          setCurrentFolder(viewingGoal);
                          setTempGoal(goals[viewingGoal]);
                          setPreviousView('obiettivi');
                          setCurrentView('set_goals');
                          setViewingGoal(null);
                        }} className="btn-save" style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'var(--primary)', color: 'white', border: 'none' }}>Modifica</button>
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
                    <div className="stat-header"><Flame color="#f97316" /> <h3>Streak Giornaliero</h3></div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '1rem 0' }}>
                      <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.flashcards.streakDays}</span>
                      <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>giorni</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)' }}>Studi consecutivi completati. Continua così!</p>
                  </div>

                  {/* CARD 2: RETENTION CIRCLE */}
                  <div className="stat-card">
                    <div className="stat-header"><BrainCircuit color="#3b82f6" /> <h3>Ritenzione Flashcard</h3></div>
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
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Su {stats.flashcards.reviewCount} revisioni totali.</p>
                  </div>

                  {/* CARD 3: QA SCORE CIRCLE */}
                  <div className="stat-card">
                    <div className="stat-header"><HelpCircle color="#10b981" /> <h3>Valutazione Q&A</h3></div>
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
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Media su {stats.qa.questionsAnswered} risposte date.</p>
                  </div>

                </div>

                {/* CARD 4: BAR CHART (WIDE) */}
                <div className="stat-card wide" style={{ marginBottom: '1.5rem' }}>
                  <div className="stat-header"><Clock color="#f59e0b" /> <h3>Distribuzione Ore di Studio Settimanali</h3></div>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Ore totali pianificate per ogni materia in base ai tuoi obiettivi.</p>
                  <div className="bar-chart" style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', height: '200px', marginTop: '2.5rem', paddingBottom: '1.5rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
                    {Object.keys(goals).length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', width: '100%', textAlign: 'center', alignSelf: 'center' }}>Nessun obiettivo impostato per calcolare le ore.</p>
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
                  <div className="stat-header"><Activity color="#8b5cf6" /> <h3>Coerenza al Piano di Studio</h3></div>
                  <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                    Le tue ultime due settimane. Hai un tasso di aderenza del <strong style={{ color: 'white' }}>{Math.round((stats.adherence.completedDays / Math.max(1, (stats.adherence.completedDays + stats.adherence.missedDays))) * 100)}%</strong>.
                  </p>
                  <div className="adherence-graph" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}>
                    {stats.adherence.history.map((studied, i) => (
                      <div key={i} className={`adherence-day ${studied ? 'studied' : 'missed'}`} title={studied ? "Studiato" : "Saltato"} style={{ flex: 1, height: '30px', borderRadius: '6px', cursor: 'pointer' }}></div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;
