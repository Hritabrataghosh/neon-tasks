import React from 'react';

const StatsPanel = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="stats-panel cyber-card loading">
        <div className="cyber-loader" />
        <span>LOADING_DATA...</span>
      </div>
    );
  }

  const overview = stats?.overview || { total: 0, completed: 0, pending: 0, highPriority: 0, overdue: 0 };
  const completionRate = stats?.completionRate || 0;

  return (
    <div className="stats-panel cyber-card">
      <div className="panel-header">
        <h3>◈ SYSTEM_METRICS</h3>
        <span className="live-indicator">LIVE</span>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-row">
            <span className="stat-icon">◈</span>
            <span className="stat-value">{overview.total}</span>
          </div>
          <span className="stat-label">TOTAL</span>
        </div>

        <div className="stat-box">
          <div className="stat-row">
            <span className="stat-icon" style={{color: 'var(--neon-green)'}}>✓</span>
            <span className="stat-value" style={{color: 'var(--neon-green)'}}>
              {overview.completed}
            </span>
          </div>
          <span className="stat-label">DONE</span>
        </div>

        <div className="stat-box">
          <div className="stat-row">
            <span className="stat-icon" style={{color: 'var(--neon-yellow)'}}>◉</span>
            <span className="stat-value" style={{color: 'var(--neon-yellow)'}}>
              {overview.pending}
            </span>
          </div>
          <span className="stat-label">PENDING</span>
        </div>

        <div className="stat-box">
          <div className="stat-row">
            <span className="stat-icon" style={{color: 'var(--neon-pink)'}}>⚠</span>
            <span className="stat-value" style={{color: 'var(--neon-pink)'}}>
              {overview.highPriority}
            </span>
          </div>
          <span className="stat-label">HIGH</span>
        </div>

        <div className="stat-box full-width">
          <div className="stat-row">
            <span className="stat-icon" style={{color: 'var(--neon-red)'}}>⚡</span>
            <span className="stat-value" style={{color: 'var(--neon-red)'}}>
              {overview.overdue}
            </span>
          </div>
          <span className="stat-label">OVERDUE</span>
        </div>
      </div>

      <div className="completion-section">
        <div className="completion-header">
          <span>COMPLETION_RATE</span>
          <span className="completion-percent">{completionRate}%</span>
        </div>
        <div className="cyber-progress">
          <div 
            className="cyber-progress-fill" 
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      <style>{`
        .stats-panel {
          padding: 20px;
          min-width: 0;
          overflow: hidden;
        }

        .stats-panel.loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 15px;
          min-height: 200px;
          color: var(--neon-cyan);
          font-family: var(--font-display);
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(0, 243, 255, 0.2);
        }

        .panel-header h3 {
          font-family: var(--font-display);
          font-size: 0.85rem;
          color: var(--neon-cyan);
          letter-spacing: 2px;
          margin: 0;
          white-space: nowrap;
        }

        .live-indicator {
          font-size: 0.65rem;
          color: var(--neon-green);
          font-family: var(--font-display);
          animation: pulse 2s infinite;
          white-space: nowrap;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 20px;
        }

        .stat-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 15px 10px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s;
          min-width: 0;
        }

        .stat-box.full-width {
          grid-column: span 2;
        }

        .stat-box:hover {
          border-color: var(--neon-cyan);
          transform: translateY(-2px);
        }

        .stat-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 5px;
        }

        .stat-icon {
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .stat-value {
          font-family: var(--font-display);
          font-size: 1.6rem;
          font-weight: 700;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.5);
          font-family: var(--font-display);
          letter-spacing: 1px;
          text-align: center;
        }

        .completion-section {
          padding-top: 15px;
          border-top: 1px solid rgba(0, 243, 255, 0.2);
        }

        .completion-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-family: var(--font-display);
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.6);
          letter-spacing: 1px;
        }

        .completion-percent {
          color: var(--neon-cyan);
          font-weight: 600;
        }

        .cyber-progress {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }

        .cyber-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--neon-cyan), var(--neon-pink));
          position: relative;
          transition: width 0.5s ease;
          box-shadow: 0 0 10px var(--neon-cyan);
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default StatsPanel;