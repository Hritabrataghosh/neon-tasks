import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';

const TodoList = ({ filter = 'all', onUpdate }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('status', filter);
      if (searchTerm) params.append('search', searchTerm);
      params.append('sort', sortBy);
      
      const response = await api.get(`/todos?${params}`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
    setLoading(false);
  }, [filter, searchTerm, sortBy]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleTodoAdded = (newTodo) => {
    setTodos(prev => [newTodo, ...prev]);
    onUpdate?.();
  };

  const handleTodoUpdate = (updatedTodo) => {
    setTodos(prev => prev.map(t => t._id === updatedTodo._id ? updatedTodo : t));
    onUpdate?.();
  };

  const handleTodoDelete = (id) => {
    setTodos(prev => prev.filter(t => t._id !== id));
    onUpdate?.();
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const getEmptyMessage = () => {
    const messages = {
      all: { icon: '◉', title: 'NO_TASKS_FOUND', desc: 'Initialize a new mission to begin your operation' },
      active: { icon: '✓', title: 'ALL_TASKS_COMPLETE', desc: 'Outstanding work, operative. All missions accomplished.' },
      completed: { icon: '◈', title: 'NO_COMPLETED_TASKS', desc: 'No archived missions found in database.' },
      priority: { icon: '⚠', title: 'NO_HIGH_PRIORITY', desc: 'No critical missions pending. System optimal.' }
    };
    return messages[filter] || messages.all;
  };

  if (loading && todos.length === 0) {
    return (
      <div className="loading-state">
        <div className="cyber-loader" />
        <p>LOADING_MISSION_DATA...</p>
        <div className="loading-bar">
          <div className="loading-progress" />
        </div>
      </div>
    );
  }

  const empty = getEmptyMessage();

  return (
    <div className="todo-list">
      <div className="list-controls">
        <div className="search-section">
          <div className="search-box">
            <span className="search-icon">⌕</span>
            <input
              type="text"
              className="cyber-input"
              placeholder="SEARCH_DATABASE..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search" onClick={clearSearch}>✕</button>
            )}
          </div>
          
          <div className="control-group">
            <select 
              className="cyber-input cyber-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">NEWEST_FIRST</option>
              <option value="oldest">OLDEST_FIRST</option>
              <option value="priority">PRIORITY</option>
              <option value="dueDate">DEADLINE</option>
            </select>

            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                ☰
              </button>
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                ⊞
              </button>
            </div>
          </div>
        </div>

        <div className="results-info">
          <span className="result-count">{todos.length} MISSIONS_FOUND</span>
          {filter !== 'all' && (
            <span className="filter-badge">{filter.toUpperCase()}_VIEW</span>
          )}
        </div>
      </div>

      <TodoForm onTodoAdded={handleTodoAdded} />

      <div className={`todos-container ${viewMode}`}>
        {todos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon float">{empty.icon}</div>
            <h3>{empty.title}</h3>
            <p>{empty.desc}</p>
            {filter !== 'all' && (
              <button className="neon-btn" onClick={() => window.location.reload()}>
                VIEW_ALL_TASKS
              </button>
            )}
          </div>
        ) : (
          todos.map((todo, index) => (
            <TodoItem 
              key={todo._id} 
              todo={todo} 
              onUpdate={handleTodoUpdate}
              onDelete={handleTodoDelete}
              style={{ animationDelay: `${index * 0.05}s` }}
            />
          ))
        )}
      </div>

      {todos.length > 0 && (
        <div className="list-footer">
          <span>Showing {todos.length} missions</span>
          <button className="scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            ↑ BACK_TO_TOP
          </button>
        </div>
      )}

      <style>{`
        .todo-list {
          animation: fadeIn 0.5s ease;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          gap: 20px;
        }

        .loading-state p {
          font-family: var(--font-display);
          color: var(--neon-cyan);
          letter-spacing: 2px;
        }

        .loading-bar {
          width: 200px;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          overflow: hidden;
          border-radius: 2px;
        }

        .loading-progress {
          height: 100%;
          width: 30%;
          background: var(--neon-cyan);
          animation: loading 1s ease-in-out infinite;
          box-shadow: 0 0 10px var(--neon-cyan);
        }

        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }

        .list-controls {
          margin-bottom: 25px;
        }

        .search-section {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          position: relative;
          min-width: 250px;
        }

        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--neon-cyan);
          font-size: 1.2rem;
        }

        .search-box input {
          padding-left: 45px;
          padding-right: 40px;
        }

        .clear-search {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          font-size: 1rem;
          transition: color 0.3s;
        }

        .clear-search:hover {
          color: var(--neon-red);
        }

        .control-group {
          display: flex;
          gap: 10px;
        }

        .view-toggle {
          display: flex;
          border: 1px solid rgba(0, 243, 255, 0.3);
        }

        .view-btn {
          width: 40px;
          height: 46px;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          font-size: 1.2rem;
          transition: all 0.3s;
        }

        .view-btn.active {
          background: rgba(0, 243, 255, 0.1);
          color: var(--neon-cyan);
        }

        .view-btn:hover:not(.active) {
          color: rgba(255, 255, 255, 0.8);
        }

        .results-info {
          display: flex;
          gap: 15px;
          align-items: center;
          font-family: var(--font-display);
          font-size: 0.8rem;
        }

        .result-count {
          color: rgba(255, 255, 255, 0.6);
          letter-spacing: 1px;
        }

        .filter-badge {
          padding: 4px 12px;
          background: rgba(0, 243, 255, 0.1);
          border: 1px solid var(--neon-cyan);
          color: var(--neon-cyan);
          font-size: 0.7rem;
        }

        .todos-container {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .todos-container.grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 15px;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: var(--card-bg);
          border: 2px dashed rgba(0, 243, 255, 0.2);
          border-radius: 10px;
        }

        .empty-icon {
          font-size: 5rem;
          color: var(--neon-cyan);
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .empty-state h3 {
          font-family: var(--font-display);
          color: var(--neon-cyan);
          font-size: 1.5rem;
          margin-bottom: 10px;
          letter-spacing: 3px;
        }

        .empty-state p {
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 25px;
        }

        .list-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid rgba(0, 243, 255, 0.1);
          font-family: var(--font-display);
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
        }

        .scroll-top {
          background: none;
          border: none;
          color: var(--neon-cyan);
          cursor: pointer;
          font-family: var(--font-display);
          font-size: 0.8rem;
          letter-spacing: 1px;
          transition: all 0.3s;
        }

        .scroll-top:hover {
          text-shadow: 0 0 10px var(--neon-cyan);
        }

        @media (max-width: 768px) {
          .search-section {
            flex-direction: column;
          }
          
          .search-box {
            min-width: 100%;
          }
          
          .todos-container.grid {
            grid-template-columns: 1fr;
          }
        }
          // Add this function to properly refresh after new task
const handleTodoAdded = (newTodo) => {
  console.log('New todo added:', newTodo);
  setTodos(prev => [newTodo, ...prev]);
  setTimeout(() => fetchTodos(), 100); // Refresh to ensure sync
  onUpdate?.();
};
      `}</style>
    </div>
  );
};

export default TodoList;