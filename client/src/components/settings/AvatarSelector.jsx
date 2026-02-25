import React, { useState } from 'react';

const AvatarSelector = ({ currentAvatar, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const avatars = [
    { id: 'cyberpunk', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cyberpunk&backgroundColor=b6e3f4', name: 'Cyberpunk' },
    { id: 'neon', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=neon&backgroundColor=c0aede', name: 'Neon' },
    { id: 'hacker', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hacker&backgroundColor=ffdfbf', name: 'Hacker' },
    { id: 'agent', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=agent&backgroundColor=ffdfbf', name: 'Agent' },
    { id: 'ghost', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ghost&backgroundColor=d1d4f9', name: 'Ghost' },
    { id: 'shadow', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shadow&backgroundColor=ffdfbf', name: 'Shadow' },
    { id: 'vortex', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vortex&backgroundColor=c0aede', name: 'Vortex' },
    { id: 'matrix', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=matrix&backgroundColor=b6e3f4', name: 'Matrix' },
    { id: 'nova', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nova&backgroundColor=ffdfbf', name: 'Nova' },
    { id: 'pulse', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pulse&backgroundColor=d1d4f9', name: 'Pulse' },
    { id: 'cipher', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cipher&backgroundColor=c0aede', name: 'Cipher' },
    { id: 'echo', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=echo&backgroundColor=b6e3f4', name: 'Echo' }
  ];

  const handleSelect = (avatar) => {
    onSelect(avatar.url);
    setIsOpen(false);
  };

  return (
    <div className="avatar-selector">
      <button className="change-avatar-btn" onClick={() => setIsOpen(true)}>
        CHANGE_AVATAR
      </button>

      {isOpen && (
        <div className="avatar-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="avatar-modal" onClick={e => e.stopPropagation()}>
            <h3>◈ SELECT_AVATAR</h3>
            <div className="avatar-grid">
              {avatars.map(avatar => (
                <button
                  key={avatar.id}
                  className={`avatar-option ${currentAvatar === avatar.url ? 'selected' : ''}`}
                  onClick={() => handleSelect(avatar)}
                >
                  <img src={avatar.url} alt={avatar.name} />
                  <span>{avatar.name}</span>
                  {currentAvatar === avatar.url && <div className="selected-badge">✓</div>}
                </button>
              ))}
            </div>
            <button className="neon-btn close-btn" onClick={() => setIsOpen(false)}>
              CLOSE
            </button>
          </div>
        </div>
      )}

      <style>{`
        .avatar-selector {
          position: relative;
        }

        .change-avatar-btn {
          padding: 10px 20px;
          background: transparent;
          border: 2px solid var(--neon-cyan);
          color: var(--neon-cyan);
          cursor: pointer;
          font-family: var(--font-display);
          font-size: 0.8rem;
          letter-spacing: 1px;
          transition: all 0.3s;
          width: 100%;
        }

        .change-avatar-btn:hover {
          background: var(--neon-cyan);
          color: var(--bg-primary);
          box-shadow: 0 0 20px var(--neon-cyan);
        }

        .avatar-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s;
          padding: 20px;
        }

        .avatar-modal {
          background: var(--bg-card);
          border: 2px solid var(--neon-cyan);
          padding: 30px;
          max-width: 600px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          animation: slideUp 0.3s;
        }

        .avatar-modal h3 {
          color: var(--neon-cyan);
          font-family: var(--font-display);
          text-align: center;
          margin-bottom: 25px;
          letter-spacing: 2px;
        }

        .avatar-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-bottom: 25px;
        }

        .avatar-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 15px;
          background: rgba(0, 0, 0, 0.3);
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
        }

        .avatar-option:hover {
          border-color: var(--neon-cyan);
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0, 243, 255, 0.2);
        }

        .avatar-option.selected {
          border-color: var(--neon-green);
          background: rgba(57, 255, 20, 0.1);
        }

        .avatar-option img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
        }

        .avatar-option span {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-family: var(--font-display);
          text-align: center;
        }

        .selected-badge {
          position: absolute;
          top: 5px;
          right: 5px;
          width: 20px;
          height: 20px;
          background: var(--neon-green);
          color: var(--bg-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: bold;
        }

        .close-btn {
          width: 100%;
        }

        @media (max-width: 600px) {
          .avatar-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 400px) {
          .avatar-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default AvatarSelector;