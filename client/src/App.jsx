import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { FontProvider } from './context/FontContext';
import { AudioProvider } from './context/AudioContext';
import { ParticleProvider } from './context/ParticleContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ParticleBackground from './components/effects/ParticleBackground';
import ThemeToggle from './components/layout/ThemeToggle';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Auth from './pages/Auth';


// Move Layout here, before App
function Layout() {
  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      <ThemeToggle />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <FontProvider>
        <AudioProvider>
          <ParticleProvider>
            <AuthProvider>
              <Router>
                <div className="app">
                  <ParticleBackground />
                  <div className="cyber-grid" />
                  <div className="scanlines" />
                  <Routes>
                    <Route path="/auth" element={<Auth />} />
                    <Route
                      path="/*"
                      element={
                        <ProtectedRoute>
                          <Layout />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </div>
              </Router>
            </AuthProvider>
          </ParticleProvider>
        </AudioProvider>
      </FontProvider>
    </ThemeProvider>
  );
}

export default App;