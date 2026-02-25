import React, { useState } from 'react';
import api from '../../services/api';

const TodoItem = ({ todo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...todo });
  const [showDetails, setShowDetails] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleToggleComplete = async () => {
    try {
      const response = await api.patch(`/todos/${todo._id}/toggle`);
      onUpdate(response.data);
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setTimeout(async () => {
      try {
        await api.delete(`/todos/${todo._id}`);
        onDelete(todo._id);
      } catch (error) {
        console.error('Error deleting todo:', error);
        setDeleting(false);
      }
    }, 300);
  };

  const handleSave = async () => {
    try {
      const updateData = {
        title: editData.title,
        description: editData.description,
        priority: editData.priority,
        category: editData.category,
        dueDate: editData.dueDate,
        tags: typeof editData.tags === 'string' 
          ? editData.tags.split(',').map(t => t.trim()).filter(Boolean)
          : editData.tags
      };
      
      const response = await api.put(`/todos/${todo._id}`, updateData);
      onUpdate(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating todo:', error);
      alert('Failed to update mission');
    }
  };

  const handleCancel = () => {
    setEditData({ ...todo });
    setIsEditing(false);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#39ff14',
      medium: '#fff01f',
      high: '#ff00ff',
      critical: '#ff073a'
    };
    return colors[priority] || '#fff';
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      low: '●',
      medium: '◐',
      high: '◉',
      critical: '◈'
    };
    return icons[priority] || '○';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      personal: '👤',
      work: '💼',
      urgent: '⚡',
      'side-quest': '🎮'
    };
    return icons[category] || '📋';
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diff = date - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return 'OVERDUE';
    if (days === 0) return 'TODAY';
    if (days === 1) return 'TOMORROW';
    return `${days}D_LEFT`;
  };

  const isOverdue = (dateString) => {
    if (!dateString || todo.completed) return false;
    return new Date(dateString) < new Date();
  };

  const timeLeft = formatDate(todo.dueDate);

  const priorities = [
    { value: 'low', label: 'LOW', color: '#39ff14' },
    { value: 'medium', label: 'MED', color: '#fff01f' },
    { value: 'high', label: 'HIGH', color: '#ff00ff' },
    { value: 'critical', label: 'CRIT', color: '#ff073a' }
  ];

  const categories = [
    { value: 'personal', label: 'PERSONAL', icon: '👤' },
    { value: 'work', label: 'WORK', icon: '💼' },
    { value: 'urgent', label: 'URGENT', icon: '⚡' },
    { value: 'side-quest', label: 'SIDE_Q', icon: '🎮' }
  ];

  // EDIT MODE
  if (isEditing) {
    return (
      <div className="todo-item editing">
        <div className="edit-form">
          <div className="edit-header">
            <h4>✎ EDIT_MISSION</h4>
            <button className="close-edit" onClick={handleCancel}>✕</button>
          </div>
          
          <div className="edit-field">
            <label>TITLE</label>
            <input
              type="text"
              className="cyber-input"
              value={editData.title}
              onChange={(e) => setEditData({...editData, title: e.target.value})}
              maxLength={100}
            />
          </div>

          <div className="edit-field">
            <label>DESCRIPTION</label>
            <textarea
              className="cyber-input"
              rows="3"
              value={editData.description || ''}
              onChange={(e) => setEditData({...editData, description: e.target.value})}
              maxLength={500}
            />
          </div>

          <div className="edit-row">
            <div className="edit-field half">
              <label>PRIORITY</label>
              <div className="edit-options">
                {priorities.map(p => (
                  <button
                    key={p.value}
                    type="button"
                    className={`edit-option ${editData.priority === p.value ? 'active' : ''}`}
                    style={{ '--opt-color': p.color }}
                    onClick={() => setEditData({...editData, priority: p.value})}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="edit-field half">
              <label>CATEGORY</label>
              <div className="edit-options">
                {categories.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    className={`edit-option ${editData.category === c.value ? 'active' : ''}`}
                    onClick={() => setEditData({...editData, category: c.value})}
                  >
                    <span>{c.icon}</span>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="edit-row">
            <div className="edit-field half">
              <label>DEADLINE</label>
              <input
                type="datetime-local"
                className="cyber-input"
                value={editData.dueDate ? new Date(editData.dueDate).toISOString().slice(0, 16) : ''}
                onChange={(e) => setEditData({...editData, dueDate: e.target.value})}
              />
            </div>

            <div className="edit-field half">
              <label>TAGS (comma separated)</label>
              <input
                type="text"
                className="cyber-input"
                value={Array.isArray(editData.tags) ? editData.tags.join(', ') : editData.tags}
                onChange={(e) => setEditData({...editData, tags: e.target.value})}
                placeholder="urgent, coding, meeting"
              />
            </div>
          </div>

          <div className="edit-actions">
            <button className="neon-btn" onClick={handleCancel}>
              CANCEL
            </button>
            <button className="neon-btn green" onClick={handleSave}>
              💾 SAVE_CHANGES
            </button>
          </div>
        </div>

        <style>{`
          .todo-item.editing {
            background: var(--bg-card);
            border: 2px solid var(--neon-cyan);
            box-shadow: 0 0 30px rgba(0, 243, 255, 0.2);
          }

          .edit-form {
            padding: 20px;
          }

          .edit-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid var(--border-color);
          }

          .edit-header h4 {
            color: var(--neon-cyan);
            font-family: var(--font-display);
            margin: 0;
            letter-spacing: 2px;
          }

          .close-edit {
            background: none;
            border: none;
            color: var(--neon-red);
            font-size: 1.2rem;
            cursor: pointer;
            padding: 5px;
          }

          .edit-field {
            margin-bottom: 20px;
          }

          .edit-field label {
            display: block;
            color: var(--neon-cyan);
            font-family: var(--font-display);
            font-size: 0.75rem;
            letter-spacing: 1px;
            margin-bottom: 8px;
          }

          .edit-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }

          .edit-options {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }

          .edit-option {
            padding: 10px;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.7);
            cursor: pointer;
            font-family: var(--font-display);
            font-size: 0.8rem;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
          }

          .edit-option:hover {
            border-color: var(--neon-cyan);
            color: var(--neon-cyan);
          }

          .edit-option.active {
            border-color: var(--opt-color, var(--neon-cyan));
            background: rgba(255, 255, 255, 0.05);
            color: var(--opt-color, var(--neon-cyan));
            box-shadow: 0 0 15px var(--opt-color, var(--neon-cyan));
          }

          .edit-actions {
            display: flex;
            justify-content: flex-end;
            gap: 15px;
            margin-top: 25px;
            padding-top: 20px;
            border-top: 1px solid var(--border-color);
          }

          @media (max-width: 600px) {
            .edit-row {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    );
  }

  // VIEW MODE (Normal display)
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${isOverdue(todo.dueDate) ? 'overdue' : ''} ${deleting ? 'deleting' : ''}`}>
      <div className="todo-glow" style={{ 
        background: `linear-gradient(90deg, ${getPriorityColor(todo.priority)}20, transparent)` 
      }} />
      
      <div className="todo-main">
        <div className="todo-left">
          <button 
            className={`complete-btn ${todo.completed ? 'checked' : ''}`}
            onClick={handleToggleComplete}
            title={todo.completed ? 'Mark incomplete' : 'Mark complete'}
          >
            {todo.completed ? '✓' : ''}
          </button>
          
          <div 
            className="priority-indicator" 
            style={{ background: getPriorityColor(todo.priority) }}
          />
        </div>

        <div className="todo-content" onClick={() => setShowDetails(!showDetails)}>
          <h3 className="todo-title">
            <span className="priority-icon" style={{ color: getPriorityColor(todo.priority) }}>
              {getPriorityIcon(todo.priority)}
            </span>
            {todo.title}
          </h3>
          
          <div className="todo-meta">
            <span className="meta-item category">
              <span className="meta-icon">{getCategoryIcon(todo.category)}</span>
              <span className="meta-text">{todo.category}</span>
            </span>
            
            <span className="meta-item priority" style={{ color: getPriorityColor(todo.priority) }}>
              <span className="meta-text">{todo.priority.toUpperCase()}</span>
            </span>
            
            {todo.dueDate && (
              <span className={`meta-item due ${isOverdue(todo.dueDate) ? 'overdue' : ''}`}>
                <span className="meta-icon">⏱</span>
                <span className="meta-text">{timeLeft}</span>
              </span>
            )}
            
            {todo.tags?.length > 0 && (
              <span className="meta-item tags">
                <span className="meta-icon">#</span>
                <span className="meta-text">{todo.tags.length}</span>
              </span>
            )}
          </div>
        </div>

        <div className="todo-actions">
          <button 
            className="action-btn edit"
            onClick={() => setIsEditing(true)}
            title="Edit mission"
          >
            ✎
          </button>
          <button 
            className="action-btn delete"
            onClick={handleDelete}
            title="Delete mission"
          >
            🗑
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="todo-details">
          {todo.description && (
            <div className="detail-section">
              <label>DESCRIPTION</label>
              <p>{todo.description}</p>
            </div>
          )}
          
          {todo.tags?.length > 0 && (
            <div className="detail-section">
              <label>TAGS</label>
              <div className="detail-tags">
                {todo.tags.map((tag, idx) => (
                  <span key={idx} className="cyber-tag">#{tag}</span>
                ))}
              </div>
            </div>
          )}
          
          <div className="detail-footer">
            <span>Created: {new Date(todo.createdAt).toLocaleString()}</span>
            <span>ID: {todo._id?.slice(-6).toUpperCase()}</span>
          </div>
        </div>
      )}

      <style>{`
        .todo-item {
          position: relative;
          background: var(--bg-card);
          border: 1px solid rgba(0, 243, 255, 0.15);
          border-radius: 8px;
          margin-bottom: 15px;
          overflow: hidden;
          transition: all 0.3s;
          animation: slideIn 0.4s ease-out;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .todo-item:hover {
          border-color: rgba(0, 243, 255, 0.4);
          transform: translateX(5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .todo-item.completed {
          opacity: 0.7;
          border-color: var(--neon-green);
        }

        .todo-item.completed .todo-title {
          text-decoration: line-through;
          color: var(--neon-green);
        }

        .todo-item.overdue {
          border-color: var(--neon-red);
          animation: pulse-border 2s infinite;
        }

        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 5px rgba(255, 7, 58, 0.2); }
          50% { box-shadow: 0 0 20px rgba(255, 7, 58, 0.4); }
        }

        .todo-item.deleting {
          animation: deleteAnim 0.3s ease forwards;
        }

        @keyframes deleteAnim {
          to { 
            opacity: 0; 
            transform: translateX(100px) scale(0.9); 
          }
        }

        .todo-glow {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .todo-item:hover .todo-glow {
          opacity: 1;
        }

        .todo-main {
          display: flex;
          align-items: center;
          padding: 20px;
          gap: 15px;
          position: relative;
          z-index: 1;
        }

        .todo-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .complete-btn {
          width: 28px;
          height: 28px;
          border: 2px solid var(--neon-cyan);
          background: transparent;
          color: var(--neon-cyan);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          transition: all 0.3s;
        }

        .complete-btn.checked {
          background: var(--neon-cyan);
          color: var(--bg-primary);
          box-shadow: 0 0 15px var(--neon-cyan);
        }

        .complete-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 0 10px var(--neon-cyan);
        }

        .priority-indicator {
          width: 3px;
          height: 40px;
          border-radius: 2px;
          box-shadow: 0 0 10px currentColor;
        }

        .todo-content {
          flex: 1;
          cursor: pointer;
          min-width: 0;
        }

        .todo-title {
          font-family: var(--font-display);
          font-size: 1rem;
          color: #fff;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .priority-icon {
          font-size: 0.8rem;
        }

        .todo-meta {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.75rem;
          font-family: var(--font-display);
          transition: all 0.3s;
        }

        .meta-item:hover {
          border-color: currentColor;
        }

        .meta-icon {
          opacity: 0.8;
        }

        .meta-text {
          letter-spacing: 1px;
        }

        .meta-item.due.overdue {
          border-color: var(--neon-red);
          color: var(--neon-red);
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .todo-actions {
          display: flex;
          gap: 8px;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .todo-item:hover .todo-actions {
          opacity: 1;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: transparent;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          transition: all 0.3s;
        }

        .action-btn:hover {
          transform: scale(1.1);
        }

        .action-btn.edit:hover {
          border-color: var(--neon-cyan);
          color: var(--neon-cyan);
          box-shadow: 0 0 15px rgba(0, 243, 255, 0.3);
        }

        .action-btn.delete:hover {
          border-color: var(--neon-red);
          color: var(--neon-red);
          box-shadow: 0 0 15px rgba(255, 7, 58, 0.3);
        }

        .todo-details {
          padding: 0 20px 20px 70px;
          border-top: 1px solid rgba(0, 243, 255, 0.1);
          animation: expandDown 0.3s ease;
        }

        @keyframes expandDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .detail-section {
          margin: 15px 0;
        }

        .detail-section label {
          display: block;
          font-family: var(--font-display);
          font-size: 0.7rem;
          color: var(--neon-cyan);
          letter-spacing: 2px;
          margin-bottom: 8px;
        }

        .detail-section p {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          font-size: 0.9rem;
        }

        .detail-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .cyber-tag {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          background: rgba(188, 19, 254, 0.1);
          border: 1px solid var(--neon-purple);
          color: var(--neon-purple);
          font-size: 0.75rem;
          font-family: var(--font-display);
        }

        .detail-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          font-family: var(--font-display);
        }

        @media (max-width: 768px) {
          .todo-actions {
            opacity: 1;
          }
          
          .todo-meta {
            gap: 8px;
          }
          
          .meta-item {
            padding: 3px 8px;
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
};

export default TodoItem;