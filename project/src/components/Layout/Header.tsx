import React from 'react';
import { Menu, Bell, LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}

export function Header({ onMenuToggle, isSidebarOpen }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Condomínio Digital
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              2
            </span>
          </button>
          
          <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg">
            <div className="hidden sm:flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-xs">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500">
                  {user?.role === 'admin' ? 'Administrador' : `Apartamento ${user?.apartment}`}
                </p>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
              title="Sair"
            >
              <LogOut className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}