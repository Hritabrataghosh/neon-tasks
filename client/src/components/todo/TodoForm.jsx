import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const TodoForm = ({ onTodoAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'personal',
    dueDate: '',
    tags: ''
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!formData.title.trim()) {
      setError('Please enter a mission title');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const todoData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        category: formData.category,
        dueDate: formData.dueDate || undefined,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };
      
      console.log('Creating todo:', todoData);
      const response = await api.post('/todos', todoData);
      console.log('Created:', response.data);
      
      setSuccess(true);
      onTodoAdded(response.data);
      
      // Reset form after short delay to show success
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
          category: 'personal',
          dueDate: '',
          tags: ''
        });
        setIsExpanded(false);
        setSuccess(false);
      }, 1000);
      
    } catch (err) {
      console.error('Error creating todo:', err);
      setError(err.response?.data?.message || 'Failed to create mission');
    }
    
    setLoading(false);
  };

  const priorities = [
    { value: 'low', label: 'LOW', color: '#39ff14', desc: 'Non-urgent' },
    { value: 'medium', label: 'MED', color: '#fff01f', desc: 'Standard' },
    { value: 'high', label: 'HIGH', color: '#ff00ff', desc: 'Important' },
    { value: 'critical', label: 'CRIT', color: '#ff073a', desc: 'Urgent' }
  ];

  const categories = [
    { value: 'personal', label: 'PERSONAL', icon: '👤' },
    { value: 'work', label: 'WORK', icon: '💼' },
    { value: 'urgent', label: 'URGENT', icon: '⚡' },
    { value: 'side-quest', label: 'SIDE_Q', icon: '🎮' }
  ];

  return (
    <div className={`todo-form-container cyber-card ${isExpanded ? 'expanded' : ''} ${success ? 'success' : ''}`}>
      <form onSubmit={handleSubmit} className="todo-form" noValidate>
        <div className="form-header-section">
          <div className="input-main">
            <input
              type="text"
              className="cyber-input title-input"
              placeholder="INITIATE_NEW_MISSION..."
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              onFocus={() => setIsExpanded(true)}
              maxLength={100}
              disabled={loading}
            />
            <span className="char-counter">{formData.title.length}/100</span>
          </div>
          <button 
            type="button" 
            className={`expand-btn ${isExpanded ? 'active' : ''}`}
            onClick={() => setIsExpanded(!isExpanded)}
            disabled={loading}
          >
            <span className="arrow">▼</span>
          </button>
        </div>

        {error && (
          <div className="form-error">
            ⚠ {error}
          </div>
        )}

        {success && (
          <div className="form-success">
            ✓ MISSION DEPLOYED SUCCESSFULLY
          </div>
        )}

        {isExpanded && (
          <div className="form-body">
            <div className="form-section">
              <label className="section-label">◈ MISSION_BRIEFING</label>
              <textarea
                className="cyber-input description-input"
                placeholder="Enter mission details, objectives, and notes..."
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                maxLength={500}
                disabled={loading}
              />
            </div>

            <div className="form-grid">
              <div className="form-section">
                <label className="section-label">⚠ PRIORITY_LEVEL</label>
                <div className="priority-cards">
                  {priorities.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      className={`priority-card ${formData.priority === p.value ? 'active' : ''}`}
                      style={{ '--card-color': p.color }}
                      onClick={() => setFormData({...formData, priority: p.value})}
                      disabled={loading}
                    >
                      <span className="card-label">{p.label}</span>
                      <span className="card-desc">{p.desc}</span>
                      <div className="card-glow" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <label className="section-label">◉ CATEGORY</label>
                <div className="category-grid">
                  {categories.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      className={`category-btn ${formData.category === c.value ? 'active' : ''}`}
                      onClick={() => setFormData({...formData, category: c.value})}
                      disabled={loading}
                    >
                      <span className="cat-icon">{c.icon}</span>
                      <span className="cat-label">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-section half">
                <label className="section-label">⏱ DEADLINE</label>
                <input
                  type="datetime-local"
                  className="cyber-input"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  disabled={loading}
                />
              </div>

              <div className="form-section half">
                <label className="section-label"># TAGS</label>
                <input
                  type="text"
                  className="cyber-input"
                  placeholder="urgent, coding, meeting"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="neon-btn" 
                onClick={() => {
                  setIsExpanded(false);
                  setError('');
                }}
                disabled={loading}
              >
                CANCEL
              </button>
              <button 
                type="submit" 
                className="neon-btn green" 
                disabled={loading || !formData.title.trim()}
              >
                {loading ? (
                  <>
                    <span className="spinner-small" />
                    DEPLOYING...
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    DEPLOY_MISSION
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>

      <style>{`
        .todo-form-container {
          margin-bottom: 25px;
          transition: all 0.3s;
          position: relative;
        }

        .todo-form-container.success {
          border-color: var(--neon-green);
          box-shadow: 0 0 30px rgba(57, 255, 20, 0.3);
        }

        .todo-form-container.expanded {
          box-shadow: 0 20px 60px rgba(0, 243, 255, 0.15);
        }

        .form-header-section {
          display: flex;
          gap: 10px;
          padding: 20px;
          background: rgba(0, 0, 0, 0.2);
          position: relative;
        }

        .input-main {
          flex: 1;
          position: relative;
        }

        .title-input {
          font-size: 1.1rem;
          font-family: var(--font-display);
          padding-right: 60px;
        }

        .char-counter {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          font-family: var(--font-display);
        }

        .expand-btn {
          width: 50px;
          background: transparent;
          border: 1px solid rgba(0, 243, 255, 0.3);
          color: var(--neon-cyan);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }

        .expand-btn:hover:not(:disabled) {
          border-color: var(--neon-cyan);
          background: rgba(0, 243, 255, 0.1);
        }

        .expand-btn.active .arrow {
          transform: rotate(180deg);
        }

        .arrow {
          transition: transform 0.3s;
          font-size: 0.8rem;
        }

        .form-error {
          margin: 0 20px 15px;
          padding: 12px;
          background: rgba(255, 7, 58, 0.1);
          border: 1px solid var(--neon-red);
          color: var(--neon-red);
          font-size: 0.9rem;
          animation: shake 0.5s;
        }

        .form-success {
          margin: 0 20px 15px;
          padding: 12px;
          background: rgba(57, 255, 20, 0.1);
          border: 1px solid var(--neon-green);
          color: var(--neon-green);
          font-size: 0.9rem;
          animation: fadeIn 0.3s;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .form-body {
          padding: 0 20px 20px;
          animation: slideDown 0.4s ease;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .form-section {
          margin-bottom: 20px;
        }

        .section-label {
          display: block;
          color: var(--neon-cyan);
          font-family: var(--font-display);
          font-size: 0.75rem;
          letter-spacing: 2px;
          margin-bottom: 10px;
        }

        .description-input {
          resize: vertical;
          min-height: 80px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .priority-cards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .priority-card {
          position: relative;
          padding: 12px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 3px;
          transition: all 0.3s;
          overflow: hidden;
          text-align: left;
        }

        .priority-card:hover:not(:disabled) {
          border-color: var(--card-color);
          transform: translateY(-2px);
        }

        .priority-card.active {
          border-color: var(--card-color);
          background: rgba(255, 255, 255, 0.05);
        }

        .priority-card.active .card-glow {
          opacity: 1;
        }

        .card-label {
          font-family: var(--font-display);
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--card-color);
          z-index: 1;
        }

        .card-desc {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.5);
          z-index: 1;
        }

        .card-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at center, var(--card-color) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .category-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: all 0.3s;
          font-family: var(--font-display);
          font-size: 0.8rem;
        }

        .category-btn:hover:not(:disabled) {
          border-color: var(--neon-cyan);
          color: var(--neon-cyan);
          transform: translateX(3px);
        }

        .category-btn.active {
          border-color: var(--neon-cyan);
          background: rgba(0, 243, 255, 0.1);
          color: var(--neon-cyan);
        }

        .cat-icon {
          font-size: 1.1rem;
        }

        .form-row {
          display: flex;
          gap: 15px;
        }

        .form-row .form-section.half {
          flex: 1;
          margin-bottom: 0;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid rgba(0, 243, 255, 0.1);
        }

        .form-actions .neon-btn {
          padding: 10px 24px;
          font-size: 0.8rem;
        }

        .spinner-small {
          width: 14px;
          height: 14px;
          border: 2px solid transparent;
          border-top-color: currentColor;
          border-radius: 50%;
          animation: rotate 1s linear infinite;
          display: inline-block;
          margin-right: 8px;
        }

        @media (max-width: 768px) {
          .form-grid,
          .form-row {
            grid-template-columns: 1fr;
            flex-direction: column;
          }
          
          .priority-cards,
          .category-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default TodoForm;