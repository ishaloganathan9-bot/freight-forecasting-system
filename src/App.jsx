import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import Dashboard from './pages/Dashboard';
import NewAnalysis from './pages/NewAnalysis';
import Recommendations from './pages/Recommendations';
import History from './pages/History';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import ShipOwnerDashboard from './pages/ShipOwnerDashboard';
import PortOperatorDashboard from './pages/PortOperatorDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { defaultAnalysisData } from './services/api';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [analysisData, setAnalysisData] = useState(defaultAnalysisData);
  const [theme, setTheme] = useState('dark');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  // Stakeholder role state: 'cargo-buyer' | 'ship-owner' | 'port-operator'
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('freight_user_role') || 'cargo-buyer';
  });

  // Auth screen state: null | 'login' | 'register'
  const [authScreen, setAuthScreen] = useState(null);

  // Sync data-theme attribute with document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Sync role to localStorage
  const handleSetUserRole = (newRole) => {
    setUserRole(newRole);
    localStorage.setItem('freight_user_role', newRole);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  // Dedicated Auth screens
  if (authScreen === 'login') {
    return (
      <Login 
        onLogin={(role) => {
          handleSetUserRole(role);
          setAuthScreen(null);
          setCurrentPage('dashboard');
        }}
        onNavigateRegister={() => setAuthScreen('register')}
        onCancel={() => setAuthScreen(null)}
      />
    );
  }

  if (authScreen === 'register') {
    return (
      <Register 
        onRegister={(role) => {
          handleSetUserRole(role);
          setAuthScreen(null);
          setCurrentPage('dashboard');
        }}
        onNavigateLogin={() => setAuthScreen('login')}
      />
    );
  }

  return (
    <div className="app-layout" data-theme={theme}>
      {/* Persistent Left Sidebar */}
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
        userRole={userRole}
      />

      {/* Main Content Area */}
      <div className="app-main">
        {/* Global Topbar with Navigation & Stakeholder Context */}
        <TopHeader 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          theme={theme}
          toggleTheme={toggleTheme}
          userRole={userRole}
          setUserRole={handleSetUserRole}
          onOpenLogin={() => setAuthScreen('login')}
          isSidebarCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
        />

        {/* Page Switcher */}
        {currentPage === 'dashboard' && (
          <>
            {userRole === 'ship-owner' && (
              <ShipOwnerDashboard setCurrentPage={setCurrentPage} />
            )}

            {userRole === 'port-operator' && (
              <PortOperatorDashboard setCurrentPage={setCurrentPage} />
            )}

            {userRole === 'cargo-buyer' && (
              <Dashboard 
                setCurrentPage={setCurrentPage} 
                analysisData={analysisData}
                setAnalysisData={setAnalysisData}
              />
            )}
          </>
        )}

        {(currentPage === 'new-analysis' || currentPage === 'newAnalysis') && (
          <NewAnalysis 
            setCurrentPage={setCurrentPage} 
            analysisData={analysisData}
            setAnalysisData={setAnalysisData} 
          />
        )}

        {(currentPage === 'recommendations' || currentPage === 'recommendation') && (
          <Recommendations 
            setCurrentPage={setCurrentPage} 
            analysisData={analysisData} 
          />
        )}

        {currentPage === 'history' && (
          <History 
            setCurrentPage={setCurrentPage} 
            setAnalysisData={setAnalysisData} 
          />
        )}

        {currentPage === 'reports' && (
          <Reports 
            setCurrentPage={setCurrentPage} 
            analysisData={analysisData} 
          />
        )}

        {currentPage === 'settings' && (
          <Settings 
            theme={theme} 
            toggleTheme={toggleTheme}
            userRole={userRole}
            setUserRole={handleSetUserRole}
            onLogout={() => setAuthScreen('login')}
          />
        )}
      </div>
    </div>
  );
}