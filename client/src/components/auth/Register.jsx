import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Register = ({ onToggle }) => {
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '',
    confirmPassword: ''
  });
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    // Validation
    if (!formData.username || !formData.email || !formData.password) {
      setLocalError('Please fill in all fields');
      return;
    }
    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await register(formData.username, formData.email, formData.password);
    if (!result.success) {
      setLocalError(result.error);
    }
    setLoading(false);
  };

  const displayError = localError || error;

  return (
    <div className="auth-form-container">
      <h2 className="glitch" data-text="NEW_IDENTITY">NEW_IDENTITY</h2>
      <div className="auth-decoration">
        <span className="status-dot status-busy" />
        ENCRYPTING BIOMETRICS
      </div>
      
      {displayError && (
        <div className="error-message pulse-glow">
          ⚠ {displayError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="input-group">
          <label>OPERATIVE_NAME</label>
          <input
            type="text"
            className="cyber-input"
            placeholder="Codename"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
            disabled={loading}
            minLength={3}
          />
        </div>

        <div className="input-group">
          <label>EMAIL_ID</label>
          <input
            type="email"
            className="cyber-input"
            placeholder="enter@cyber.net"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <label>PASSWORD_KEY</label>
          <input
            type="password"
            className="cyber-input"
            placeholder="Min 6 characters"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
            disabled={loading}
            minLength={6}
          />
        </div>

        <div className="input-group">
          <label>CONFIRM_KEY</label>
          <input
            type="password"
            className="cyber-input"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="neon-btn pink" disabled={loading}>
          {loading ? (
            <>
              <span className="loading-spinner">◐</span> ENCRYPTING...
            </>
          ) : (
            'INITIALIZE'
          )}
        </button>
      </form>

      <p className="auth-switch">
        Existing operative? {' '}
        <button onClick={onToggle} className="text-btn" disabled={loading}>
          Access Terminal
        </button>
      </p>

      <style>{`
        .loading-spinner {
          display: inline-block;
          animation: spin 1s linear infinite;
          margin-right: 8px;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Register;