import React, { useState, useEffect } from 'react';
import TodoList from '../components/todo/TodoList';
import StatsPanel from '../components/todo/StatsPanel';
import QuickActions from '../components/todo/QuickActions';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('all');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/todos/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
    setLoading(false);
  };

  const refreshStats = () => {
    fetchStats();
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="title-section">
            <h1 className="glitch" data-text="MISSION_CONTROL">MISSION_CONTROL</h1>
            <div className="breadcrumb">
              <span className="bc-item">HOME</span>
              <span className="bc-separator">/</span>
              <span className="bc-item active">DASHBOARD</span>
            </div>
          </div>
          <div className="header-stats">
            <div className="mini-stat">
              <span className="mini-label">SYSTEM_TIME</span>
              <span className="mini-value" id="clock">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
            <div className="mini-stat">
              <span className="mini-label">UPTIME</span>
              <span className="mini-value">99.9%</span>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-grid">
        <aside className="dashboard-sidebar">
          <StatsPanel stats={stats} loading={loading} />
          <QuickActions onAction={refreshStats} />
        </aside>

        <main className="dashboard-main">
          <div className="view-tabs">
            {[
              { id: 'all', label: 'ALL_TASKS', icon: '◈' },
              { id: 'active', label: 'ACTIVE', icon: '◉' },
              { id: 'completed', label: 'COMPLETED', icon: '✓' },
              { id: 'priority', label: 'HIGH_PRIORITY', icon: '⚠' }
            ].map(tab => (
              <button
                key={tab.id}
                className={`view-tab ${activeView === tab.id ? 'active' : ''}`}
                onClick={() => setActiveView(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
          
          <TodoList filter={activeView} onUpdate={refreshStats} />
        </main>
      </div>

      <style>{`
        .dashboard {
          max-width: 1400px;
          margin: 0 auto;
          animation: fadeIn 0.5s ease-out;
        }

        .dashboard-header {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(0, 243, 255, 0.2);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 20px;
        }

        .title-section h1 {
          font-family: var(--font-display);
          font-size: 2.2rem;
          color: var(--neon-cyan);
          text-shadow: 0 0 30px rgba(0, 243, 255, 0.5);
          margin-bottom: 10px;
          letter-spacing: 4px;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-display);
          font-size: 0.75rem;
        }

        .bc-item {
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 2px;
        }

        .bc-item.active {
          color: var(--neon-pink);
        }

        .bc-separator {
          color: rgba(255, 255, 255, 0.2);
        }

        .header-stats {
          display: flex;
          gap: 30px;
        }

        .mini-stat {
          text-align: right;
        }

        .mini-label {
          display: block;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.4);
          font-family: var(--font-display);
          letter-spacing: 1px;
          margin-bottom: 5px;
        }

        .mini-value {
          font-family: var(--font-display);
          font-size: 1.1rem;
          color: var(--neon-cyan);
          text-shadow: 0 0 10px rgba(0, 243, 255, 0.3);
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 30px;
        }

        .dashboard-sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .view-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 25px;
          flex-wrap: wrap;
        }

        .view-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          font-family: var(--font-display);
          font-size: 0.8rem;
          letter-spacing: 1px;
          transition: all 0.3s;
          clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
        }

        .view-tab:hover {
          border-color: var(--neon-cyan);
          color: var(--neon-cyan);
          background: rgba(0, 243, 255, 0.05);
        }

        .view-tab.active {
          background: rgba(0, 243, 255, 0.1);
          border-color: var(--neon-cyan);
          color: var(--neon-cyan);
          box-shadow: 0 0 20px rgba(0, 243, 255, 0.2);
        }

        .tab-icon {
          font-size: 1rem;
        }

        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          .dashboard-sidebar {
            order: 2;
          }
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            align-items: flex-start;
          }
          .title-section h1 {
            font-size: 1.5rem;
          }
          .view-tabs {
            overflow-x: auto;
            padding-bottom: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;