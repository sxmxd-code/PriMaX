import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

// Landing page
import LandingApp from './LandingApp';

// Auth pages
import Login from './pages/Login';
import Signup from './pages/Signup';

// App shell
import AppLayout from './components/app/AppLayout';

// App pages
import CommandCenter from './pages/app/CommandCenter';
import Productivity from './pages/app/Productivity';
import Career from './pages/app/Career';
import Finance from './pages/app/Finance';
import Fitness from './pages/app/Fitness';
import MentalGrowth from './pages/app/MentalGrowth';
import Analytics from './pages/app/Analytics';
import AIAssistant from './pages/app/AIAssistant';
import Settings from './pages/app/Settings';
import Onboarding from './pages/app/Onboarding';

import './index.css';
import './app.css';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public landing page */}
            <Route path="/" element={<LandingApp />} />

            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Onboarding — protected but outside AppLayout */}
            <Route path="/app/onboarding" element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            } />

            {/* Protected app routes */}
            <Route path="/app" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<CommandCenter />} />
              <Route path="productivity" element={<Productivity />} />
              <Route path="career" element={<Career />} />
              <Route path="finance" element={<Finance />} />
              <Route path="fitness" element={<Fitness />} />
              <Route path="mental" element={<MentalGrowth />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="ai" element={<AIAssistant />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
