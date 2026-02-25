import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useFont } from '../context/FontContext';
import api from '../services/api';

// Avatar presets using DiceBear
const AVATAR_PRESETS = [
  { id: 'cyber-1', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=cyber1&backgroundColor=00f3ff', name: 'Cyber Unit 01' },
  { id: 'cyber-2', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=cyber2&backgroundColor=ff00ff', name: 'Neon Unit 02' },
  { id: 'cyber-3', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hack&backgroundColor=bc13fe', name: 'Net Runner' },
  { id: 'cyber-4', url: 'https://api.dicebear.com/7.x/identicon/svg?seed=ghost&backgroundColor=ff073a', name: 'Ghost' },
  { id: 'cyber-5', url: 'https://api.dicebear.com/7.x/initials/svg?seed=AI&backgroundColor=39ff14', name: 'Synth' },
  { id: 'cyber-6', url: 'https://api.dicebear.com/7.x/shapes/svg?seed=wave&backgroundColor=fff01f', name: 'Wave' },
];

const Settings = () => {
  const { user, logout, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { fontSize, increaseFont, decreaseFont, fontSizes } = useFont();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [keyboardShortcuts, setKeyboardShortcuts] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [particleEffects, setParticleEffects] = useState(true);
  const [gridBackground, setGridBackground] = useState(true);
  const [exportFormat, setExportFormat] = useState('json');
  const [language, setLanguage] = useState('en');
  const [backupEmail, setBackupEmail] = useState(user?.email || '');
  const [saveStatus, setSaveStatus] = useState('');
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || AVATAR_PRESETS[0].url);
  const [storageUsed, setStorageUsed] = useState(0);
  
  const fileInputRef = useRef(null);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    setNotifications(savedSettings.notifications ?? true);
    setSoundEffects(savedSettings.soundEffects ?? true);
    setAutoSave(savedSettings.autoSave ?? true);
    setKeyboardShortcuts(savedSettings.keyboardShortcuts ?? true);
    setCompactMode(savedSettings.compactMode ?? false);
    setHighContrast(savedSettings.highContrast ?? false);
    setReduceMotion(savedSettings.reduceMotion ?? false);
    setScreenReader(savedSettings.screenReader ?? false);
    setParticleEffects(savedSettings.particleEffects ?? true);
    setGridBackground(savedSettings.gridBackground ?? true);
    setLanguage(savedSettings.language || 'en');
    setSelectedAvatar(user?.avatar || savedSettings.avatar || AVATAR_PRESETS[0].url);
    setBackupEmail(savedSettings.backupEmail || user?.email || '');
    
    calculateStorage();
  }, [user]);

  // Save settings to localStorage whenever they change (if autoSave is on)
  useEffect(() => {
    if (autoSave) {
      const settings = {
        notifications, soundEffects, autoSave, keyboardShortcuts,
        compactMode, highContrast, reduceMotion, screenReader,
        particleEffects, gridBackground, language, avatar: selectedAvatar, backupEmail
      };
      localStorage.setItem('userSettings', JSON.stringify(settings));
    }
  }, [notifications, soundEffects, autoSave, keyboardShortcuts, compactMode, highContrast, reduceMotion, screenReader, particleEffects, gridBackground, language, selectedAvatar, backupEmail]);

  // Apply high contrast mode
  useEffect(() => {
    document.body.classList.toggle('high-contrast', highContrast);
  }, [highContrast]);

  // Apply reduced motion
  useEffect(() => {
    document.body.classList.toggle('reduce-motion', reduceMotion);
  }, [reduceMotion]);

  // Apply screen reader optimization
  useEffect(() => {
    document.body.classList.toggle('screen-reader', screenReader);
  }, [screenReader]);

  // Apply compact mode
  useEffect(() => {
    document.body.classList.toggle('compact-mode', compactMode);
  }, [compactMode]);

  // Apply particle effects
  useEffect(() => {
    const event = new CustomEvent('toggleParticles', { detail: { enabled: particleEffects } });
    window.dispatchEvent(event);
  }, [particleEffects]);

  // Apply grid background
  useEffect(() => {
    document.body.classList.toggle('grid-disabled', !gridBackground);
  }, [gridBackground]);

  // Keyboard shortcuts setup
  useEffect(() => {
    if (!keyboardShortcuts) return;
    
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        document.querySelector('.title-input')?.focus();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        document.querySelector('.search-box input')?.focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [keyboardShortcuts]);

  const calculateStorage = () => {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length * 2;
      }
    }
    setStorageUsed((total / 1024 / 1024).toFixed(2));
  };

  const handleAvatarSelect = (avatarUrl) => {
    setSelectedAvatar(avatarUrl);
    updateUser({ ...user, avatar: avatarUrl });
    setSaveStatus('Avatar updated');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const handleCustomAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      setSaveStatus('File too large (max 2MB)');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedAvatar(event.target.result);
      updateUser({ ...user, avatar: event.target.result });
      setSaveStatus('Custom avatar uploaded');
      setTimeout(() => setSaveStatus(''), 2000);
    };
    reader.readAsDataURL(file);
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/todos');
      const data = response.data;
      
      if (exportFormat === 'csv') {
        const headers = ['Title', 'Description', 'Priority', 'Category', 'Completed', 'Due Date', 'Tags'];
        const rows = data.map(t => [
          `"${t.title?.replace(/"/g, '""') || ''}"`,
          `"${t.description?.replace(/"/g, '""') || ''}"`,
          t.priority,
          t.category,
          t.completed,
          t.dueDate || '',
          `"${t.tags?.join(', ') || ''}"`
        ]);
        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `neon-tasks-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        const exportData = {
          exportDate: new Date().toISOString(),
          version: '1.0',
          user: user?.username || 'anonymous',
          todos: data
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `neon-tasks-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      setSaveStatus('Export successful!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('Export failed: ' + error.message);
    }
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        let data;
        if (file.name.endsWith('.csv')) {
          const csv = event.target.result;
          const lines = csv.split('\n');
          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
          data = [];
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
            const obj = {};
            headers.forEach((header, index) => {
              let value = values[index] || '';
              value = value.replace(/^"|"$/g, '').trim();
              if (header === 'Completed') value = value === 'true';
              if (header === 'Tags') value = value ? value.split(',').map(t => t.trim()) : [];
              obj[header.toLowerCase().replace(' ', '')] = value;
            });
            data.push(obj);
          }
        } else {
          const parsed = JSON.parse(event.target.result);
          data = parsed.todos || parsed;
        }
        
        if (!Array.isArray(data)) throw new Error('Invalid data format');
        
        let successCount = 0;
        for (const todo of data) {
          try {
            await api.post('/todos', {
              title: todo.title || todo.Title || 'Untitled',
              description: todo.description || todo.Description || '',
              priority: todo.priority || todo.Priority || 'medium',
              category: todo.category || todo.Category || 'general',
              dueDate: todo.dueDate || todo.DueDate || null,
              tags: todo.tags || todo.Tags || [],
              completed: todo.completed || todo.Completed || false
            });
            successCount++;
          } catch (err) {
            console.error('Failed to import task:', err);
          }
        }
        
        setSaveStatus(`Imported ${successCount}/${data.length} tasks!`);
        setTimeout(() => window.location.reload(), 2000);
      } catch (error) {
        setSaveStatus('Import failed: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  const handleClearAll = async () => {
    if (window.confirm('⚠ WARNING: This will delete ALL tasks permanently!\n\nClick OK to proceed.')) {
      const confirmation = prompt('Type "DELETE" to confirm:');
      if (confirmation === 'DELETE') {
        try {
          const response = await api.get('/todos');
          for (const todo of response.data) {
            await api.delete(`/todos/${todo._id}`);
          }
          const settings = localStorage.getItem('userSettings');
          localStorage.clear();
          if (settings) localStorage.setItem('userSettings', settings);
          setSaveStatus('All data cleared. Reloading...');
          setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
          setSaveStatus('Clear failed: ' + error.message);
        }
      }
    }
  };

  const handleSaveBackupEmail = () => {
    localStorage.setItem('backupEmail', backupEmail);
    setSaveStatus('Backup email saved');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setSaveStatus(`Language: ${lang.toUpperCase()}`);
    setTimeout(() => setSaveStatus(''), 3000);
  };

  // Translations
  const t = {
    en: {
      systemSettings: 'SYSTEM_SETTINGS', configureParams: 'Configure your operative parameters',
      profile: 'PROFILE', appearance: 'APPEARANCE', accessibility: 'ACCESSIBILITY', alerts: 'ALERTS',
      dataMgmt: 'DATA_MGMT', shortcuts: 'SHORTCUTS', operativeProfile: 'OPERATIVE_PROFILE',
      codename: 'CODENAME', emailId: 'EMAIL_ID', operativeId: 'OPERATIVE_ID', accessLevel: 'ACCESS_LEVEL',
      admin: 'ADMIN', sessionControl: 'SESSION_CONTROL', terminateSession: 'TERMINATE_SESSION',
      interfaceConfig: 'INTERFACE_CONFIG', themeMode: 'THEME_MODE', themeDesc: 'Toggle between dark net and surface operations',
      lightMode: '☀ LIGHT_MODE', darkMode: '☾ DARK_MODE', fontSize: 'FONT_SIZE', fontDesc: 'Adjust text scaling',
      compactMode: 'COMPACT_MODE', compactDesc: 'Reduce spacing', particleEffects: 'PARTICLE_EFFECTS',
      particleDesc: 'Enable background animations', gridBackground: 'GRID_BACKGROUND', gridDesc: 'Show cyber grid pattern',
      preview: 'PREVIEW', accessibilityOptions: 'ACCESSIBILITY_OPTIONS', highContrast: 'HIGH_CONTRAST',
      highContrastDesc: 'Increase contrast', reduceMotion: 'REDUCE_MOTION', reduceMotionDesc: 'Minimize animations',
      screenReader: 'SCREEN_READER', screenReaderDesc: 'Enhance for assistive tech', alertConfig: 'ALERT_CONFIGURATION',
      pushAlerts: 'PUSH_ALERTS', pushDesc: 'Receive mission updates', audioCues: 'AUDIO_CUES', audioDesc: 'Enable sound effects',
      autoSave: 'AUTO_SAVE', autoSaveDesc: 'Auto-save progress', deadlineWarnings: 'DEADLINE_WARNINGS',
      deadlineDesc: 'Alert before due dates', weeklyReport: 'WEEKLY_REPORT', weeklyDesc: 'Receive weekly summary',
      backupEmail: 'BACKUP_EMAIL', dataManagement: 'DATA_MANAGEMENT', exportData: '📥 EXPORT_DATA',
      exportDesc: 'Download all mission data', importData: '📤 IMPORT_DATA', importDesc: 'Restore from backup file',
      dangerZone: '⚠ DANGER_ZONE', dangerDesc: 'Irreversible actions', clearAll: '🗑 CLEAR_ALL_DATA',
      storageUsage: 'STORAGE_USAGE', keyboardShortcuts: 'KEYBOARD_SHORTCUTS', enableShortcuts: 'ENABLE_SHORTCUTS',
      shortcutsDesc: 'Use keyboard for quick actions', availableShortcuts: 'AVAILABLE_SHORTCUTS', newMission: 'New Mission',
      search: 'Search', saveTask: 'Save Task', closeCancel: 'Close/Cancel', switchTabs: 'Switch Tabs',
      changeAvatar: 'CHANGE_AVATAR', selectAvatar: 'SELECT_AVATAR', uploadCustom: 'UPLOAD_CUSTOM',
      chooseFile: 'CHOOSE_FILE', downloadBackup: 'DOWNLOAD_BACKUP', save: 'SAVE', language: 'LANGUAGE'
    }
  }[language];

  return (
    <div className={`settings-page ${compactMode ? 'compact' : ''}`}>
      <header className="page-header">
        <h1 className="glitch" data-text={t.systemSettings}>{t.systemSettings}</h1>
        <p>{t.configureParams}</p>
        {saveStatus && <div className={`save-notification ${saveStatus.includes('failed') ? 'error' : ''}`}>{saveStatus}</div>}
      </header>

      <div className="settings-layout">
        <aside className="settings-nav">
          {[
            { id: 'profile', label: t.profile, icon: '👤' },
            { id: 'appearance', label: t.appearance, icon: '◈' },
            { id: 'accessibility', label: t.accessibility, icon: '♿' },
            { id: 'notifications', label: t.alerts, icon: '🔔' },
            { id: 'data', label: t.dataMgmt, icon: '💾' },
            { id: 'shortcuts', label: t.shortcuts, icon: '⌨' }
          ].map(tab => (
            <button key={tab.id} className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
              <span>{tab.icon}</span>{tab.label}
            </button>
          ))}
        </aside>

        <div className="settings-content">
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h3>{t.operativeProfile}</h3>
              <div className="profile-card">
                <div className="avatar-section">
                  <img src={selectedAvatar} alt="avatar" className="profile-avatar" />
                  <button className="change-avatar-btn" onClick={() => setShowAvatarModal(true)}>{t.changeAvatar}</button>
                </div>
                <div className="profile-info">
                  <div className="info-row"><label>{t.codename}</label><span>{user?.username}</span></div>
                  <div className="info-row"><label>{t.emailId}</label><span>{user?.email}</span></div>
                  <div className="info-row"><label>{t.operativeId}</label><span className="id-code">{user?._id?.slice(-8).toUpperCase()}</span></div>
                  <div className="info-row"><label>{t.accessLevel}</label><span className="badge">{t.admin}</span></div>
                  <div className="info-row">
                    <label>{t.language}</label>
                    <select className="cyber-select" value={language} onChange={(e) => handleLanguageChange(e.target.value)}>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="danger-zone">
                <h4>{t.sessionControl}</h4>
                <button className="neon-btn red full-width" onClick={logout}>🚪 {t.terminateSession}</button>
              </div>

              {showAvatarModal && (
                <div className="modal-overlay" onClick={() => setShowAvatarModal(false)}>
                  <div className="avatar-modal" onClick={e => e.stopPropagation()}>
                    <h4>{t.selectAvatar}</h4>
                    <div className="avatar-grid">
                      {AVATAR_PRESETS.map((avatar) => (
                        <button key={avatar.id} className={`avatar-option ${selectedAvatar === avatar.url ? 'selected' : ''}`} onClick={() => handleAvatarSelect(avatar.url)}>
                          <img src={avatar.url} alt={avatar.name} /><span>{avatar.name}</span>
                        </button>
                      ))}
                      <button className="avatar-option upload-option" onClick={() => fileInputRef.current?.click()}>
                        <span className="upload-icon">📁</span><span>{t.uploadCustom}</span>
                      </button>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleCustomAvatarUpload} style={{ display: 'none' }} />
                    <button className="neon-btn" onClick={() => setShowAvatarModal(false)}>{t.closeCancel}</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h3>{t.interfaceConfig}</h3>
              <div className="settings-group">
                <div className="setting-row">
                  <div className="setting-label-group">
                    <label className="setting-title">{t.themeMode}</label>
                    <p className="setting-desc">{t.themeDesc}</p>
                  </div>
                  <button className="theme-toggle-btn" onClick={toggleTheme}>{theme === 'dark' ? t.lightMode : t.darkMode}</button>
                </div>

                <div className="setting-row">
                  <div className="setting-label-group">
                    <label className="setting-title">{t.fontSize}</label>
                    <p className="setting-desc">{t.fontDesc}</p>
                  </div>
                  <div className="font-control-group">
                    <button className="font-btn" onClick={decreaseFont} disabled={fontSize === 'small'}>A-</button>
                    <span className="font-display">{fontSize.toUpperCase()}</span>
                    <button className="font-btn" onClick={increaseFont} disabled={fontSize === 'x-large'}>A+</button>
                  </div>
                </div>

                <div className="setting-row">
                  <div className="setting-label-group">
                    <label className="setting-title">{t.compactMode}</label>
                    <p className="setting-desc">{t.compactDesc}</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={compactMode} onChange={(e) => setCompactMode(e.target.checked)} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-row">
                  <div className="setting-label-group">
                    <label className="setting-title">{t.particleEffects}</label>
                    <p className="setting-desc">{t.particleDesc}</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={particleEffects} onChange={(e) => setParticleEffects(e.target.checked)} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-row">
                  <div className="setting-label-group">
                    <label className="setting-title">{t.gridBackground}</label>
                    <p className="setting-desc">{t.gridDesc}</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={gridBackground} onChange={(e) => setGridBackground(e.target.checked)} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="preview-panel">
                <h4>{t.preview}</h4>
                <div className="preview-content" style={{ fontSize: fontSizes?.[fontSize] || '16px' }}>
                  <p className="preview-text">Mission Control Interface</p>
                  <div className="preview-card"><span className="preview-badge">SAMPLE</span><span>Deploy operation</span></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'accessibility' && (
            <div className="settings-section">
              <h3>{t.accessibilityOptions}</h3>
              <div className="setting-item">
                <div className="setting-info"><label>{t.highContrast}</label><p>{t.highContrastDesc}</p></div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={highContrast} onChange={(e) => setHighContrast(e.target.checked)} />
                  <span className="slider" />
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info"><label>{t.reduceMotion}</label><p>{t.reduceMotionDesc}</p></div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={reduceMotion} onChange={(e) => setReduceMotion(e.target.checked)} />
                  <span className="slider" />
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info"><label>{t.screenReader}</label><p>{t.screenReaderDesc}</p></div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={screenReader} onChange={(e) => setScreenReader(e.target.checked)} />
                  <span className="slider" />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h3>{t.alertConfig}</h3>
              {[
                { key: 'notifications', label: t.pushAlerts, desc: t.pushDesc, value: notifications, set: setNotifications },
                { key: 'sound', label: t.audioCues, desc: t.audioDesc, value: soundEffects, set: setSoundEffects },
                { key: 'autosave', label: t.autoSave, desc: t.autoSaveDesc, value: autoSave, set: setAutoSave },
                { key: 'deadline', label: t.deadlineWarnings, desc: t.deadlineDesc, value: true, set: () => {} },
                { key: 'weekly', label: t.weeklyReport, desc: t.weeklyDesc, value: true, set: () => {} }
              ].map(item => (
                <div key={item.key} className="setting-item">
                  <div className="setting-info"><label>{item.label}</label><p>{item.desc}</p></div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={item.value} onChange={(e) => item.set(e.target.checked)} />
                    <span className="slider" />
                  </label>
                </div>
              ))}
              <div className="backup-email-section">
                <label>{t.backupEmail}</label>
                <div className="email-input-group">
                  <input type="email" className="cyber-input" value={backupEmail} onChange={(e) => setBackupEmail(e.target.value)} placeholder="backup@email.com" />
                  <button className="neon-btn" onClick={handleSaveBackupEmail}>{t.save}</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="settings-section">
              <h3>{t.dataManagement}</h3>
              <div className="data-actions">
                <div className="data-card">
                  <h4>{t.exportData}</h4>
                  <p>{t.exportDesc}</p>
                  <select className="cyber-input export-select" value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}>
                    <option value="json">JSON Format</option>
                    <option value="csv">CSV Format</option>
                  </select>
                  <button className="neon-btn green full-width" onClick={handleExport}>{t.downloadBackup}</button>
                </div>
                <div className="data-card">
                  <h4>                  {t.importData}</h4>
                  <p>{t.importDesc}</p>
                  <label className="file-input-label">
                    <input type="file" accept=".json,.csv" onChange={handleImport} className="file-input" />
                    <span className="file-btn">{t.chooseFile}</span>
                  </label>
                </div>
                <div className="data-card warning">
                  <h4>{t.dangerZone}</h4>
                  <p>{t.dangerDesc}</p>
                  <button className="neon-btn red full-width" onClick={handleClearAll}>{t.clearAll}</button>
                </div>
              </div>
              <div className="storage-info">
                <h4>{t.storageUsage}</h4>
                <div className="storage-bar">
                  <div className="storage-fill" style={{ width: `${Math.min((storageUsed / 10) * 100, 100)}%` }} />
                </div>
                <span>{storageUsed}MB of 10MB used ({Math.round((storageUsed / 10) * 100)}%)</span>
              </div>
            </div>
          )}

          {activeTab === 'shortcuts' && (
            <div className="settings-section">
              <h3>{t.keyboardShortcuts}</h3>
              <div className="setting-item">
                <div className="setting-info"><label>{t.enableShortcuts}</label><p>{t.shortcutsDesc}</p></div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={keyboardShortcuts} onChange={(e) => setKeyboardShortcuts(e.target.checked)} />
                  <span className="slider" />
                </label>
              </div>
              <div className="shortcuts-list">
                <h4>{t.availableShortcuts}</h4>
                <div className="shortcut-item"><kbd>Ctrl</kbd> + <kbd>N</kbd><span>{t.newMission}</span></div>
                <div className="shortcut-item"><kbd>Ctrl</kbd> + <kbd>/</kbd><span>{t.search}</span></div>
                <div className="shortcut-item"><kbd>Ctrl</kbd> + <kbd>Enter</kbd><span>{t.saveTask}</span></div>
                <div className="shortcut-item"><kbd>Esc</kbd><span>{t.closeCancel}</span></div>
                <div className="shortcut-item"><kbd>Ctrl</kbd> + <kbd>1-4</kbd><span>{t.switchTabs}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .settings-page { max-width: 1100px; margin: 0 auto; animation: fadeIn 0.5s ease; }
        .settings-page.compact .settings-content { padding: 15px; }
        .settings-page.compact .setting-item { padding: 12px 0; }
        
        .page-header { margin-bottom: 30px; position: relative; }
        .page-header h1 { font-family: var(--font-display); font-size: 2.2rem; color: var(--neon-cyan); margin-bottom: 8px; letter-spacing: 4px; }
        .page-header p { color: var(--text-muted); }
        
        .save-notification { position: absolute; top: 0; right: 0; padding: 10px 20px; background: rgba(57, 255, 20, 0.1); border: 1px solid var(--neon-green); color: var(--neon-green); font-family: var(--font-display); font-size: 0.85rem; animation: slideIn 0.3s; }
        .save-notification.error { background: rgba(255, 7, 58, 0.1); border-color: var(--neon-red); color: var(--neon-red); }
        
        .settings-layout { display: grid; grid-template-columns: 220px 1fr; gap: 25px; }
        .settings-nav { display: flex; flex-direction: column; gap: 8px; }
        .nav-tab { display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: var(--bg-card); border: 1px solid var(--border-color); color: var(--text-secondary); cursor: pointer; font-family: var(--font-display); font-size: 0.8rem; letter-spacing: 1px; transition: all 0.3s; text-align: left; }
        .nav-tab:hover { border-color: var(--neon-cyan); color: var(--neon-cyan); transform: translateX(5px); }
        .nav-tab.active { background: rgba(0, 243, 255, 0.1); border-color: var(--neon-cyan); color: var(--neon-cyan); }
        
        .settings-content { background: var(--bg-card); border: 1px solid var(--border-color); padding: 25px; }
        .settings-section h3 { font-family: var(--font-display); font-size: 1rem; color: var(--neon-cyan); letter-spacing: 2px; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid var(--border-color); }
        
        .profile-card { display: flex; gap: 25px; margin-bottom: 25px; padding: 25px; background: rgba(0, 0, 0, 0.2); border: 1px solid var(--border-color); }
        .avatar-section { display: flex; flex-direction: column; align-items: center; gap: 15px; }
        .profile-avatar { width: 100px; height: 100px; border-radius: 50%; border: 3px solid var(--neon-cyan); box-shadow: 0 0 30px rgba(0, 243, 255, 0.3); object-fit: cover; }
        .change-avatar-btn { padding: 8px 16px; background: transparent; border: 1px solid var(--neon-cyan); color: var(--neon-cyan); cursor: pointer; font-family: var(--font-display); font-size: 0.75rem; transition: all 0.3s; }
        .change-avatar-btn:hover { background: var(--neon-cyan); color: var(--bg-primary); }
        
        .profile-info { flex: 1; display: flex; flex-direction: column; gap: 15px; }
        .info-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
        .info-row label { color: var(--text-muted); font-size: 0.8rem; font-family: var(--font-display); }
        .info-row span { color: var(--text-primary); font-family: var(--font-display); }
        .info-row .id-code { font-family: monospace; color: var(--neon-pink); }
        .badge { padding: 4px 12px; background: var(--neon-purple); color: white; font-size: 0.75rem; border-radius: 4px; }
        
        .cyber-select { background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--neon-cyan); padding: 5px 10px; font-family: var(--font-display); cursor: pointer; }
        
        .danger-zone { padding: 20px; background: rgba(255, 7, 58, 0.05); border: 1px solid rgba(255, 7, 58, 0.3); }
        .danger-zone h4 { color: var(--neon-red); font-family: var(--font-display); margin-bottom: 15px; }
        
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(5px); }
        .avatar-modal { background: var(--bg-card); border: 2px solid var(--neon-cyan); padding: 30px; max-width: 500px; width: 90%; box-shadow: 0 0 50px rgba(0, 243, 255, 0.3); }
        .avatar-modal h4 { color: var(--neon-cyan); font-family: var(--font-display); margin-bottom: 20px; text-align: center; }
        .avatar-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px; }
        .avatar-option { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 15px; background: var(--bg-secondary); border: 2px solid var(--border-color); cursor: pointer; transition: all 0.3s; }
        .avatar-option:hover { border-color: var(--neon-cyan); transform: translateY(-2px); }
        .avatar-option.selected { border-color: var(--neon-cyan); background: rgba(0, 243, 255, 0.1); box-shadow: 0 0 20px rgba(0, 243, 255, 0.3); }
        .avatar-option img { width: 60px; height: 60px; border-radius: 50%; }
        .avatar-option span { font-size: 0.7rem; color: var(--text-secondary); text-align: center; }
        .upload-option { border-style: dashed; }
        .upload-icon { font-size: 2rem; }
        
        .settings-group { display: flex; flex-direction: column; gap: 5px; }
        .setting-row { display: flex; justify-content: space-between; align-items: center; padding: 18px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
        .setting-label-group { display: flex; flex-direction: column; gap: 5px; }
        .setting-title { color: var(--neon-cyan); font-family: var(--font-display); font-size: 0.9rem; }
        .setting-desc { color: var(--text-muted); font-size: 0.85rem; }
        
        .theme-toggle-btn { padding: 10px 20px; background: transparent; border: 1px solid var(--neon-cyan); color: var(--neon-cyan); cursor: pointer; font-family: var(--font-display); transition: all 0.3s; }
        .theme-toggle-btn:hover { background: var(--neon-cyan); color: var(--bg-primary); }
        
        .font-control-group { display: flex; align-items: center; gap: 15px; }
        .font-btn { width: 40px; height: 40px; border: 1px solid var(--neon-cyan); background: transparent; color: var(--neon-cyan); cursor: pointer; font-size: 1.2rem; transition: all 0.3s; }
        .font-btn:hover:not(:disabled) { background: var(--neon-cyan); color: var(--bg-primary); }
        .font-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .font-display { font-family: var(--font-display); color: var(--neon-cyan); min-width: 80px; text-align: center; }
        
        .toggle-switch { position: relative; width: 60px; height: 30px; }
        .toggle-switch input { opacity: 0; width: 0; height: 0; }
        .slider, .toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255, 255, 255, 0.1); transition: 0.3s; clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px)); }
        .slider::before, .toggle-slider::before { position: absolute; content: ""; height: 22px; width: 22px; left: 4px; bottom: 4px; background: var(--text-muted); transition: 0.3s; }
        input:checked + .slider, input:checked + .toggle-slider { background: rgba(0, 243, 255, 0.2); }
        input:checked + .slider::before, input:checked + .toggle-slider::before { transform: translateX(30px); background: var(--neon-cyan); box-shadow: 0 0 10px var(--neon-cyan); }
        
        .preview-panel { margin-top: 25px; padding: 20px; background: rgba(0, 0, 0, 0.3); border: 1px dashed var(--border-color); }
        .preview-panel h4 { color: var(--text-muted); font-family: var(--font-display); font-size: 0.8rem; margin-bottom: 15px; }
        .preview-content { margin-top: 15px; padding: 15px; background: var(--bg-card); border: 1px solid var(--border-color); }
        .preview-text { color: var(--neon-cyan); margin-bottom: 10px; }
        .preview-card { display: flex; align-items: center; gap: 10px; padding: 10px; background: rgba(0, 0, 0, 0.2); }
        .preview-badge { padding: 2px 8px; background: var(--neon-purple); color: white; font-size: 0.7rem; }
        
        .setting-item { display: flex; justify-content: space-between; align-items: center; padding: 18px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
        .setting-info label { display: block; color: var(--neon-cyan); font-family: var(--font-display); font-size: 0.9rem; margin-bottom: 5px; }
        .setting-info p { color: var(--text-muted); font-size: 0.85rem; }
        
        .data-actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 25px; }
        .data-card { padding: 25px; background: rgba(0, 0, 0, 0.2); border: 1px solid var(--border-color); text-align: center; }
        .data-card.warning { border-color: var(--neon-red); background: rgba(255, 7, 58, 0.05); }
        .data-card h4 { font-family: var(--font-display); color: var(--neon-cyan); margin-bottom: 10px; font-size: 1rem; }
        .data-card.warning h4 { color: var(--neon-red); }
        .data-card p { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px; }
        
        .export-select { margin-bottom: 15px; width: 100%; }
        .file-input-label { display: block; cursor: pointer; }
        .file-input { display: none; }
        .file-btn { display: inline-block; padding: 12px 24px; background: transparent; border: 1px solid var(--neon-cyan); color: var(--neon-cyan); font-family: var(--font-display); transition: all 0.3s; }
        .file-btn:hover { background: var(--neon-cyan); color: var(--bg-primary); }
        
        .storage-info { padding: 20px; background: rgba(0, 0, 0, 0.2); }
        .storage-info h4 { font-family: var(--font-display); color: var(--text-muted); font-size: 0.85rem; margin-bottom: 15px; }
        .storage-bar { height: 8px; background: rgba(255, 255, 255, 0.1); margin-bottom: 10px; }
        .storage-fill { height: 100%; background: linear-gradient(90deg, var(--neon-cyan), var(--neon-pink)); transition: width 0.5s; }
        .storage-info span { color: var(--text-muted); font-size: 0.85rem; }
        
        .backup-email-section { margin-top: 25px; padding-top: 25px; border-top: 1px solid var(--border-color); }
        .backup-email-section label { display: block; color: var(--neon-cyan); font-family: var(--font-display); font-size: 0.85rem; margin-bottom: 10px; }
        .email-input-group { display: flex; gap: 10px; }
        .email-input-group input { flex: 1; }
        
        .shortcuts-list { margin-top: 20px; }
        .shortcuts-list h4 { color: var(--text-muted); font-family: var(--font-display); font-size: 0.85rem; margin-bottom: 20px; }
        .shortcut-item { display: flex; align-items: center; gap: 20px; padding: 15px; background: rgba(0, 0, 0, 0.2); margin-bottom: 10px; border-left: 3px solid var(--neon-cyan); }
        .shortcut-item kbd { padding: 5px 10px; background: var(--bg-secondary); border: 1px solid var(--border-color); font-family: monospace; font-size: 0.9rem; color: var(--neon-cyan); }
        .shortcut-item span { color: var(--text-secondary); }
        
        .neon-btn { padding: 10px 20px; background: transparent; border: 1px solid var(--neon-cyan); color: var(--neon-cyan); cursor: pointer; font-family: var(--font-display); transition: all 0.3s; text-transform: uppercase; letter-spacing: 1px; }
        .neon-btn:hover { background: var(--neon-cyan); color: var(--bg-primary); box-shadow: 0 0 20px rgba(0, 243, 255, 0.4); }
        .neon-btn.red { border-color: var(--neon-red); color: var(--neon-red); }
        .neon-btn.red:hover { background: var(--neon-red); color: white; }
        .neon-btn.green { border-color: var(--neon-green); color: var(--neon-green); }
        .neon-btn.green:hover { background: var(--neon-green); color: var(--bg-primary); }
        
        .cyber-input { background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary); padding: 10px; font-family: var(--font-display); outline: none; transition: all 0.3s; }
        .cyber-input:focus { border-color: var(--neon-cyan); box-shadow: 0 0 10px rgba(0, 243, 255, 0.2); }
        
        .full-width { width: 100%; }
        
        @media (max-width: 768px) {
          .settings-layout { grid-template-columns: 1fr; }
          .settings-nav { flex-direction: row; overflow-x: auto; padding-bottom: 10px; }
          .nav-tab { white-space: nowrap; flex-shrink: 0; }
          .profile-card { flex-direction: column; align-items: center; }
          .data-actions { grid-template-columns: 1fr; }
          .email-input-group { flex-direction: column; }
          .avatar-grid { grid-template-columns: repeat(2, 1fr); }
        }
        
        body.high-contrast { --neon-cyan: #00ffff; --neon-pink: #ff00ff; --text-primary: #ffffff; --border-color: #ffffff; }
        body.high-contrast .settings-content, body.high-contrast .nav-tab, body.high-contrast .data-card, body.high-contrast .profile-card { border-width: 2px; }
        body.reduce-motion * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
        body.screen-reader { font-size: 1.1rem; line-height: 1.6; }
      `}</style>
    </div>
  );
};

export default Settings;