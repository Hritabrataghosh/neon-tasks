import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Login = ({ onToggle }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccess(false);
    setLoading(true);

    if (!formData.email || !formData.password) {
      setLocalError('⚠ Please enter all credentials');
      setLoading(false);
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      setLocalError(`⚠ ${result.error}`);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="form-header">
        <h2 className="glitch" data-text="SYSTEM_LOGIN">SYSTEM_LOGIN</h2>
        <div className="connection-status">
          <span className="pulse-dot" />
          <span>SECURE CONNECTION ESTABLISHED</span>
        </div>
      </div>
      
      {localError && (
        <div className="error-message">
          {localError}
        </div>
      )}

      {success && (
        <div className="success-message">
          <span className="checkmark">✓</span>
          ACCESS GRANTED - INITIALIZING...
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="input-group">
          <label>
            <span className="label-icon">◉</span>
            EMAIL_ID
          </label>
          <div className="input-wrapper">
            <input
              type="email"
              className="cyber-input"
              placeholder="operative@neon.net"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              disabled={loading || success}
              autoComplete="email"
            />
            <div className="input-line" />
          </div>
        </div>

        <div className="input-group">
          <label>
            <span className="label-icon">◈</span>
            PASSWORD_KEY
          </label>
          <div className="input-wrapper">
            <input
              type="password"
              className="cyber-input"
              placeholder="••••••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              disabled={loading || success}
              autoComplete="current-password"
            />
            <div className="input-line" />
          </div>
        </div>

        <div className="form-options">
          <label className="remember-me">
            <input type="checkbox" className="cyber-checkbox" />
            <span>REMEMBER_SESSION</span>
          </label>
          <button type="button" className="forgot-link">
            RESET_KEY?
          </button>
        </div>

        <button 
          type="submit" 
          className={`neon-btn submit-btn ${loading ? 'processing' : ''}`}
          disabled={loading || success}
        >
          {loading ? (
            <span className="btn-content">
              <span className="spinner" />
              <span>AUTHENTICATING...</span>
            </span>
          ) : success ? (
            <span className="btn-content">
              <span className="success-icon">✓</span>
              <span>VERIFIED</span>
            </span>
          ) : (
            <span className="btn-content">
              <span>ACCESS_GRANTED</span>
              <span className="btn-arrow">→</span>
            </span>
          )}
        </button>
      </form>

      <div className="divider">
        <span>// OR //</span>
      </div>

      <p className="auth-switch">
        <span className="switch-text">New operative?</span>
        <button onClick={onToggle} className="switch-btn" disabled={loading}>
          <span className="btn-glitch">INITIALIZE_PROFILE</span>
        </button>
      </p>

      <style>{`
        .auth-form-container {
          position: relative;
        }

        .form-header {
          margin-bottom: 30px;
        }

        .form-header h2 {
          font-family: var(--font-display);
          font-size: 1.8rem;
          color: var(--neon-cyan);
          margin-bottom: 10px;
          letter-spacing: 3px;
        }

        .connection-status {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
          font-family: var(--font-display);
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background: var(--neon-green);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--neon-green);
          animation: pulse 2s infinite;
        }

        .input-group {
          margin-bottom: 25px;
        }

        .input-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--neon-cyan);
          font-size: 0.8rem;
          margin-bottom: 10px;
          font-family: var(--font-display);
          letter-spacing: 2px;
        }

        .label-icon {
          color: var(--neon-pink);
          font-size: 0.9rem;
        }

        .input-wrapper {
          position: relative;
        }

        .input-line {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--neon-cyan), var(--neon-pink));
          transition: width 0.3s;
        }

        .cyber-input:focus ~ .input-line {
          width: 100%;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          font-size: 0.8rem;
        }

        .remember-me {
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          transition: color 0.3s;
        }

        .remember-me:hover {
          color: var(--neon-cyan);
        }

        .remember-me span {
          font-family: var(--font-display);
          font-size: 0.75rem;
          letter-spacing: 1px;
        }

        .forgot-link {
          background: none;
          border: none;
          color: var(--neon-pink);
          cursor: pointer;
          font-family: var(--font-display);
          font-size: 0.75rem;
          letter-spacing: 1px;
          transition: all 0.3s;
        }

        .forgot-link:hover {
          color: var(--neon-cyan);
          text-shadow: 0 0 10px var(--neon-cyan);
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          font-size: 1rem;
          margin-bottom: 20px;
        }

        .submit-btn.processing {
          border-color: var(--neon-yellow);
          color: var(--neon-yellow);
        }

        .btn-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top-color: currentColor;
          border-radius: 50%;
          animation: rotate 1s linear infinite;
        }

        .success-icon {
          color: var(--neon-green);
          font-size: 1.2rem;
          animation: scaleIn 0.3s ease;
        }

        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }

        .btn-arrow {
          transition: transform 0.3s;
        }

        .neon-btn:hover .btn-arrow {
          transform: translateX(5px);
        }

        .divider {
          text-align: center;
          margin: 20px 0;
          position: relative;
        }

        .divider::before,
        .divider::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 30%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2));
        }

        .divider::after {
          right: 0;
          background: linear-gradient(90deg, rgba(255,255,255,0.2), transparent);
        }

        .divider span {
          color: rgba(255, 255, 255, 0.3);
          font-family: var(--font-display);
          font-size: 0.75rem;
          letter-spacing: 3px;
        }

        .auth-switch {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .switch-text {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85rem;
        }

        .switch-btn {
          background: transparent;
          border: 1px solid var(--neon-pink);
          color: var(--neon-pink);
          padding: 12px 24px;
          cursor: pointer;
          font-family: var(--font-display);
          font-size: 0.85rem;
          letter-spacing: 2px;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
          clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
        }

        .switch-btn:hover:not(:disabled) {
          background: var(--neon-pink);
          color: var(--dark-bg);
          box-shadow: 0 0 20px var(--neon-pink);
        }

        .switch-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-glitch {
          position: relative;
          display: inline-block;
        }

        .switch-btn:hover .btn-glitch {
          animation: glitch-text 0.3s infinite;
        }

        @keyframes glitch-text {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }

        .checkmark {
          font-size: 1.2rem;
          margin-right: 5px;
        }
      `}</style>
    </div>
  );
};

export default Login;