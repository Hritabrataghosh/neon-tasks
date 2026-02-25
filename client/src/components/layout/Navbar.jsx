import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [glitchText, setGlitchText] = useState('NEON_TASKS');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const texts = ['NEON_TASKS', 'N30N_T45K5', 'N€0N_T@$K$', 'N3ON_TASKS'];
      setGlitchText(texts[Math.floor(Math.random() * texts.length)]);
      setTimeout(() => setGlitchText('NEON_TASKS'), 150);
    }, 5000);
    return () => clearInterval(glitchInterval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <div className="logo-icon">◈</div>
        <span className="brand-text glitch" data-text={glitchText}>
          {glitchText}
        </span>
        <span className="version">v2.077</span>
      </div>

      <div className="nav-center">
        <div className="system-status">
          <span className="status-indicator online" />
          SYSTEM ONLINE
        </div>
        <div className="datetime">
          {currentTime.toLocaleTimeString()} // {currentTime.toLocaleDateString()}
        </div>
      </div>

      <div className="nav-user">
        <div className="user-info">
          <img src={user?.avatar} alt="avatar" className="user-avatar" />
          <div className="user-details">
            <span className="user-name">{user?.username}</span>
            <span className="user-rank">OPERATIVE</span>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn" title="Disconnect">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 70px;
          background: rgba(10, 10, 15, 0.95);
          border-bottom: 1px solid rgba(0, 243, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 30px;
          z-index: 1000;
          backdrop-filter: blur(10px);
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          font-size: 2rem;
          color: var(--neon-cyan);
          text-shadow: 0 0 20px var(--neon-cyan);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .brand-text {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--neon-cyan);
          letter-spacing: 2px;
        }

        .version {
          font-size: 0.7rem;
          color: var(--neon-pink);
          font-family: 'Orbitron', sans-serif;
          margin-left: 5px;
        }

        .nav-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }

        .system-status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Orbitron', sans-serif;
          font-size: 0.8rem;
          color: var(--neon-green);
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--neon-green);
          box-shadow: 0 0 10px var(--neon-green);
          animation: blink 2s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .datetime {
          font-family: 'Orbitron', sans-serif;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.5);
          letter-spacing: 2px;
        }

        .nav-user {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid var(--neon-cyan);
          box-shadow: 0 0 15px rgba(0, 243, 255, 0.3);
        }

        .user-details {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-family: 'Orbitron', sans-serif;
          font-weight: 600;
          color: #fff;
          font-size: 0.9rem;
        }

        .user-rank {
          font-size: 0.7rem;
          color: var(--neon-pink);
          font-family: 'Orbitron', sans-serif;
          letter-spacing: 1px;
        }

        .logout-btn {
          background: transparent;
          border: 1px solid var(--neon-red);
          color: var(--neon-red);
          padding: 8px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logout-btn:hover {
          background: var(--neon-red);
          color: #fff;
          box-shadow: 0 0 15px var(--neon-red);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;