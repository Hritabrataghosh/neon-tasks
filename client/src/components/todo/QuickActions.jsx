import React, { useState } from 'react';
import api from '../../services/api';

const QuickActions = ({ onAction }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClearCompleted = async () => {
    try {
      await api.delete('/todos/bulk/completed');
      setShowConfirm(false);
      onAction();
    } catch (error) {
      console.error('Error clearing completed:', error);
    }
  };

  const scrollToNewTask = () => {
    const form = document.querySelector('.todo-form-container');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        const input = form.querySelector('.title-input');
        if (input) input.focus();
      }, 500);
    }
  };

  const actions = [
    { 
      id: 'add', 
      label: 'NEW_TASK', 
      icon: '+', 
      color: 'cyan',
      onClick: scrollToNewTask
    },
    { 
      id: 'clear', 
      label: 'CLEAR_DONE', 
      icon: '🗑', 
      color: 'red',
      onClick: () => setShowConfirm(true)
    },
    { 
      id: 'export', 
      label: 'EXPORT_DATA', 
      icon: '↓', 
      color: 'green',
      onClick: () => {
        // Trigger export from parent
        const event = new CustomEvent('exportData');
        window.dispatchEvent(event);
      }
    },
    { 
      id: 'refresh', 
      label: 'REFRESH', 
      icon: '↻', 
      color: 'pink',
      onClick: onAction
    }
  ];

  return (
    <div className="quick-actions cyber-card">
      <h3>◈ QUICK_ACTIONS</h3>
      
      <div className="actions-container">
        {actions.map(action => (
          <button
            key={action.id}
            className={`action-btn ${action.color}`}
            onClick={action.onClick}
          >
            <div className="action-icon-wrapper">
              <span className="action-icon">{action.icon}</span>
            </div>
            <span className="action-label">{action.label}</span>
          </button>
        ))}
      </div>

      {showConfirm && (
        <div className="confirm-overlay" onClick={() => setShowConfirm(false)}>
          <div className="confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="confirm-icon">⚠</div>
            <h4>CONFIRM_ACTION</h4>
            <p>Delete all completed tasks permanently?</p>
            <div className="confirm-buttons">
              <button className="neon-btn red" onClick={handleClearCompleted}>
                CONFIRM_DELETE
              </button>
              <button className="neon-btn" onClick={() => setShowConfirm(false)}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .quick-actions {
          padding: 25px;
          height: fit-content;
        }

        .quick-actions h3 {
          font-family: var(--font-display);
          font-size: 0.9rem;
          color: var(--neon-cyan);
          margin-bottom: 25px;
          letter-spacing: 2px;
          text-align: center;
        }

        .actions-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 25px 15px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: all 0.3s;
          font-family: var(--font-display);
          min-height: 100px;
        }

        .action-btn:hover {
          transform: translateY(-5px);
          border-color: var(--neon-cyan);
          color: var(--neon-cyan);
          box-shadow: 0 15px 30px rgba(0, 243, 255, 0.2);
        }

        .action-btn.cyan:hover {
          border-color: var(--neon-cyan);
          color: var(--neon-cyan);
          box-shadow: 0 15px 30px rgba(0, 243, 255, 0.2);
        }

        .action-btn.red:hover {
          border-color: var(--neon-red);
          color: var(--neon-red);
          box-shadow: 0 15px 30px rgba(255, 7, 58, 0.2);
        }

        .action-btn.green:hover {
          border-color: var(--neon-green);
          color: var(--neon-green);
          box-shadow: 0 15px 30px rgba(57, 255, 20, 0.2);
        }

        .action-btn.pink:hover {
          border-color: var(--neon-pink);
          color: var(--neon-pink);
          box-shadow: 0 15px 30px rgba(255, 0, 255, 0.2);
        }

        .action-icon-wrapper {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid currentColor;
          border-radius: 50%;
          transition: all 0.3s;
        }

        .action-btn:hover .action-icon-wrapper {
          transform: scale(1.1);
          box-shadow: 0 0 20px currentColor;
        }

        .action-icon {
          font-size: 1.5rem;
        }

        .action-label {
          font-size: 0.75rem;
          letter-spacing: 1px;
          text-align: center;
        }

        .confirm-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s;
        }

        .confirm-modal {
          background: var(--bg-card);
          border: 2px solid var(--neon-red);
          padding: 40px;
          text-align: center;
          max-width: 400px;
          animation: slideUp 0.3s;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .confirm-icon {
          font-size: 3rem;
          margin-bottom: 15px;
        }

        .confirm-modal h4 {
          color: var(--neon-red);
          font-family: var(--font-display);
          margin-bottom: 10px;
          letter-spacing: 2px;
        }

        .confirm-modal p {
          color: var(--text-muted);
          margin-bottom: 25px;
        }

        .confirm-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .confirm-buttons .neon-btn {
          flex: 1;
          padding: 12px;
          font-size: 0.85rem;
        }

        @media (max-width: 768px) {
          .actions-container {
            grid-template-columns: 1fr 1fr;
          }
          
          .action-btn {
            min-height: 80px;
            padding: 20px 10px;
          }
          
          .action-icon-wrapper {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </div>
  );
};

export default QuickActions;