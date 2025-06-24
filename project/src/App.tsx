import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { LoginForm } from './components/Auth/LoginForm';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';

// Resident Components
import { ResidentDashboard } from './components/Resident/Dashboard';
import { NoticesPage } from './components/Resident/NoticesPage';
import { ComplaintsPage } from './components/Resident/ComplaintsPage';
import { BillsPage } from './components/Resident/BillsPage';

// Admin Components
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { ManageNoticesPage } from './components/Admin/ManageNoticesPage';
import { ViewComplaintsPage } from './components/Admin/ViewComplaintsPage';
import { ManageBillsPage } from './components/Admin/ManageBillsPage';

function AppContent() {
  const { isAuthenticated, user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderPage = () => {
    if (user?.role === 'admin') {
      switch (currentPage) {
        case 'manage-notices':
          return <ManageNoticesPage />;
        case 'view-complaints':
          return <ViewComplaintsPage />;
        case 'manage-bills':
          return <ManageBillsPage />;
        case 'residents':
          return <div className="p-6">Moradores - Em desenvolvimento</div>;
        case 'settings':
          return <div className="p-6">Configurações - Em desenvolvimento</div>;
        default:
          return <AdminDashboard />;
      }
    } else {
      switch (currentPage) {
        case 'notices':
          return <NoticesPage />;
        case 'complaints':
          return <ComplaintsPage />;
        case 'bills':
          return <BillsPage />;
        default:
          return <ResidentDashboard />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      
      <div className="flex-1 lg:ml-64">
        <Header
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />
        
        <main className="flex-1">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;