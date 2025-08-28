
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import HostPage from './pages/HostPage';
import ParticipantPage from './pages/ParticipantPage';
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-900 text-white font-sans">
        <HashRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/host/:sessionCode" element={<HostPage />} />
            <Route path="/participant/:sessionCode" element={<ParticipantPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </HashRouter>
      </div>
    </AuthProvider>
  );
};

export default App;
