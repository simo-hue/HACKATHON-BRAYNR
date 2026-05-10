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
  Zap,
  BookOpen,
  MoreVertical,
  Eye
} from 'lucide-react';
import './App.css';

const getSubjectColor = (subject) => {
  const palette = [
    '#00CBCC', // Teal
    '#ec4899', // Pink
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Yellow
    '#ef4444', // Red
    '#06b6d4', // Cyan
    '#a855f7', // Purple-light
  ];

  // Manual map for default subjects to ensure distinct colors
  const manualMap = {
    "Math": '#3b82f6',
    "Databases": '#10b981',
    "The Ethics of AI": '#ec4899',
    "History": '#f59e0b',
    "Private Law": '#ef4444'
  };

  if (manualMap[subject]) {
    return manualMap[subject];
  }

  let hash = 0;
  for (let i = 0; i < subject.length; i++) {
    hash = subject.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
};

const ETHICS_OF_AI_PARTS = [
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
  const dayNamesEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayNamesIt = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];

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
      const date = new Date(2026, 4, day);
      const weekdayEn = dayNamesEn[date.getDay()];
      const weekdayIt = dayNamesIt[date.getDay()];
      if (goalInfo.daysOfWeek.includes(weekdayEn) || goalInfo.daysOfWeek.includes(weekdayIt)) {
        studyDays.push(day);
      }
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
  const [currentPart, setCurrentPart] = useState(null);
  const [currentSubFolder, setCurrentSubFolder] = useState(null);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [previousView, setPreviousView] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);

  // Plan Proposal State
  const [isPlanProposal, setIsPlanProposal] = useState(false);
  const [planParts, setPlanParts] = useState(() => JSON.parse(JSON.stringify(ETHICS_OF_AI_PARTS)));
  const [openPlanParts, setOpenPlanParts] = useState(new Set(['part1']));
  const [activeMoveMenu, setActiveMoveMenu] = useState(null);
  const [moveMenuPos, setMoveMenuPos] = useState({ top: 0, right: 0 });

  // Mock File System State
  const [fileSystem, setFileSystem] = useState(() => {
    const saved = localStorage.getItem('fileSystem');
    const base = saved ? JSON.parse(saved) : {
      "Math": [
        { name: "Calculus I - Limits.pdf", type: "pdf", pages: 12, words: 2500, difficulty: 'semplice' },
        { name: "Linear Algebra.docx", type: "doc", pages: 25, words: 6000, difficulty: 'difficile' }
      ],
      "Fisica Quantistica": [
        { name: "Appunti Schrödinger.pdf", type: "pdf", pages: 8, words: 1800, difficulty: 'medio' }
      ],
      "History": [
        { name: "World War II Overview.pdf", type: "pdf", pages: 30, words: 8500, difficulty: 'medio' },
        { name: "Cold War Timeline.docx", type: "doc", pages: 15, words: 4000, difficulty: 'semplice' }
      ],
      "Databases": [
        { name: "SQL Basics.txt", type: "txt", pages: 5, words: 1500, difficulty: 'semplice' },
        { name: "NoSQL vs Relational.txt", type: "txt", pages: 8, words: 2400, difficulty: 'medio' }
      ],
    };
    if (!base["The Ethics of AI"]) {
      base["The Ethics of AI"] = [];
    }
    Object.keys(base).forEach(key => {
      if (!key.trim()) delete base[key];
    });
    return base;
  });

  // Goals State
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('goals');
    const base = saved ? JSON.parse(saved) : {
      "Math": {
        deadline: "2026-06-15",
        dailyHours: 2,
        daysOfWeek: ["Mon", "Wed", "Fri"],
        progress: 35
      },
      "History": {
        deadline: "2026-04-10",
        dailyHours: 1,
        daysOfWeek: ["Tue", "Thu"],
        progress: 100
      },
      "Databases": {
        deadline: "2026-04-20",
        dailyHours: 3,
        daysOfWeek: ["Mon", "Wed", "Fri"],
        progress: 100
      },
      "Private Law": {
        deadline: "2026-05-01",
        dailyHours: 2,
        daysOfWeek: ["Sat", "Sun"],
        progress: 100
      }
    };
    if (!base["The Ethics of AI"]) {
      base["The Ethics of AI"] = {
        deadline: "2026-05-31",
        dailyHours: 2,
        daysOfWeek: ["Mon", "Wed", "Fri"],
        progress: 8
      };
    }
    if (base["Diritto Privato"]) {
      base["Private Law"] = base["Diritto Privato"];
      delete base["Diritto Privato"];
    }
    Object.keys(base).forEach(key => {
      if (!key.trim()) delete base[key];
    });
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
  const [calendarDate, setCalendarDate] = useState(new Date(2026, 4, 1)); // May 2026
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(null);

  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Upload State
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [checkedSubjects, setCheckedSubjects] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [expandedTranscriptionIdx, setExpandedTranscriptionIdx] = useState(null);
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);

  const processFiles = async (files) => {
    setIsUploading(true);
    setExpandedTranscriptionIdx(null);

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

  const [subjectArguments, setSubjectArguments] = useState(() => {
    const saved = localStorage.getItem('subjectArguments');
    const base = saved ? JSON.parse(saved) : {};
    if (!base["The Ethics of AI"]) {
      base["The Ethics of AI"] = [
        { id: 1, title: "Introduction", order: 0 },
        { id: 2, title: "Ch.1 – What AI Are We Talking About?", order: 1 },
        { id: 3, title: "Ch.2 – Human-Aided AI", order: 2 },
        { id: 4, title: "Ch.3 – Digital Counter-Enlightenment and the Power of Design", order: 3 },
        { id: 5, title: "Ch.4 – Subjectivity and Power in the Ethics of AI", order: 4 },
        { id: 6, title: "Ch.5 – AI Systems as Prediction Machines", order: 5 },
        { id: 7, title: "Ch.6 – Predictive Privacy", order: 6 },
        { id: 8, title: "Ch.7 – The Culture of Prediction: Ethics and Epistemology", order: 7 },
        { id: 9, title: "Ch.8 – AI Cybernetics", order: 8 },
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
      ? yesterdaySubjects.some(s => checkedSubjects[s]) || checkedSubjects['the ethics of AI']
      : checkedSubjects['general'] || checkedSubjects['the ethics of AI'];

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
              transcript: data.text || "Transcription failed or empty audio.",
            }));
          } catch (err) {
            console.error("Transcription failed", err);
            setStudyState(prev => ({
              ...prev,
              isProcessing: false,
              transcript: "Error during audio transcription.",
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
            { name: "Precisione Lessicale", score: Math.floor(Math.random() * 25) + 75, color: '#00CBCC' },
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

  // Plan Proposal Handlers
  const handleAcceptPlan = () => {
    setIsPlanProposal(false);
  };

  const handleDeclinePlan = () => {
    setPlanParts(JSON.parse(JSON.stringify(ETHICS_OF_AI_PARTS)));
    setIsPlanProposal(false);
    navigateToHome();
  };

  const togglePlanPart = (partId) => {
    setOpenPlanParts(prev => {
      const next = new Set(prev);
      next.has(partId) ? next.delete(partId) : next.add(partId);
      return next;
    });
  };

  const handleMoveChapter = (chapterId, fromPartId, toPartId) => {
    setPlanParts(prev => {
      const updated = prev.map(p => ({ ...p, chapters: [...p.chapters] }));
      const fromPart = updated.find(p => p.id === fromPartId);
      const toPart = updated.find(p => p.id === toPartId);
      const idx = fromPart.chapters.findIndex(c => c.id === chapterId);
      if (idx === -1) return prev;
      const [chapter] = fromPart.chapters.splice(idx, 1);
      toPart.chapters.push(chapter);
      return updated;
    });
    setActiveMoveMenu(null);
  };

  const handleDeleteChapter = (chapterId, fromPartId) => {
    setPlanParts(prev =>
      prev.map(p => p.id !== fromPartId ? p : { ...p, chapters: p.chapters.filter(c => c.id !== chapterId) })
    );
  };

  const openMoveMenu = (e, chapterId, fromPartId) => {
    e.stopPropagation();
    if (activeMoveMenu?.chapterId === chapterId) { setActiveMoveMenu(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    setMoveMenuPos({ top: rect.bottom + 6, right: window.innerWidth - rect.right });
    setActiveMoveMenu({ chapterId, fromPartId });
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

      uploadFiles.forEach(f => {
        updated[targetFolder].push({
          name: f.name,
          type: f.type || "pdf",
          difficulty: f.difficulty,
          pages: f.pages || 1,
          words: f.words || 1,
          content: f.content || "Contenuto del file elaborato..."
        });
      });
      return updated;
    });

    setUploadFiles([]);
    setCurrentFolder(targetFolder);
    setTempGoal({ deadline: "", dailyHours: 2, daysOfWeek: [] });
    setPreviousView('upload_files');
    setCurrentView('set_goals');
  };

  const handleCreatePlanClick = () => {
    setIsCreatingPlan(true);
    setTimeout(() => {
      setFileSystem(prev => {
        const updated = { ...prev };
        const flatFiles = updated[currentFolder].filter(item => !item.isFolder);

        const existingSubFolders = [];
        for (let i = 1; i <= 5; i++) {
          existingSubFolders.push({
            isFolder: true,
            name: `Chapter ${i}`,
            files: []
          });
        }

        flatFiles.forEach(f => {
          const contentStr = f.content || "Contenuto del file elaborato...";
          const chunkSize = Math.ceil(contentStr.length / 5) || 1;

          for (let i = 0; i < 5; i++) {
            const chunkStr = contentStr.slice(i * chunkSize, (i + 1) * chunkSize);
            existingSubFolders[i].files.push({
              name: `${f.name} - Part ${i + 1}`,
              type: f.type,
              difficulty: f.difficulty,
              pages: Math.ceil(f.pages / 5) || 1,
              words: Math.ceil(f.words / 5) || 1,
              content: chunkStr
            });
          }
        });

        updated[currentFolder] = existingSubFolders;
        return updated;
      });
      setIsCreatingPlan(false);
      setCurrentFolder('The Ethics of AI');
    }, 2000);
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
                <p>Select a collection to study or add new sources.</p>
              </>
            )}
            {currentView === 'folder' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={navigateToHome} className="btn-back">
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h1>{currentFolder}</h1>
                  <p>{currentFolder === 'The Ethics of AI' ? (isPlanProposal ? 'Rainer Mühlhoff · AI-generated plan — review before accepting.' : 'Rainer Mühlhoff · Seleziona un argomento per iniziare.') : 'I tuoi documenti e appunti per questa materia.'}</p>
                </div>
              </div>
            )}
            {currentView === 'part_folder' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={() => { setCurrentPart(null); setCurrentView('folder'); }} className="btn-back">
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.25rem', fontWeight: 600, fontSize: '0.85rem' }}>
                    <span style={{ cursor: 'pointer' }} onClick={() => { setCurrentPart(null); setCurrentView('folder'); }}>{currentFolder}</span>
                    <ChevronRight size={14} />
                    <span style={{ color: 'var(--text-muted)' }}>{currentPart?.name}</span>
                  </div>
                  <h1>{currentPart?.name}</h1>
                  <p>{currentPart?.chapters?.length} capitoli in questo argomento.</p>
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
                    {!yesterdaySubjects.includes('the ethics of AI') && (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
                        <input type="checkbox" checked={checkedSubjects['the ethics of AI'] || false} onChange={() => toggleCheckedSubject('the ethics of AI')} style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
                        <span style={{ fontSize: '1rem' }}>the ethics of AI</span>
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
                  <motion.div key={idx} className="folder-card" whileHover={{ y: -5, scale: 1.02 }} onClick={() => { setCurrentFolder(folderName); setCurrentView('folder'); if (folderName === 'The Ethics of AI') { setPlanParts(JSON.parse(JSON.stringify(ETHICS_OF_AI_PARTS))); setIsPlanProposal(true); setOpenPlanParts(new Set(['part1'])); } else { setIsPlanProposal(false); } }} style={{ position: 'relative' }}>
                    <button className="btn-delete-folder" onClick={(e) => handleDeleteFolder(e, folderName)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', opacity: 0.5, transition: '0.2s' }}>
                      <Trash2 size={18} />
                    </button>
                    <div className="folder-icon-bg">
                      <Folder size={32} />
                    </div>
                    <h3>{folderName}</h3>
                    <p>{folderName === 'The Ethics of AI' ? 2 : fileSystem[folderName].reduce((acc, curr) => curr.isFolder ? acc + curr.files.length : acc + 1, 0)} resources</p>
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
              <motion.div key="folder" initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }} className="collection-container">
                {currentFolder === 'The Ethics of AI' ? (
                  isPlanProposal ? (
                    /* PLAN PROPOSAL VIEW */
                    <div className="plan-proposal" onClick={() => setActiveMoveMenu(null)}>
                      {/* Banner */}
                      <motion.div className="plan-banner" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                        <div className="plan-banner-left">
                          <div className="plan-banner-icon">
                            <Sparkles size={20} />
                          </div>
                          <div>
                            <h3 className="plan-banner-title">AI Study Plan Proposal</h3>
                            <p className="plan-banner-subtitle">Based on your source, we organized the material into sections. Review, rearrange chapters if needed, then accept or decline.</p>
                          </div>
                        </div>
                        <div className="plan-banner-actions">
                          <button className="btn-decline-plan" onClick={handleDeclinePlan}>
                            <XCircle size={15} /> Decline
                          </button>
                          <button className="btn-accept-plan" onClick={handleAcceptPlan}>
                            <CheckCircle size={15} /> Accept Plan
                          </button>
                        </div>
                      </motion.div>

                      {/* Sections */}
                      <div className="plan-sections">
                        {planParts.map((part, idx) => {
                          const isOpen = openPlanParts.has(part.id);
                          return (
                            <motion.div
                              key={part.id}
                              className="plan-section-card"
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.07 }}
                              style={{ '--part-color': part.color }}
                            >
                              <button className="plan-section-header" onClick={(e) => { e.stopPropagation(); togglePlanPart(part.id); }}>
                                <div className="plan-section-header-left">
                                  <div className="part-folder-icon">
                                    <BookOpen size={22} color={part.color} />
                                  </div>
                                  <div>
                                    <h4 className="plan-section-title">{part.name}</h4>
                                    <span className="part-chapter-count">{part.chapters.length} {part.chapters.length === 1 ? 'chapter' : 'chapters'}</span>
                                  </div>
                                </div>
                                <ChevronRight size={16} style={{ color: 'var(--text-muted)', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', flexShrink: 0 }} />
                              </button>

                              <AnimatePresence>
                                {isOpen && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="plan-section-chapters"
                                  >
                                    {part.chapters.length === 0 && (
                                      <p className="plan-empty-section">No chapters in this section.</p>
                                    )}
                                    {part.chapters.map((chapter) => (
                                      <div key={chapter.id} className="plan-chapter-row">
                                        <div className="plan-chapter-dot" style={{ background: part.color }} />
                                        <div className="plan-chapter-info">
                                          <span className="plan-chapter-name">{chapter.name}</span>
                                          <span className="plan-chapter-meta">{chapter.pages} p. · {chapter.words} words</span>
                                        </div>
                                        <div className="plan-chapter-actions">
                                          <button
                                            className="btn-chapter-delete"
                                            onClick={() => handleDeleteChapter(chapter.id, part.id)}
                                            title="Remove source"
                                          >
                                            <Trash2 size={14} />
                                          </button>
                                          <button
                                            className={`btn-chapter-menu${activeMoveMenu?.chapterId === chapter.id ? ' active' : ''}`}
                                            onClick={(e) => openMoveMenu(e, chapter.id, part.id)}
                                            title="Move to..."
                                          >
                                            <MoreVertical size={15} />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          );
                        })}
                      </div>
                      <motion.div
                        className="file-card add-file-card"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        onClick={() => { setUploadFiles([]); setCurrentView('upload_files'); }}
                      >
                        <Plus size={22} /> Add a source
                      </motion.div>
                    </div>
                  ) : (
                    /* ACCEPTED BOOK VIEW: show part subfolder cards */
                    <div className="parts-grid">
                      {planParts.map((part, idx) => (
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
                            <span className="part-chapter-count">{part.chapters.length} {part.chapters.length === 1 ? 'chapter' : 'chapters'}</span>
                          </div>
                          <button className="btn-study" onClick={(e) => handleStudyFolder(e, part)} style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', marginRight: '0.5rem' }}><Zap size={14} /> Study</button>
                          <ChevronRight size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                        </motion.div>
                      ))}
                      <motion.div
                        className="file-card add-file-card"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: planParts.length * 0.07 + 0.05 }}
                        onClick={() => { setUploadFiles([]); setCurrentView('upload_files'); }}
                      >
                        <Plus size={22} /> Add a source
                      </motion.div>
                    </div>
                  )
                ) : (
                  /* DYNAMIC FOLDER: flat files or plan */
                  (() => {
                    const currentFolderFiles = fileSystem[currentFolder] || [];
                    const hasSubfolders = currentFolderFiles.some(f => f.isFolder);

                    if (hasSubfolders) {
                      return (
                        <div className="parts-grid">
                          {currentFolderFiles.map((part, idx) => (
                            <motion.div
                              key={idx}
                              className="part-folder-card"
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.07 }}
                              onClick={() => { setCurrentPart({ ...part, chapters: part.files }); setCurrentView('part_folder'); }}
                              style={{ '--part-color': '#00CBCC' }}
                            >
                              <div className="part-folder-icon">
                                <BookOpen size={26} color="#00CBCC" />
                              </div>
                              <div className="part-folder-info">
                                <h4>{part.name}</h4>
                                <span className="part-chapter-count">{part.files.length} {part.files.length === 1 ? 'file' : 'files'}</span>
                              </div>
                              <button className="btn-study" onClick={(e) => handleStudyFolder(e, part)} style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', marginRight: '0.5rem' }}><Zap size={14} /> Study</button>
                              <ChevronRight size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                            </motion.div>
                          ))}
                          <motion.div
                            className="file-card add-file-card"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: currentFolderFiles.length * 0.07 + 0.05 }}
                            onClick={() => { setUploadFiles([]); setCurrentView('upload_files'); }}
                          >
                            <Plus size={22} /> Add a source
                          </motion.div>
                        </div>
                      );
                    }

                    return (
                      <div className="files-list">
                        {isCreatingPlan ? (
                          <div style={{ textAlign: 'center', padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <div className="icon-pulse" style={{ width: '80px', height: '80px', margin: '0 auto' }}><BrainCircuit size={40} color="var(--primary)" /></div>
                            <h3 style={{ margin: 0 }}>Braynr AI is analyzing your sources...</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Creating an optimal study plan based on the content.</p>
                          </div>
                        ) : (
                          <>
                            {currentFolderFiles.length > 0 && (
                              <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                                <button className="btn-save" onClick={handleCreatePlanClick} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
                                  <Sparkles size={18} /> Create Plan
                                </button>
                              </div>
                            )}

                            {currentFolderFiles.map((file, idx) => (
                              <motion.div key={idx} className="file-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                                <div className="file-icon-bg">
                                  <FileText size={24} />
                                </div>
                                <div className="file-info">
                                  <h4>{file.name}</h4>
                                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem' }}>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{file.pages || 15} p. • {file.words || 3000} words</span>
                                    <span className={`difficulty-badge ${file.difficulty || 'medio'}`}>{file.difficulty || 'medio'}</span>
                                  </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  <button className="btn-read" onClick={() => handleReadFile(file)}>Read</button>
                                </div>
                              </motion.div>
                            ))}
                            {currentFolderFiles.length === 0 && (
                              <div className="empty-state">No files present in this subject.</div>
                            )}
                            <motion.div
                              className="file-card add-file-card"
                              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: currentFolderFiles.length * 0.05 }}
                              onClick={() => { setUploadFiles([]); setCurrentView('upload_files'); }}
                            >
                              <Plus size={24} /> Add more resources
                            </motion.div>
                          </>
                        )}
                      </div>
                    );
                  })()
                )}

                {/* ARGUMENT MANAGER */}
                <div className="arguments-section" style={{ marginTop: '2rem' }}>
                  <button className="arguments-section-header" onClick={() => setArgumentManagerOpen(prev => !prev)}>
                    <BookOpen size={18} />
                    <span>Topics / Chapters</span>
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
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '0.5rem 0' }}>No topics yet. Add one below.</p>
                      )}
                      <form onSubmit={handleAddArgument} className="add-argument-form">
                        <input
                          type="text"
                          className="input-argument"
                          placeholder="E.g. Chapter 3: Search Algorithms..."
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
              <motion.div key="part_folder" initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }} className="collection-container">
                <div className="files-list">
                  {currentPart.chapters.map((chapter, idx) => (
                    <motion.div key={chapter.id} className="file-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}>
                      <div className="file-icon-bg" style={{ background: `${currentPart.color}22`, border: `1px solid ${currentPart.color}44` }}>
                        <FileText size={24} color={currentPart.color} />
                      </div>
                      <div className="file-info">
                        <h4>{chapter.name}</h4>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem' }}>
                          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{chapter.pages} p. • {chapter.words} words</span>
                          <span className={`difficulty-badge ${chapter.difficulty}`}>{chapter.difficulty}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {chapter.content.split('\n').filter(l => l.trim()).length} topics
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-read" onClick={() => { setPreviousView('part_folder'); handleReadFile(chapter); }}>Read</button>
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
                  <button onClick={() => setCurrentView(previousView === 'part_folder' ? 'part_folder' : 'folder')} className="btn-back" style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ArrowLeft size={20} />
                  </button>
                  <h2 style={{ margin: 0 }}>{currentFile?.name}</h2>
                </div>
                <div className="reader-content">
                  {currentFile?.content ? (
                    currentFile.content.includes('§') ? (
                      <>
                        <h3 style={{ marginBottom: '1.25rem', color: 'var(--text-main)' }}>Chapter Topics</h3>
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
                        <h3>Audio Transcription</h3>
                        <div className="transcription-box" style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', marginTop: '1rem' }}>
                          <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', margin: 0 }}>{currentFile.content}</p>
                        </div>
                      </>
                    )
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

                  <button
                    className="fab-button"
                    onClick={() => setCreateQuestionState({ ...createQuestionState, isOpen: true })}
                    title="Create Flashcard / Question"
                  >
                    <Plus size={28} />
                  </button>
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
                              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button className="btn-skip" style={{ flex: 1, padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} onClick={() => setStudyState({ ...studyState, transcript: '' })}>
                                  <Mic size={18} /> Re-record
                                </button>
                                <button className="btn-save" style={{ flex: 2, padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} onClick={handleEvaluateAudio}>
                                  <BrainCircuit size={18} /> Check answer
                                </button>
                              </div>
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

                <div className="calendar-grid">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => <div key={d} className="weekday-label">{d}</div>)}
                  {(() => {
                    const argumentSchedule = computeArgumentSchedule(goals, subjectArguments);
                    return getCalendarDays(calendarDate).map((day, idx) => {
                      const dayNameEn = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx % 7];
                      const dayNameIt = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"][idx % 7];
                      const activeSessions = [];
                      const dayKey = day ? `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : null;
                      const dayArguments = (dayKey && argumentSchedule[dayKey]) || {};

                      if (day) {
                        const cellDateStr = dayKey;
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
                        <div
                          key={idx}
                          className={`calendar-cell ${day ? '' : 'empty'} ${isToday ? 'today' : ''}`}
                          onClick={() => {
                            if (day) {
                              setSelectedCalendarDay({
                                day,
                                date: new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day),
                                activeSessions,
                                dayArguments
                              });
                            }
                          }}
                          style={{ cursor: day ? 'pointer' : 'default' }}
                        >
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
                              {activeSessions.map((session, sIdx) => {
                                const subjectColor = getSubjectColor(session.subject);
                                return (
                                  <div key={sIdx} style={{
                                    marginBottom: '4px',
                                    background: `${subjectColor}15`,
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    border: `1px solid ${subjectColor}30`
                                  }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: subjectColor, flexShrink: 0 }}></span>
                                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: subjectColor, fontWeight: 600 }}>{session.subject} ({session.hours}h)</span>
                                    </div>
                                    {dayArguments[session.subject] && (
                                      <div className="calendar-argument-chip" style={{ color: subjectColor, opacity: 0.8 }}>{dayArguments[session.subject]}</div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>

                {selectedCalendarDay && (
                  <div className="modal-overlay" onClick={() => setSelectedCalendarDay(null)}>
                    <motion.div className="modal-content" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }} onClick={(e) => e.stopPropagation()}>
                      <div className="modal-header">
                        <Calendar size={32} color="var(--primary)" />
                        <h3>{selectedCalendarDay.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
                      </div>
                      <div className="modal-body">
                        {selectedCalendarDay.activeSessions.length === 0 ? (
                          <p style={{ color: 'var(--text-muted)' }}>No study sessions planned for this day.</p>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {selectedCalendarDay.activeSessions.map((session, sIdx) => {
                              const subjectColor = getSubjectColor(session.subject);
                              return (
                                <div key={sIdx} style={{
                                  background: `${subjectColor}15`,
                                  padding: '1rem',
                                  borderRadius: '8px',
                                  border: `1px solid ${subjectColor}30`
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: subjectColor }}></span>
                                    <h4 style={{ color: subjectColor, margin: 0 }}>{session.subject}</h4>
                                    <span style={{ marginLeft: 'auto', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{session.hours} hours</span>
                                  </div>
                                  {selectedCalendarDay.dayArguments[session.subject] ? (
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
                                      <strong>Topic:</strong> {selectedCalendarDay.dayArguments[session.subject]}
                                    </div>
                                  ) : (
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No specific topic assigned.</div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <div className="modal-footer" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button onClick={() => setSelectedCalendarDay(null)} className="btn-skip" style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}>Close</button>
                      </div>
                    </motion.div>
                  </div>
                )}

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
                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
                              <div className="preview-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0 }}>
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
                                <div className="difficulty-selector" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  {file.content && !file.isTranscribing && (
                                    <button
                                      type="button"
                                      style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
                                      onClick={() => setExpandedTranscriptionIdx(expandedTranscriptionIdx === idx ? null : idx)}
                                      title="Preview Content"
                                    >
                                      <Eye size={14} /> Preview
                                    </button>
                                  )}
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
                              <AnimatePresence>
                                {expandedTranscriptionIdx === idx && file.content && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    style={{ overflow: 'hidden' }}
                                  >
                                    <div className="transcription-preview" style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-main)', maxHeight: '200px', overflowY: 'auto', marginTop: '0.5rem' }}>
                                      <strong style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>PREVIEW:</strong>
                                      <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{file.content}</p>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
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
                        <Folder size={20} color="#00CBCC" /> {subject}
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
                  <div className="goals-form" style={{ flex: '1' }}>
                    <div className="form-group">
                      <label><Calendar size={18} /> By when do you want to complete the study?</label>
                      <input type="date" className="input-date" value={tempGoal.deadline} onChange={(e) => setTempGoal({ ...tempGoal, deadline: e.target.value })} />
                    </div>

                    <div className="form-group">
                      <label><Clock size={18} /> Daily study hours (estimated)</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <input type="range" min="1" max="12" step="0.5" value={tempGoal.dailyHours} onChange={(e) => setTempGoal({ ...tempGoal, dailyHours: parseFloat(e.target.value) })} className="range-slider" />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <input type="number" min="1" max="24" step="0.5" value={tempGoal.dailyHours} onChange={(e) => setTempGoal({ ...tempGoal, dailyHours: parseFloat(e.target.value) || 0 })} className="hours-display" style={{ width: '80px', padding: '0.5rem', outline: 'none' }} />
                          <span style={{ color: 'var(--text-muted)' }}>hours</span>
                        </div>
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
                </div>

                <div className="suggestion-box" style={{ width: '100%', marginTop: '1rem' }}>
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
                  <div className="stat-card" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div className="stat-header"><Flame color="#f97316" /> <h3>Daily Streak</h3></div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.5rem 0' }}>
                        <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)' }}>5</span>
                        <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>days</span>
                      </div>
                      <p style={{ color: 'var(--text-muted)' }}>Consecutive studies completed. Keep it up!</p>
                    </div>
                    <div className="bar-chart" style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '120px', flex: 2, marginLeft: '2rem', paddingBottom: '1rem' }}>
                      {[2.5, 3.2, 0, 4.5, 2.1, 3.8, 1.5, 3.0, 4.2, 0, 2.8, 3.5, 4.0, 3.7].map((hours, i) => {
                        const maxHeight = 5; // Max simulated hours
                        const heightPercent = (hours / maxHeight) * 100;
                        const studied = hours > 0;
                        return (
                          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', height: '100%' }}>
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                              <div style={{ width: '100%', height: `${heightPercent}%`, background: studied ? 'var(--primary)' : 'rgba(255,255,255,0.05)', borderRadius: '4px 4px 0 0', position: 'relative', minHeight: studied ? '5px' : '0' }}>
                                {studied && (
                                  <span style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', fontWeight: 'bold' }}>{hours}h</span>
                                )}
                              </div>
                            </div>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{i + 1}</span>
                          </div>
                        );
                      })}
                    </div>
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
                  <div className="stat-header"><Activity color="#00CBCC" /> <h3>Consistency with Study Plan</h3></div>
                  {(() => {
                    const mockHistory = [true, true, true, false, true, true, true, true, false, true, true, true, false, true];
                    const completed = mockHistory.filter(Boolean).length;
                    const rate = Math.round((completed / mockHistory.length) * 100);
                    return (
                      <>
                        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                          Your last two weeks. You have an adherence rate of <strong style={{ color: 'white' }}>{rate}%</strong>.
                        </p>
                        <div className="adherence-graph" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}>
                          {mockHistory.map((studied, i) => (
                            <div key={i} className={`adherence-day ${studied ? 'studied' : 'missed'}`} title={studied ? "Studied" : "Skipped"} style={{ flex: 1, height: '30px', borderRadius: '6px', cursor: 'pointer' }}></div>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Fixed move-menu overlay — rendered outside AnimatePresence so position:fixed isn't trapped by transforms */}
        {activeMoveMenu && (
          <>
            <div className="plan-move-backdrop" onClick={() => setActiveMoveMenu(null)} />
            <motion.div
              className="plan-move-menu"
              style={{ position: 'fixed', top: moveMenuPos.top, right: moveMenuPos.right }}
              initial={{ opacity: 0, scale: 0.92, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.13 }}
            >
              <div className="move-menu-label">Move to...</div>
              {planParts
                .filter(p => p.id !== activeMoveMenu.fromPartId)
                .map(targetPart => (
                  <button
                    key={targetPart.id}
                    className="move-menu-item"
                    onClick={() => handleMoveChapter(activeMoveMenu.chapterId, activeMoveMenu.fromPartId, targetPart.id)}
                  >
                    <span className="move-menu-dot" style={{ background: targetPart.color }} />
                    {targetPart.name}
                  </button>
                ))}
            </motion.div>
          </>
        )}

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
