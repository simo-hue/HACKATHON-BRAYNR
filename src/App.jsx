import React, { useState, useCallback } from 'react';
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
  FolderPlus
} from 'lucide-react';
import './App.css';

function App() {
  // Navigation & Hierarchy State
  const [currentView, setCurrentView] = useState('home'); // 'home', 'folder', 'create_name', 'upload_files'
  const [currentFolder, setCurrentFolder] = useState(null);
  const [newSubjectName, setNewSubjectName] = useState('');
  
  // Mock File System State
  const [fileSystem, setFileSystem] = useState({
    "Intelligenza Artificiale": [
      { name: "Lezione 1 - Intro.pdf", type: "pdf" },
      { name: "Reti Neurali.docx", type: "doc" }
    ],
    "Fisica Quantistica": [
      { name: "Appunti Schrödinger.pdf", type: "pdf" }
    ]
  });

  // Upload State
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);

  // Sidebar navigation handlers
  const navigateToHome = () => {
    setCurrentView('home');
    setCurrentFolder(null);
    setUploadFiles([]);
    setNewSubjectName('');
  };

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

  const handleSaveUpload = () => {
    const targetFolder = currentView === 'upload_files' ? newSubjectName : currentFolder;
    
    setFileSystem(prev => {
      const updated = { ...prev };
      if (!updated[targetFolder]) {
        updated[targetFolder] = [];
      }
      
      const formattedFiles = uploadFiles.map(f => ({ name: f.name, type: "pdf" }));
      updated[targetFolder] = [...updated[targetFolder], ...formattedFiles];
      return updated;
    });

    setUploadFiles([]);
    setCurrentFolder(targetFolder);
    setCurrentView('folder');
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
      setUploadFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  }, []);
  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFiles(prev => [...prev, ...Array.from(e.target.files)]);
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
          <a onClick={navigateToHome} className={`nav-item ${['home', 'folder'].includes(currentView) ? 'active' : ''}`}>
            <Home size={20} />
            <span>Home</span>
          </a>
          <a onClick={handleStartCreate} className={`nav-item ${['create_name', 'upload_files'].includes(currentView) ? 'active' : ''}`}>
            <UploadCloud size={20} />
            <span>Inserisci Fonti</span>
          </a>
          <a className="nav-item">
            <Target size={20} />
            <span>Obiettivi</span>
          </a>
          <a className="nav-item">
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
                  <p>I tuoi documenti e appunti per questa materia.</p>
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
          <AnimatePresence mode="wait">
            
            {/* VIEW: HOME (Folders) */}
            {currentView === 'home' && (
              <motion.div 
                key="home"
                initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }}
                className="grid-container"
              >
                {Object.keys(fileSystem).map((folderName, idx) => (
                  <motion.div 
                    key={idx} 
                    className="folder-card"
                    whileHover={{ y: -5, scale: 1.02 }}
                    onClick={() => {
                      setCurrentFolder(folderName);
                      setCurrentView('folder');
                    }}
                  >
                    <div className="folder-icon-bg">
                      <Folder size={32} />
                    </div>
                    <h3>{folderName}</h3>
                    <p>{fileSystem[folderName].length} risorse</p>
                  </motion.div>
                ))}
                
                {/* The Add Button as the last card */}
                <motion.div 
                  className="folder-card add-card"
                  whileHover={{ y: -5, scale: 1.02 }}
                  onClick={handleStartCreate}
                >
                  <div className="add-icon-bg">
                    <Plus size={36} />
                  </div>
                  <h3>Nuova Materia</h3>
                </motion.div>
              </motion.div>
            )}

            {/* VIEW: FOLDER (Files inside) */}
            {currentView === 'folder' && (
              <motion.div 
                key="folder"
                initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }}
              >
                <div className="files-list">
                  {fileSystem[currentFolder]?.map((file, idx) => (
                    <motion.div 
                      key={idx} 
                      className="file-card"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                    >
                      <div className="file-icon-bg">
                        <FileText size={24} />
                      </div>
                      <div className="file-info">
                        <h4>{file.name}</h4>
                        <span>Analizzato e pronto per lo studio</span>
                      </div>
                      <button className="btn-study">Studia</button>
                    </motion.div>
                  ))}
                  
                  {fileSystem[currentFolder]?.length === 0 && (
                    <div className="empty-state">
                      Nessun file presente in questa materia.
                    </div>
                  )}

                  <motion.div 
                    className="file-card add-file-card"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (fileSystem[currentFolder]?.length || 0) * 0.05 }}
                    onClick={() => {
                      setUploadFiles([]);
                      setCurrentView('upload_files'); // Upload directly to current folder
                    }}
                  >
                    <Plus size={24} /> Aggiungi altre risorse
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* VIEW: CREATE SUBJECT NAME */}
            {currentView === 'create_name' && (
              <motion.div 
                key="create_name"
                initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }}
                className="center-container"
              >
                <form onSubmit={handleNameSubmit} className="create-subject-form">
                  <div className="icon-pulse">
                    <FolderPlus size={48} />
                  </div>
                  <h2>Come vuoi chiamare la materia?</h2>
                  <input 
                    type="text" 
                    autoFocus
                    placeholder="Es. Analisi Matematica 2, Diritto Privato..."
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    className="input-subject"
                  />
                  <button type="submit" className="btn-upload" disabled={!newSubjectName.trim()} style={{width: '100%', justifyContent: 'center'}}>
                    Avanti <ChevronRight size={20} />
                  </button>
                </form>
              </motion.div>
            )}

            {/* VIEW: UPLOAD FILES */}
            {currentView === 'upload_files' && (
              <motion.div 
                key="upload_files"
                initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }}
                className="upload-container"
              >
                <div 
                  className={`upload-zone ${isDragActive ? 'drag-active' : ''}`}
                  onDragEnter={onDragEnter}
                  onDragLeave={onDragLeave}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                >
                  {/* Decorative Elements */}
                  <div className="floating-element" style={{ top: '10%', left: '15%', color: 'rgba(139, 92, 246, 0.4)' }}><FileText size={32} /></div>
                  <div className="floating-element" style={{ top: '20%', right: '15%', color: 'rgba(59, 130, 246, 0.4)' }}><Video size={40} /></div>
                  <div className="floating-element" style={{ bottom: '15%', left: '20%', color: 'rgba(16, 185, 129, 0.4)' }}><Volume2 size={28} /></div>

                  <div className="upload-icon-wrapper" style={{ transform: isDragActive ? 'scale(1.1)' : 'scale(1)', transition: '0.2s' }}>
                    <UploadCloud size={40} />
                  </div>
                  
                  <h2>{isDragActive ? 'Rilascia i file qui...' : 'Trascina e rilascia i tuoi file'}</h2>
                  <p>Aggiungi risorse a <strong>{newSubjectName || currentFolder}</strong>. Supportiamo PDF, Word, PPT, immagini, audio e video.</p>
                  
                  <input type="file" id="file-upload" style={{ display: 'none' }} multiple onChange={handleFileInput} />
                  <label htmlFor="file-upload" className="btn-upload">Seleziona dal computer</label>

                  {/* Preview of selected files */}
                  <AnimatePresence>
                    {uploadFiles.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="files-preview-box"
                      >
                        <h3 className="preview-title"><CheckCircle2 size={18} color="#10b981" /> File pronti per l'analisi</h3>
                        <div className="preview-list">
                          {uploadFiles.map((file, idx) => (
                            <div key={idx} className="preview-item">
                              <FileIcon size={20} color="#a5b4fc" />
                              <span>{file.name}</span>
                            </div>
                          ))}
                        </div>
                        <button className="btn-start-analysis" onClick={handleSaveUpload}>
                          Salva e Inizia Analisi AI
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
