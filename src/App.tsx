import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CreateProject from './pages/CreateProject';
import ProjectDetail from './pages/ProjectDetail';
import Navbar from './components/landing/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/ToastContainer';
import { mneeService } from './services/MNEEService';
import type { Page } from './types/index';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Initialize MNEE
  const initMNEE = async () => {
    try {
 
      const info = await mneeService.getTokenInfo();
      console.log('MNEE initialized:', info);
    } catch (error) {
      console.error('Failed to initialize MNEE:', error);
    }
  };

  const handleNavigate = (page: Page | string, projectId?: string) => {
    setCurrentPage(page as Page);
    if (projectId) setSelectedProjectId(projectId);
  };

  const showNavbar = currentPage !== 'landing';

  return (
    <ErrorBoundary>
      <ToastProvider>
        <div className="min-h-screen bg-slate-950">
          {showNavbar && <Navbar onNavigate={handleNavigate} currentPage={currentPage} />}

          {currentPage === 'landing' && <LandingPage onNavigate={handleNavigate} />}
          {currentPage === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
          {currentPage === 'create-project' && <CreateProject onNavigate={handleNavigate} />}  {/* ADD THIS */}
          {currentPage === 'project-detail' && selectedProjectId && (
            <ProjectDetail projectId={selectedProjectId} onNavigate={handleNavigate} />
          )}
        </div>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;