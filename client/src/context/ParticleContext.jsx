import React, { createContext, useContext, useEffect, useState } from 'react';

const ParticleContext = createContext();

export const useParticles = () => useContext(ParticleContext);

export const ParticleProvider = ({ children }) => {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const handler = (e) => {
      setEnabled(!!e.detail?.enabled);
    };

    window.addEventListener('toggleParticles', handler);
    return () => window.removeEventListener('toggleParticles', handler);
  }, []);

  return (
    <ParticleContext.Provider value={{ enabled, setEnabled }}>
      {children}
    </ParticleContext.Provider>
  );
};