import React from 'react';
import { 
  Home, 
  FileText, 
  MessageSquare, 
  CreditCard, 
  Settings,
  Upload,
  Users,
  X,
  Eye
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Sidebar({ isOpen, onClose, currentPage, onPageChange }: SidebarProps) {
  const { user } = useAuth();

  const residentMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'notices', label: 'Avisos', icon: FileText },
    { id: 'complaints', label: 'Reclamações', icon: MessageSquare },
    { id: 'bills', label: 'Boletos', icon: CreditCard },
  ];

  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'manage-notices', label: 'Gerenciar Avisos', icon: FileText },
    { id: 'manage-bills', label: 'Gerenciar Boletos', icon: Upload },
    { id: 'view-complaints', label: 'Ver Reclamações', icon: Eye },
    { id: 'residents', label: 'Moradores', icon: Users },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : residentMenuItems;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-none lg:border-r lg:border-gray-200
        w-64
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-800 text-sm">{user?.name}</p>
              <p className="text-xs text-gray-600">
                {user?.role === 'admin' ? 'Administrador' : `Apt. ${user?.apartment}`}
              </p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  onClose();
                }}
                className={`
                  w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200
                  ${currentPage === item.id 
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-l-4 border-blue-600 shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon className={`h-5 w-5 ${currentPage === item.id ? 'text-blue-600' : ''}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}