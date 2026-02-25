import React, { createContext, useState, useContext, useEffect } from 'react';

const FontContext = createContext();

export const FontProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('fontSize');
    return saved || 'medium';
  });

  const fontSizes = {
    small: '14px',
    medium: '16px',
    large: '18px',
    'x-large': '20px'
  };

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
    document.documentElement.style.fontSize = fontSizes[fontSize];
    console.log('Font size changed to:', fontSize, fontSizes[fontSize]);
  }, [fontSize]);

  const increaseFont = () => {
    const sizes = ['small', 'medium', 'large', 'x-large'];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex < sizes.length - 1) {
      setFontSize(sizes[currentIndex + 1]);
    }
  };

  const decreaseFont = () => {
    const sizes = ['small', 'medium', 'large', 'x-large'];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex > 0) {
      setFontSize(sizes[currentIndex - 1]);
    }
  };

  return (
    <FontContext.Provider value={{ 
      fontSize, 
      setFontSize, 
      increaseFont, 
      decreaseFont, 
      fontSizes 
    }}>
      {children}
    </FontContext.Provider>
  );
};

export const useFont = () => {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error('useFont must be used within FontProvider');
  }
  return context;
};