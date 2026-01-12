import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CreateProject from './pages/CreateProject';
import ProjectDetail from './pages/ProjectDetail';
import Navbar from './components/Navbar.tsx'; 
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/ToastContainer';
import { walletService } from './services/WalletService';
import type { Page } from './types/index.ts';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    const wallet = walletService.getWallet();
    if (wallet && wallet.connected) {
      setCurrentPage('dashboard' as Page);

    }
  }, []);

  const handleNavigate = (page: Page | string, projectId?: string) => {
    setCurrentPage('dashboard' as Page);
    if (projectId) setSelectedProjectId(projectId);
  };

  const showNavbar = currentPage !== 'landing';

  return (
    <ErrorBoundary>
      <ToastProvider>
        <div className="flex h-screen bg-slate-950 flex-col">
          {showNavbar && (
            <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
          )}

          <div className="flex-1 overflow-hidden">
            <main className="h-full overflow-x-hidden overflow-y-auto bg-slate-950">
              <div className="animate-fade-in">
                {currentPage === 'landing' && <LandingPage onNavigate={handleNavigate} />}
                {currentPage === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
                {currentPage === 'create-project' && <CreateProject onNavigate={handleNavigate} />}
                {currentPage === 'project-detail' && selectedProjectId && (
                  <ProjectDetail projectId={selectedProjectId} onNavigate={handleNavigate} />
                )}
              </div>
            </main>
          </div>
          
          <footer className="footer no-print bg-slate-950/80 backdrop-blur-xl border-t border-white/10 py-6 px-6 text-center text-sm text-gray-400">
            Flow8 © 2026 <span className="text-purple-500">♥</span>
            <a 
              href="https://icphubkenya.io/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2 hover:underline focus:underline focus:outline-none text-purple-500 hover:text-purple-400"
            >
             
            </a>
          </footer>
        </div>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;