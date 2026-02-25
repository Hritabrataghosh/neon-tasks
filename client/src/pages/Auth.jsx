import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="auth-page">
      {/* Animated Background Elements */}
      <div className="auth-bg-elements">
        <div className="floating-hex" style={{ 
          transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * 0.02}px)` 
        }}>⬡</div>
        <div className="floating-hex delayed" style={{ 
          transform: `translate(${-mousePos.x * 0.03}px, ${-mousePos.y * 0.03}px)` 
        }}>⬢</div>
        <div className="circuit-line" />
        <div className="circuit-line vertical" />
      </div>

      <div className="auth-container">
        <div className="auth-header">
          <div className="logo-container">
            <div className="logo-ring outer" />
            <div className="logo-ring inner" />
            <span className="logo-icon">◈</span>
          </div>
          <h1 className="glitch" data-text="NEON_TASKS">NEON_TASKS</h1>
          <div className="version-badge">
            <span className="version-text">v2.077</span>
            <span className="separator">//</span>
            <span className="status-text">SYSTEM_ONLINE</span>
          </div>
        </div>
        
        <div className={`auth-card cyber-card ${isLogin ? 'login-mode' : 'register-mode'}`}>
          <div className="card-header">
            <div className="corner-decoration top-left" />
            <div className="corner-decoration top-right" />
            <div className="corner-decoration bottom-left" />
            <div className="corner-decoration bottom-right" />
          </div>
          
          <div className="form-wrapper">
            {isLogin ? (
              <Login onToggle={() => setIsLogin(false)} />
            ) : (
              <Register onToggle={() => setIsLogin(true)} />
            )}
          </div>
        </div>

        <div className="auth-footer">
          <div className="tech-stack">
            {['REACT', 'NODE', 'MONGO', 'EXPRESS'].map((tech, i) => (
              <span key={tech} className="tech-item" style={{ animationDelay: `${i * 0.1}s` }}>
                {tech}
              </span>
            ))}
          </div>
          <div className="security-badge">
            <span className="shield-icon">🛡</span>
            <span>256-BIT ENCRYPTION ACTIVE</span>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .auth-bg-elements {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: -1;
        }

        .floating-hex {
          position: absolute;
          font-size: 200px;
          color: rgba(0, 243, 255, 0.03);
          animation: float 10s ease-in-out infinite;
        }

        .floating-hex:first-child {
          top: 10%;
          left: 10%;
        }

        .floating-hex.delayed {
          bottom: 10%;
          right: 10%;
          animation-delay: -5s;
          color: rgba(255, 0, 255, 0.03);
        }

        .circuit-line {
          position: absolute;
          width: 200px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--neon-cyan), transparent);
          opacity: 0.3;
          animation: circuitMove 8s linear infinite;
        }

        .circuit-line.vertical {
          width: 1px;
          height: 200px;
          background: linear-gradient(180deg, transparent, var(--neon-pink), transparent);
          right: 20%;
          top: 20%;
        }

        @keyframes circuitMove {
          0% { transform: translateX(-100vw); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateX(100vw); opacity: 0; }
        }

        .auth-container {
          width: 100%;
          max-width: 480px;
          animation: fadeIn 0.8s ease-out;
          z-index: 1;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 40px;
          position: relative;
        }

        .logo-container {
          position: relative;
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-ring {
          position: absolute;
          border: 2px solid var(--neon-cyan);
          border-radius: 50%;
          animation: rotate 10s linear infinite;
        }

        .logo-ring.outer {
          width: 100%;
          height: 100%;
          border-top-color: transparent;
          border-bottom-color: transparent;
        }

        .logo-ring.inner {
          width: 70%;
          height: 70%;
          border-left-color: var(--neon-pink);
          border-right-color: var(--neon-pink);
          border-top-color: transparent;
          border-bottom-color: transparent;
          animation-direction: reverse;
          animation-duration: 7s;
        }

        .logo-icon {
          font-size: 2rem;
          color: var(--neon-cyan);
          text-shadow: 0 0 20px var(--neon-cyan);
          z-index: 1;
        }

        .auth-header h1 {
          font-family: var(--font-display);
          font-size: 2.8rem;
          font-weight: 900;
          color: var(--neon-cyan);
          text-shadow: 0 0 30px rgba(0, 243, 255, 0.5);
          margin-bottom: 15px;
          letter-spacing: 6px;
        }

        .version-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-family: var(--font-display);
          font-size: 0.8rem;
        }

        .version-text {
          color: var(--neon-pink);
        }

        .separator {
          color: rgba(255, 255, 255, 0.3);
        }

        .status-text {
          color: var(--neon-green);
          animation: pulse 2s infinite;
        }

        .auth-card {
          padding: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(20,20,35,0.95), rgba(10,10,20,0.98));
          box-shadow: 0 25px 80px rgba(0,243,255,0.15);
          position: relative;
          transition: all 0.5s;
        }

        .card-header {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        .corner-decoration {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid var(--neon-cyan);
          opacity: 0.5;
        }

        .corner-decoration.top-left {
          top: 15px;
          left: 15px;
          border-right: none;
          border-bottom: none;
        }

        .corner-decoration.top-right {
          top: 15px;
          right: 15px;
          border-left: none;
          border-bottom: none;
        }

        .corner-decoration.bottom-left {
          bottom: 15px;
          left: 15px;
          border-right: none;
          border-top: none;
        }

        .corner-decoration.bottom-right {
          bottom: 15px;
          right: 15px;
          border-left: none;
          border-top: none;
        }

        .form-wrapper {
          animation: slideIn 0.5s ease-out;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .auth-footer {
          margin-top: 40px;
          text-align: center;
        }

        .tech-stack {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .tech-item {
          padding: 8px 16px;
          background: rgba(0, 243, 255, 0.05);
          border: 1px solid rgba(0, 243, 255, 0.2);
          color: rgba(255, 255, 255, 0.6);
          font-family: var(--font-display);
          font-size: 0.7rem;
          letter-spacing: 2px;
          animation: fadeInUp 0.5s ease-out backwards;
          transition: all 0.3s;
        }

        .tech-item:hover {
          border-color: var(--neon-cyan);
          color: var(--neon-cyan);
          box-shadow: 0 0 15px rgba(0, 243, 255, 0.2);
          transform: translateY(-2px);
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .security-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          font-family: var(--font-display);
        }

        .shield-icon {
          font-size: 1rem;
          animation: pulse 2s infinite;
        }

        @media (max-width: 600px) {
          .auth-header h1 {
            font-size: 2rem;
            letter-spacing: 3px;
          }
          .auth-card {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Auth;