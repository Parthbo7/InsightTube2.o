import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Dashboard from './pages/Dashboard';
import ConnectionStatus from './components/ConnectionStatus';
import { AuthProvider } from './context/AuthContext';
import AuthModal from './components/AuthModal';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import Videos from './pages/Videos';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster 
          position="bottom-right"
          containerStyle={{ zIndex: 9999 }}
          toastOptions={{
            style: {
              borderRadius: '12px',
              background: '#1A1A24',
              color: '#fff',
              fontSize: '14px',
              border: '1px solid rgba(255,255,255,0.1)',
            },
          }}
        />
        <AuthModal />
        <ConnectionStatus />
        <Routes>
          {/* Redirect authentication routes straight to dashboard for MVP guest mode */}
          <Route path="/login" element={<Navigate to="/dashboard" replace />} />
          <Route path="/signup" element={<Navigate to="/dashboard" replace />} />
          
          {/* Landing Page Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="features" element={<Features />} />
            <Route path="pricing" element={<Pricing />} />
          </Route>

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="videos" element={<Videos />} />
          </Route>

          {/* Standalone Pages */}
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
