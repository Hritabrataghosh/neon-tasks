import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: '◈', path: '/dashboard' },
    { id: 'tasks', label: 'TASKS', icon: '▣', path: '/' },
    { id: 'analytics', label: 'ANALYTICS', icon: '◉', path: '/analytics' },
    { id: 'settings', label: 'SETTINGS', icon: '◐', path: '/settings' },
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button 
        className="collapse-btn"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? '▶' : '◀'}
      </button>

      <div className="sidebar-content">
        <div className="stats-panel">
          {!collapsed && (
            <>
              <h3>SYSTEM_STATS</h3>
              <div className="stat-item">
                <span className="stat-label">CPU</span>
                <div className="stat-bar">
                  <div className="stat-fill" style={{width: '45%'}} />
                </div>
                <span className="stat-value">45%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">RAM</span>
                <div className="stat-bar">
                  <div className="stat-fill ram" style={{width: '62%'}} />
                </div>
                <span className="stat-value">62%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">NET</span>
                <div className="stat-bar">
                  <div className="stat-fill net" style={{width: '89%'}} />
                </div>
                <span className="stat-value">89%</span>
              </div>
            </>
          )}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              {!collapsed && <span className="nav-label">{item.label}</span>}
              {location.pathname === item.path && <div className="active-indicator" />}
            </button>
          ))}
        </nav>

        {!collapsed && (
          <div className="terminal-output">
            <div className="terminal-header">TERMINAL_OUTPUT</div>
            <div className="terminal-lines">
              <p>{'>'} System initialized...</p>
              <p>{'>'} Connected to mainframe</p>
              <p>{'>'} Encryption: ACTIVE</p>
              <p className="blink">{'>'} _</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .sidebar {
          position: fixed;
          left: 0;
          top: 70px;
          bottom: 0;
          width: 260px;
          background: rgba(10, 10, 15, 0.98);
          border-right: 1px solid rgba(0, 243, 255, 0.2);
          transition: width 0.3s ease;
          z-index: 900;
          display: flex;
          flex-direction: column;
        }

        .sidebar.collapsed {
          width: 70px;
        }

        .collapse-btn {
          position: absolute;
          right: -15px;
          top: 20px;
          width: 30px;
          height: 30px;
          background: var(--dark-bg);
          border: 1px solid var(--neon-cyan);
          color: var(--neon-cyan);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          transition: all 0.3s;
        }

        .collapse-btn:hover {
          background: var(--neon-cyan);
          color: var(--dark-bg);
          box-shadow: 0 0 15px var(--neon-cyan);
        }

        .sidebar-content {
          padding: 30px 15px;
          display: flex;
          flex-direction: column;
          gap: 30px;
          height: 100%;
          overflow-y: auto;
        }

        .stats-panel h3 {
          font-family: 'Orbitron', sans-serif;
          font-size: 0.8rem;
          color: var(--neon-cyan);
          margin-bottom: 15px;
          letter-spacing: 2px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .stat-label {
          font-family: 'Orbitron', sans-serif;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.6);
          width: 30px;
        }

        .stat-bar {
          flex: 1;
          height: 4px;
          background: rgba(255,255,255,0.1);
          position: relative;
          overflow: hidden;
        }

        .stat-fill {
          height: 100%;
          background: var(--neon-cyan);
          box-shadow: 0 0 10px var(--neon-cyan);
          transition: width 0.5s ease;
        }

        .stat-fill.ram { background: var(--neon-pink); box-shadow: 0 0 10px var(--neon-pink); }
        .stat-fill.net { background: var(--neon-green); box-shadow: 0 0 10px var(--neon-green); }

        .stat-value {
          font-family: 'Orbitron', sans-serif;
          font-size: 0.7rem;
          color: #fff;
          width: 35px;
          text-align: right;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .nav-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          transition: all 0.3s;
          text-align: left;
          font-family: 'Rajdhani', sans-serif;
          font-size: 1rem;
          overflow: hidden;
        }

        .nav-item:hover {
          color: var(--neon-cyan);
          background: rgba(0, 243, 255, 0.05);
        }

        .nav-item.active {
          color: var(--neon-cyan);
          background: rgba(0, 243, 255, 0.1);
        }

        .nav-icon {
          font-size: 1.2rem;
          width: 20px;
          text-align: center;
        }

        .active-indicator {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: var(--neon-cyan);
          box-shadow: 0 0 10px var(--neon-cyan);
        }

        .terminal-output {
          margin-top: auto;
          background: rgba(0,0,0,0.5);
          border: 1px solid rgba(0, 243, 255, 0.2);
          padding: 15px;
          font-family: 'Courier New', monospace;
          font-size: 0.75rem;
        }

        .terminal-header {
          color: var(--neon-pink);
          margin-bottom: 10px;
          border-bottom: 1px solid rgba(255,0,255,0.3);
          padding-bottom: 5px;
        }

        .terminal-lines p {
          color: var(--neon-green);
          margin: 5px 0;
        }

        .blink {
          animation: blink-cursor 1s infinite;
        }

        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;