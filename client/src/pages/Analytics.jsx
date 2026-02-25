import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/todos/stats/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="loading-container">
          <div className="cyber-loader" />
          <p>LOADING_ANALYTICS...</p>
        </div>
      </div>
    );
  }

  const { overview, completionRate, byCategory, byPriority, activity } = stats || {};
  
  // Generate last 7 days data
  const generateLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const existing = activity?.find(a => a._id === dateStr);
      days.push({
        date: dateStr,
        display: date.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' }),
        count: existing?.count || 0
      });
    }
    return days;
  };

  const last7Days = generateLast7Days();
  const maxCount = Math.max(...last7Days.map(d => d.count), 1);

  return (
    <div className="analytics-page">
      <header className="page-header">
        <h1 className="glitch" data-text="ANALYTICS_CORE">ANALYTICS_CORE</h1>
        <p>Mission Performance Metrics</p>
      </header>

      <div className="analytics-grid">
        {/* Main Stats Cards */}
        <div className="stat-card large">
          <h3>COMPLETION_RATE</h3>
          <div className="big-number">{completionRate}%</div>
          <div className="cyber-progress">
            <div className="cyber-progress-fill" style={{ width: `${completionRate}%` }} />
          </div>
          <div className="stat-detail">
            <span>{overview?.completed || 0} of {overview?.total || 0} missions completed</span>
          </div>
        </div>

        <div className="stat-card">
          <h3>TOTAL_MISSIONS</h3>
          <div className="big-number">{overview?.total || 0}</div>
          <div className="stat-trend up">↗ +{last7Days[6]?.count || 0} today</div>
        </div>

        <div className="stat-card">
          <h3>ACTIVE</h3>
          <div className="big-number" style={{color: 'var(--neon-yellow)'}}>
            {overview?.pending || 0}
          </div>
          <div className="stat-trend">In progress</div>
        </div>

        <div className="stat-card">
          <h3>COMPLETED</h3>
          <div className="big-number" style={{color: 'var(--neon-green)'}}>
            {overview?.completed || 0}
          </div>
          <div className="stat-trend up">↗ {completionRate}% rate</div>
        </div>

        {/* Category Distribution - Pie Chart Style */}
        <div className="chart-card">
          <h3>CATEGORY_DISTRIBUTION</h3>
          <div className="category-visual">
            <div className="pie-chart">
              {byCategory?.map((cat, i) => {
                const total = byCategory.reduce((sum, c) => sum + c.count, 0);
                const percentage = (cat.count / total) * 100;
                return (
                  <div 
                    key={cat._id}
                    className="pie-segment"
                    style={{
                      '--percentage': percentage,
                      '--color': getCategoryColor(cat._id),
                      '--offset': byCategory.slice(0, i).reduce((sum, c) => sum + (c.count / total) * 100, 0)
                    }}
                    title={`${cat._id}: ${cat.count} (${Math.round(percentage)}%)`}
                  />
                );
              })}
            </div>
            <div className="pie-legend">
              {byCategory?.map(cat => (
                <div key={cat._id} className="legend-item">
                  <span className="legend-color" style={{background: getCategoryColor(cat._id)}} />
                  <span className="legend-label">{cat._id}</span>
                  <span className="legend-value">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Priority Distribution - Bar Chart */}
        <div className="chart-card">
          <h3>PRIORITY_ANALYSIS</h3>
          <div className="priority-bars">
            {['critical', 'high', 'medium', 'low'].map(pri => {
              const data = byPriority?.find(p => p._id === pri);
              const count = data?.count || 0;
              const max = Math.max(...(byPriority?.map(p => p.count) || [1]));
              return (
                <div key={pri} className="priority-bar-item">
                  <div className="bar-header">
                    <span className="pri-name">{pri.toUpperCase()}</span>
                    <span className="pri-count">{count}</span>
                  </div>
                  <div className="bar-track">
                    <div 
                      className="bar-fill"
                      style={{
                        width: `${(count / max) * 100}%`,
                        background: getPriorityColor(pri),
                        boxShadow: `0 0 10px ${getPriorityColor(pri)}`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Chart - Fixed */}
        <div className="chart-card full-width activity-chart-card">
          <h3>ACTIVITY_LAST_7_DAYS</h3>
          <div className="activity-chart">
            {last7Days.map((day, i) => (
              <div key={day.date} className="activity-day">
                <div className="day-bar-container">
                  <div 
                    className="day-bar"
                    style={{ 
                      height: `${(day.count / maxCount) * 100}%`,
                      minHeight: day.count > 0 ? '4px' : '0'
                    }}
                  >
                    {day.count > 0 && (
                      <span className="bar-value">{day.count}</span>
                    )}
                  </div>
                </div>
                <div className="day-info">
                  <span className="day-name">{day.display.split(',')[0]}</span>
                  <span className="day-date">{day.display.split(',')[1]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Productivity Score */}
        <div className="stat-card wide">
          <h3>PRODUCTIVITY_SCORE</h3>
          <div className="score-circle">
            <svg viewBox="0 0 100 100">
              <circle className="score-bg" cx="50" cy="50" r="45" />
              <circle 
                className="score-progress" 
                cx="50" 
                cy="50" 
                r="45"
                style={{
                  strokeDasharray: `${2 * Math.PI * 45}`,
                  strokeDashoffset: `${2 * Math.PI * 45 * (1 - (completionRate / 100))}`
                }}
              />
            </svg>
            <div className="score-text">
              <span className="score-value">{Math.round(completionRate)}</span>
              <span className="score-label">SCORE</span>
            </div>
          </div>
        </div>

        {/* Efficiency Metrics */}
        <div className="chart-card">
          <h3>EFFICIENCY_METRICS</h3>
          <div className="efficiency-grid">
            <div className="eff-item">
              <span className="eff-label">Tasks/Day</span>
              <span className="eff-value">
                {((overview?.total || 0) / 7).toFixed(1)}
              </span>
            </div>
            <div className="eff-item">
              <span className="eff-label">Completion Speed</span>
              <span className="eff-value">Fast</span>
            </div>
            <div className="eff-item">
              <span className="eff-label">High Priority %</span>
              <span className="eff-value">
                {Math.round(((overview?.highPriority || 0) / (overview?.total || 1)) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .analytics-page {
          max-width: 1200px;
          margin: 0 auto;
          animation: fadeIn 0.5s ease;
          padding-bottom: 40px;
        }

        .page-header {
          margin-bottom: 30px;
        }

        .page-header h1 {
          font-family: var(--font-display);
          font-size: 2.2rem;
          color: var(--neon-cyan);
          margin-bottom: 8px;
          letter-spacing: 4px;
        }

        .page-header p {
          color: var(--text-muted);
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .stat-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          padding: 25px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .stat-card.large {
          grid-column: span 2;
        }

        .stat-card.wide {
          grid-column: span 2;
        }

        .stat-card h3 {
          font-family: var(--font-display);
          font-size: 0.8rem;
          color: var(--text-muted);
          letter-spacing: 2px;
          margin-bottom: 15px;
        }

        .big-number {
          font-family: var(--font-display);
          font-size: 3rem;
          font-weight: 700;
          color: var(--neon-cyan);
          text-shadow: 0 0 20px rgba(0, 243, 255, 0.3);
          margin-bottom: 10px;
        }

        .stat-detail {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-top: 10px;
        }

        .stat-trend {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 5px;
        }

        .stat-trend.up {
          color: var(--neon-green);
        }

        .cyber-progress {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          overflow: hidden;
          margin-top: 10px;
        }

        .cyber-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--neon-cyan), var(--neon-pink));
          transition: width 0.5s ease;
          box-shadow: 0 0 10px var(--neon-cyan);
        }

        .chart-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          padding: 25px;
          grid-column: span 2;
        }

        .chart-card.full-width {
          grid-column: span 4;
        }

        .chart-card h3 {
          font-family: var(--font-display);
          font-size: 0.9rem;
          color: var(--neon-cyan);
          letter-spacing: 2px;
          margin-bottom: 25px;
        }

        /* Category Pie Chart */
        .category-visual {
          display: flex;
          align-items: center;
          gap: 30px;
        }

        .pie-chart {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          position: relative;
          background: conic-gradient(
            ${byCategory?.map((cat, i) => {
              const total = byCategory.reduce((sum, c) => sum + c.count, 0);
              const start = byCategory.slice(0, i).reduce((sum, c) => sum + (c.count / total) * 360, 0);
              const end = start + (cat.count / total) * 360;
              return `${getCategoryColor(cat._id)} ${start}deg ${end}deg`;
            }).join(', ') || 'var(--neon-cyan) 0deg 360deg'}
          );
          box-shadow: 0 0 30px rgba(0, 243, 255, 0.2);
        }

        .pie-legend {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
        }

        .legend-color {
          width: 16px;
          height: 16px;
          border-radius: 3px;
        }

        .legend-label {
          flex: 1;
          color: var(--text-secondary);
          text-transform: capitalize;
        }

        .legend-value {
          color: var(--neon-cyan);
          font-family: var(--font-display);
          font-weight: 600;
        }

        /* Priority Bars */
        .priority-bars {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .priority-bar-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .bar-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
        }

        .pri-name {
          color: var(--text-muted);
          font-family: var(--font-display);
        }

        .pri-count {
          color: var(--neon-cyan);
          font-family: var(--font-display);
          font-weight: 600;
        }

        .bar-track {
          height: 12px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          border-radius: 6px;
          transition: width 0.5s ease;
        }

        /* Activity Chart - Fixed */
        .activity-chart-card {
          min-height: 300px;
        }

        .activity-chart {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          height: 200px;
          padding: 20px 0;
          gap: 15px;
        }

        .activity-day {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .day-bar-container {
          width: 100%;
          height: 150px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px 8px 0 0;
          padding: 10px;
          position: relative;
        }

        .day-bar {
          width: 60%;
          min-width: 20px;
          background: linear-gradient(180deg, var(--neon-cyan), var(--neon-purple));
          border-radius: 4px 4px 0 0;
          transition: height 0.5s ease;
          position: relative;
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }

        .bar-value {
          position: absolute;
          top: -20px;
          color: var(--neon-cyan);
          font-family: var(--font-display);
          font-size: 0.9rem;
          font-weight: 600;
        }

        .day-info {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .day-name {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-family: var(--font-display);
        }

        .day-date {
          font-size: 0.7rem;
          color: var(--text-muted);
          opacity: 0.7;
        }

        /* Productivity Score */
        .score-circle {
          width: 150px;
          height: 150px;
          margin: 0 auto;
          position: relative;
        }

        .score-circle svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .score-bg {
          fill: none;
          stroke: rgba(255, 255, 255, 0.1);
          stroke-width: 8;
        }

        .score-progress {
          fill: none;
          stroke: url(#scoreGradient);
          stroke-width: 8;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.5s ease;
        }

        .score-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .score-value {
          display: block;
          font-family: var(--font-display);
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--neon-cyan);
        }

        .score-label {
          font-size: 0.7rem;
          color: var(--text-muted);
          letter-spacing: 2px;
        }

        /* Efficiency Grid */
        .efficiency-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 15px;
        }

        .eff-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: rgba(0, 0, 0, 0.2);
          border-left: 3px solid var(--neon-cyan);
        }

        .eff-label {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .eff-value {
          color: var(--neon-cyan);
          font-family: var(--font-display);
          font-weight: 600;
        }

        @media (max-width: 1024px) {
          .analytics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .stat-card.large,
          .chart-card,
          .chart-card.full-width,
          .stat-card.wide {
            grid-column: span 2;
          }
        }

        @media (max-width: 600px) {
          .analytics-grid {
            grid-template-columns: 1fr;
          }
          .stat-card.large,
          .chart-card,
          .chart-card.full-width,
          .stat-card.wide {
            grid-column: span 1;
          }
          .category-visual {
            flex-direction: column;
          }
          .activity-chart {
            height: 150px;
          }
          .day-bar-container {
            height: 100px;
          }
        }
      `}</style>
      
      <svg width="0" height="0">
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--neon-cyan)" />
            <stop offset="100%" stopColor="var(--neon-pink)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

const getCategoryColor = (cat) => {
  const colors = {
    personal: '#00f3ff',
    work: '#ff00ff',
    urgent: '#ff073a',
    'side-quest': '#39ff14'
  };
  return colors[cat] || '#fff';
};

const getPriorityColor = (pri) => {
  const colors = {
    low: '#39ff14',
    medium: '#fff01f',
    high: '#ff00ff',
    critical: '#ff073a'
  };
  return colors[pri] || '#fff';
};

export default Analytics;