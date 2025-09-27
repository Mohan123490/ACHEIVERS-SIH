import React, { useState } from 'react';

// Import screens
import LandingPage from './components/LandingPage';
import RoleSelection from './components/RoleSelection';
import LoginForm from './components/LoginForm';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import WorkerDashboard from './components/WorkerDashboard';

type AppState = 'landing' | 'role-selection' | 'login' | 'dashboard';
type UserRole = 'user' | 'admin' | 'worker' | null;

export default function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [currentUser, setCurrentUser] = useState<{ username: string; role: UserRole } | null>(null);

  const handleGetStarted = () => {
    setAppState('role-selection');
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setAppState('login');
  };

  const handleLogin = (credentials: { username: string; password: string }) => {
    // Simple demo validation
    const validCredentials = {
      demo_user: 'password123',
      demo_admin: 'password123',
      demo_worker: 'password123'
    };

    const expectedRole = selectedRole;
    const expectedUsername = `demo_${expectedRole}`;

    if (credentials.username === expectedUsername && 
        validCredentials[expectedUsername as keyof typeof validCredentials] === credentials.password) {
      setCurrentUser({ username: credentials.username, role: selectedRole });
      setAppState('dashboard');
    } else {
      alert('Invalid credentials. Please use the demo credentials provided.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedRole(null);
    setAppState('landing');
  };

  const handleBack = () => {
    if (appState === 'role-selection') {
      setAppState('landing');
    } else if (appState === 'login') {
      setSelectedRole(null);
      setAppState('role-selection');
    }
  };

  const renderScreen = () => {
    switch (appState) {
      case 'landing':
        return <LandingPage onGetStarted={handleGetStarted} />;
      
      case 'role-selection':
        return <RoleSelection onBack={handleBack} onRoleSelect={handleRoleSelect} />;
      
      case 'login':
        return selectedRole ? (
          <LoginForm 
            role={selectedRole} 
            onBack={handleBack} 
            onLogin={handleLogin} 
          />
        ) : null;
      
      case 'dashboard':
        if (!currentUser) return null;
        
        switch (currentUser.role) {
          case 'user':
            return <UserDashboard onLogout={handleLogout} />;
          case 'admin':
            return <AdminDashboard onLogout={handleLogout} />;
          case 'worker':
            return <WorkerDashboard onLogout={handleLogout} />;
          default:
            return null;
        }
      
      default:
        return <LandingPage onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Water Background with Ripple Effects */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1556751294-71a6b54726ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMHJpcHBsZXMlMjBibHVlJTIwY2xlYW58ZW58MXx8fHwxNzU4MDI2OTgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
        }}
      />
      
      {/* Blue Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-400/10 to-blue-600/30" />
      
      {/* Animated Ripple Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-32 h-32 rounded-full border-2 border-white/20 animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute top-3/4 right-1/4 w-24 h-24 rounded-full border-2 border-blue-200/30 animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full border-2 border-cyan-200/25 animate-ping" style={{ animationDuration: '5s', animationDelay: '2s' }} />
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10 min-h-screen">
        {renderScreen()}
      </div>
    </div>
  );
}