import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Search, Bell, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { themePresets, VISIBLE_COLS, defaultMyTasks, defaultTeamTasks } from './utils/constants';
import SideRail from './components/SideRail';
import TaskColumn from './components/TaskColumn';
import TaskModal from './components/TaskModal';

// Simple helpers
function icon(name, size) {
  const icons = {
    'x': <X size={size} />,
    'check': <Check size={size} />,
    'chevronLeft': <ChevronLeft size={size} />,
    'chevronRight': <ChevronRight size={size} />,
    'search': <Search size={size} />,
    'bell': <Bell size={size} />,
  };
  return icons[name] || null;
}

function getInitials(name) {
  const parts = name.trim().split(' ');
  const initials = parts.length > 1 ? (parts[0][0] + parts[1][0]) : parts[0].slice(0, 2);
  return initials.toUpperCase();
}

export default function App() {
  const [settings, setSettings] = useLocalStorage('settings', { theme: 'pastel', notificationsEnabled: true });
  const [currentUser, setCurrentUser] = useLocalStorage('currentUser', { name: 'Insha N.', email: 'insha@example.com' });
  const [myTasks, setMyTasks] = useLocalStorage('myTasks', defaultMyTasks);
  const [teamTasks, setTeamTasks] = useLocalStorage('teamTasks', defaultTeamTasks);
  const [activityLog, setActivityLog] = useLocalStorage('activityLog', []);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [viewMode, setViewMode] = useState('my'); // 'my' or 'team'
  const [colOffset, setColOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDrawer, setActiveDrawer] = useState(null); // 'account', 'activity', 'review', 'settings'
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [presetList, setPresetList] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState({ open: false, title: '', message: '', callback: null });
  const notifRef = useRef(null);

  const themeData = themePresets[settings.theme] || themePresets.pastel;
  const categories = themeData.categories;

  const getActiveTasks = useCallback(() => {
    const tasks = viewMode === 'my' ? myTasks : teamTasks;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return tasks.filter(t =>
        (t.title && t.title.toLowerCase().includes(q)) ||
        (t.sub && t.sub.toLowerCase().includes(q))
      );
    }
    return tasks;
  }, [viewMode, myTasks, teamTasks, searchQuery]);

  const tasks = getActiveTasks();

  const logActivity = useCallback((text) => {
    const time = new Date().toLocaleString();
    setActivityLog(prev => {
      const updated = [{ text, time }, ...prev];
      return updated.slice(0, 30);
    });
    if (settings.notificationsEnabled) {
      setUnreadNotifCount(prev => prev + 1);
    }
  }, [settings.notificationsEnabled, setActivityLog]);

  const updateTasks = useCallback((newTasks) => {
    if (viewMode === 'my') {
      setMyTasks(newTasks);
    } else {
      setTeamTasks(newTasks);
    }
  }, [viewMode, setMyTasks, setTeamTasks]);

  const handleToggleDone = useCallback((taskId) => {
    const dataset = viewMode === 'my' ? myTasks : teamTasks;
    const updater = viewMode === 'my' ? setMyTasks : setTeamTasks;
    updater(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const completed = !t.completed;
      const needsReview = viewMode === 'team' ? completed : t.needsReview;
      logActivity((completed ? 'Marked done: ' : 'Reopened: ') + `"${t.title}"` + (viewMode === 'team' ? ' (Team)' : ''));
      return { ...t, completed, paused: completed ? false : t.paused, needsReview };
    }));
  }, [viewMode, myTasks, teamTasks, setMyTasks, setTeamTasks, logActivity]);

  const handleTogglePause = useCallback((taskId) => {
    const updater = viewMode === 'my' ? setMyTasks : setTeamTasks;
    updater(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const paused = !t.paused;
      logActivity((paused ? 'Paused: ' : 'Resumed: ') + `"${t.title}"` + (viewMode === 'team' ? ' (Team)' : ''));
      return { ...t, paused };
    }));
  }, [viewMode, setMyTasks, setTeamTasks, logActivity]);

  const handleDelete = useCallback((taskId) => {
    const updater = viewMode === 'my' ? setMyTasks : setTeamTasks;
    updater(prev => {
      const task = prev.find(t => t.id === taskId);
      if (task) logActivity(`Deleted: "${task.title}"` + (viewMode === 'team' ? ' (Team)' : ''));
      return prev.filter(t => t.id !== taskId);
    });
  }, [viewMode, setMyTasks, setTeamTasks, logActivity]);

  const handleEdit = useCallback((task) => {
    setEditingTask(task);
    setModalOpen(true);
  }, []);

  const handleAddTask = useCallback((categoryName) => {
    setEditingTask(null);
    setPresetList(categoryName);
    setModalOpen(true);
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const msgSpan = document.createElement('span');
    msgSpan.textContent = message;
    toast.appendChild(msgSpan);
    const dismissBtn = document.createElement('button');
    dismissBtn.className = 'toast-dismiss-btn';
    dismissBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    dismissBtn.addEventListener('click', () => removeToast(toast));
    toast.appendChild(dismissBtn);
    container.appendChild(toast);
    setTimeout(() => removeToast(toast), 3000);
  }, []);

  const removeToast = useCallback((toast) => {
    if (toast.classList.contains('removing')) return;
    toast.classList.add('removing');
    setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 250);
  }, []);

  const handleSaveTask = useCallback(({ title, sub, time, assignee, list }) => {
    if (editingTask) {
      const updater = viewMode === 'my' ? setMyTasks : setTeamTasks;
      updater(prev => prev.map(t => {
        if (t.id !== editingTask.id) return t;
        logActivity(`Edited: "${title}"` + (viewMode === 'team' ? ' (Team)' : ''));
        return { ...t, title, sub, time, list, assignee: viewMode === 'team' ? (assignee || 'Unassigned') : t.assignee };
      }));
      showToast('Task updated successfully ');
    } else {
      const newTask = {
        id: Date.now(),
        title,
        sub,
        time,
        list,
        completed: false,
      };
      if (viewMode === 'team') {
        newTask.assignee = assignee || 'Unassigned';
        newTask.needsReview = false;
        setTeamTasks(prev => [...prev, newTask]);
      } else {
        setMyTasks(prev => [...prev, newTask]);
      }
      logActivity(`Added: "${title}"` + (viewMode === 'team' ? ` (Team, assigned to ${assignee || 'Unassigned'})` : ''));
    }
    setEditingTask(null);
    setModalOpen(false);
    setPresetList(null);
  }, [editingTask, viewMode, setMyTasks, setTeamTasks, logActivity, showToast]);

  const handleCloseModal = useCallback(() => {
    setEditingTask(null);
    setModalOpen(false);
    setPresetList(null);
  }, []);

  const handleDrop = useCallback((targetList) => {
    if (!draggedTaskId || !targetList) return;
    const dataset = viewMode === 'my' ? myTasks : teamTasks;
    const task = dataset.find(t => t.id === draggedTaskId);
    if (!task) return;
    const oldList = task.list;
    const updater = viewMode === 'my' ? setMyTasks : setTeamTasks;
    updater(prev => prev.map(t => {
      if (t.id !== draggedTaskId) return t;
      logActivity(`Moved: "${t.title}" from ${oldList} to ${targetList}` + (viewMode === 'team' ? ' (Team)' : ''));
      return { ...t, list: targetList };
    }));
    setDraggedTaskId(null);
  }, [draggedTaskId, viewMode, myTasks, teamTasks, setMyTasks, setTeamTasks, logActivity]);

  const handleMoveTask = useCallback((taskId, targetList) => {
    if (!taskId || !targetList) return;
    const dataset = viewMode === 'my' ? myTasks : teamTasks;
    const task = dataset.find(t => t.id === taskId);
    if (!task || task.list === targetList) return;
    const oldList = task.list;
    const updater = viewMode === 'my' ? setMyTasks : setTeamTasks;
    updater(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      logActivity(`Moved: "${t.title}" from ${oldList} to ${targetList}` + (viewMode === 'team' ? ' (Team)' : ''));
      return { ...t, list: targetList };
    }));
  }, [viewMode, myTasks, teamTasks, setMyTasks, setTeamTasks, logActivity]);

  const openDrawer = useCallback((type) => {
    if (type === 'board') return;
    setActiveDrawer(type);
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setActiveDrawer(null);
  }, []);

  const applyTheme = useCallback((themeKey) => {
    setSettings(prev => ({ ...prev, theme: themeKey }));
    setColOffset(0);
  }, [setSettings]);

  const handleClearData = useCallback(() => {
    setMyTasks([]);
    setTeamTasks([]);
    setActivityLog([]);
    setUnreadNotifCount(0);
    closeDrawer();
  }, [setMyTasks, setTeamTasks, setActivityLog, closeDrawer]);

  const reviewBadgeCount = teamTasks.filter(t => t.completed && t.needsReview).length;

  const visibleCategories = categories.slice(colOffset, colOffset + VISIBLE_COLS);
  const isSearching = searchQuery.length > 0;

  let categoriesToRender = visibleCategories;
  if (isSearching) {
    categoriesToRender = visibleCategories.filter(cat =>
      tasks.some(t => t.list === cat.name)
    );
  }

  const handleConfirm = useCallback((title, message, callback) => {
    setConfirmState({ open: true, title, message, callback });
  }, []);

  // Close notif dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target) && e.target !== document.getElementById('bellBtn') && !e.target.closest('.bell-btn')) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // Update body background
  useEffect(() => {
    document.body.style.background = themeData.bg;
    document.body.style.backgroundSize = "300% 300%";
  }, [themeData.bg]);

  return (
    <>
    <div className="app" id="appRoot">
      <SideRail
        activeDrawer={activeDrawer}
        onOpenDrawer={openDrawer}
        reviewBadge={reviewBadgeCount}
      />

      <div className="board-container">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="date-tabs">
            <span>{new Date(Date.now() - 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            <span className="today">Today</span>
            <span>{new Date(Date.now() + 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="top-right">
            <div className="search-wrap">
              <Search size={13} />
              <input type="text" placeholder="Search tasks..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>

            <span className="stats-bar">
              <span>Total <span className="stat-num">{tasks.length}</span></span>
              <span>Done <span className="stat-num">{tasks.filter(t => t.completed).length}</span></span>
            </span>

            <span className="cat-counter">
              {isSearching
                ? `Showing ${categoriesToRender.length} categor${categoriesToRender.length !== 1 ? 'ies' : 'y'} with matches`
                : `Categories: ${visibleCategories.length}/${categories.length}`
              }
            </span>

            <button className="nav-btn" onClick={() => setColOffset(prev => Math.max(0, prev - 1))}>
              <ChevronLeft size={13} />
            </button>
            <button className="nav-btn" onClick={() => setColOffset(prev => Math.min(categories.length - VISIBLE_COLS, prev + 1))}>
              <ChevronRight size={13} />
            </button>

            <div style={{ position: 'relative' }}>
              <button className="bell-btn" id="bellBtn" onClick={() => { setNotifOpen(prev => !prev); setUnreadNotifCount(0); }}>
                <Bell size={14} />
                {unreadNotifCount > 0 && <span className="rail-badge">{unreadNotifCount}</span>}
              </button>
              <div className={`notif-dropdown ${notifOpen ? 'open' : ''}`} ref={notifRef}>
                <h4>Notifications</h4>
                {activityLog.length === 0 ? (
                  <div className="notif-empty">No notifications yet</div>
                ) : (
                  activityLog.slice(0, 5).map((entry, i) => (
                    <div key={i} className="notif-item">{entry.text}</div>
                  ))
                )}
              </div>
            </div>

            <div className="avatar" onClick={() => openDrawer('account')}>
              {getInitials(currentUser.name)}
            </div>
          </div>
        </div>

        {/* Board tabs */}
        <div className="board-tabs">
          <div className={`board-tab ${viewMode === 'my' ? 'active' : ''}`} onClick={() => { setViewMode('my'); setColOffset(0); }}>
            My Board
          </div>
          <div className={`board-tab ${viewMode === 'team' ? 'active' : ''}`} onClick={() => { setViewMode('team'); setColOffset(0); }}>
            Team Board
          </div>
        </div>

        {/* Columns */}
        {isSearching && tasks.length === 0 ? (
          <div className="no-results">
            <div className="no-results-inner">
              <div className="no-results-icon"><Search size={48} /></div>
              <p className="no-results-text">No results found</p>
              <p className="no-results-sub">No tasks match "{searchQuery}". Try a different search term.</p>
            </div>
          </div>
        ) : (
          <div className="columns">
            {categoriesToRender.map(cat => (
<TaskColumn
                key={cat.name}
                category={cat}
                tasks={tasks.filter(t => t.list === cat.name)}
                viewMode={viewMode}
                categories={categories}
                onToggleDone={handleToggleDone}
                onTogglePause={handleTogglePause}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onDragStart={(id) => setDraggedTaskId(id)}
                onDragEnd={() => setDraggedTaskId(null)}
                onDrop={handleDrop}
                onAddTask={handleAddTask}
                onMoveTask={handleMoveTask}
              />
            ))}
          </div>
        )}
      </div>

      {/* Task Modal */}
      {modalOpen && (
        <TaskModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveTask}
          categories={categories}
          editingTask={editingTask}
          viewMode={viewMode}
          presetList={presetList}
        />
      )}

      {/* Drawer */}
      <div className={`drawer-overlay ${drawerOpen ? 'open' : ''}`} onClick={closeDrawer}></div>
      <div className={`drawer ${drawerOpen ? 'open' : ''}`}>
        <button className="drawer-close" onClick={closeDrawer}><X size={13} /></button>
        <div id="drawerContent">
          {activeDrawer === 'account' && (
            <>
              <h2>Account</h2>
              <div className="account-avatar">{getInitials(currentUser.name)}</div>
              <div className="account-field">
                <label>Name</label>
                <input type="text" defaultValue={currentUser.name} id="nameInput" />
              </div>
              <div className="account-field">
                <label>Email</label>
                <input type="text" defaultValue={currentUser.email} id="emailInput" />
              </div>
              <button className="save-account-btn" onClick={() => {
                const name = document.getElementById('nameInput').value.trim() || currentUser.name;
                const email = document.getElementById('emailInput').value.trim() || currentUser.email;
                setCurrentUser({ name, email });
                logActivity('Updated account details');
                closeDrawer();
              }}>Save Changes</button>
              <button className="signout-btn" onClick={() => {
                handleConfirm('Sign Out', 'Are you sure you want to sign out? Any unsaved changes will be lost.', () => {
                  alert('Signed out successfully! (Demo — no backend connected yet.)');
                });
              }}>Sign Out</button>
            </>
          )}
          {activeDrawer === 'activity' && (
            <>
              <h2>Recent Activity</h2>
              {activityLog.length === 0 ? (
                <div className="notif-empty">No activity yet</div>
              ) : (
                activityLog.map((entry, i) => (
                  <div key={i} className="activity-item">
                    {entry.text}
                    <span className="activity-time">{entry.time}</span>
                  </div>
                ))
              )}
            </>
          )}
          {activeDrawer === 'review' && (
            <>
              <h2>Review Team Tasks</h2>
              {reviewBadgeCount === 0 ? (
                <div className="notif-empty">Nothing waiting for review 🎉</div>
              ) : (
                teamTasks.filter(t => t.completed && t.needsReview).map(t => (
                  <div key={t.id} className="review-item" data-id={t.id}>
                    <p>{t.title}</p>
                    <span><span dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' }} /> {t.assignee || "Unassigned"} • {t.list}</span>
                    <div className="review-actions">
                      <button className="approve-btn" onClick={() => {
                        setTeamTasks(prev => prev.map(tt => tt.id === t.id ? { ...tt, needsReview: false } : tt));
                        logActivity(`Approved: "${t.title}" (Team)`);
                      }}>Approve</button>
                      <button className="reject-btn" onClick={() => {
                        setTeamTasks(prev => prev.map(tt => tt.id === t.id ? { ...tt, completed: false, needsReview: false } : tt));
                        logActivity(`Rejected & reopened: "${t.title}" (Team)`);
                      }}>Reject</button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
          {activeDrawer === 'settings' && (
            <>
              <h2>Settings</h2>
              <div className="account-field">
                <label>Theme</label>
                {Object.keys(themePresets).map(key => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, fontSize: '12.5px', color: '#3d3d3d', marginTop: '8px' }}>
                    <input type="radio" name="themeChoice" value={key} checked={settings.theme === key} onChange={() => applyTheme(key)} />
                    {themePresets[key].label}
                  </label>
                ))}
              </div>
              <div className="account-field" style={{ marginTop: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" checked={settings.notificationsEnabled} onChange={e => {
                    setSettings(prev => ({ ...prev, notificationsEnabled: e.target.checked }));
                    if (!e.target.checked) setUnreadNotifCount(0);
                  }} />
                  Enable notifications
                </label>
              </div>
              <button className="signout-btn" style={{ marginTop: '26px' }} onClick={() => {
                handleConfirm('Clear All Data', 'This permanently deletes your tasks, team tasks, and activity log from this browser.', handleClearData);
              }}>Clear All Data</button>
              <p style={{ fontSize: '10.5px', color: '#888', marginTop: '8px' }}>
                This permanently deletes your tasks, team tasks, and activity log from this browser.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Toast container */}
      <div className="toast-container" id="toastContainer"></div>
    </div>

    {/* Confirm modal (outside .app for proper centering) */}
    {confirmState.open && (
      <div className="overlay open" onClick={(e) => { if (e.target === e.currentTarget) setConfirmState({ open: false, title: '', message: '', callback: null }); }}>
        <div className="confirm-modal">
          <h3>{confirmState.title}</h3>
          <p>{confirmState.message}</p>
          <div className="confirm-actions">
            <button className="confirm-cancel" onClick={() => setConfirmState({ open: false, title: '', message: '', callback: null })}>Cancel</button>
            <button className="confirm-proceed" onClick={() => {
              const cb = confirmState.callback;
              setConfirmState({ open: false, title: '', message: '', callback: null });
              if (cb) cb();
            }}>Proceed</button>
          </div>
        </div>
      </div>
)}
    </>
  );
}

