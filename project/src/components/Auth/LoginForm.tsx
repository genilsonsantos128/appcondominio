import React, { useState } from 'react';
import { Building2, User, Lock, AlertCircle, CheckCircle, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminRegister, setIsAdminRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    apartment: '',
    password: '',
    confirmPassword: '',
    secretKey: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const { login, register, registerAdmin } = useAuth();

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      apartment: '',
      password: '',
      confirmPassword: '',
      secretKey: ''
    });
    setMessage({ type: '', text: '' });
  };

  const handleModeChange = (mode: 'login' | 'register' | 'admin-register') => {
    resetForm();
    setIsLogin(mode === 'login');
    setIsAdminRegister(mode === 'admin-register');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setIsLoading(true);

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password);
        if (!result.success) {
          setMessage({ type: 'error', text: result.message });
        }
      } else if (isAdminRegister) {
        if (formData.password !== formData.confirmPassword) {
          setMessage({ type: 'error', text: 'Senhas não coincidem' });
          return;
        }
        
        const result = await registerAdmin({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          secretKey: formData.secretKey
        });
        
        setMessage({ type: result.success ? 'success' : 'error', text: result.message });
        
        if (result.success) {
          setTimeout(() => handleModeChange('login'), 2000);
        }
      } else {
        // Resident registration
        if (formData.password !== formData.confirmPassword) {
          setMessage({ type: 'error', text: 'Senhas não coincidem' });
          return;
        }
        
        const result = await register({
          name: formData.name,
          email: formData.email,
          apartment: formData.apartment,
          password: formData.password
        });
        
        setMessage({ type: result.success ? 'success' : 'error', text: result.message });
        
        if (result.success) {
          setTimeout(() => handleModeChange('login'), 2000);
        }
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Erro inesperado. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    if (isAdminRegister) return 'Cadastro de Administrador';
    if (isLogin) return 'Entrar no Sistema';
    return 'Cadastro de Morador';
  };

  const getSubtitle = () => {
    if (isAdminRegister) return 'Registre um novo administrador';
    if (isLogin) return 'Acesse sua conta';
    return 'Crie sua conta de morador';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{getTitle()}</h1>
          <p className="text-gray-600 mt-2">{getSubtitle()}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Seu nome completo"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          {!isLogin && !isAdminRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número do Apartamento
              </label>
              <input
                type="text"
                value={formData.apartment}
                onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Ex: 101, 202, 303"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>
          )}

          {isAdminRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chave Secreta de Administrador
              </label>
              <input
                type="password"
                value={formData.secretKey}
                onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Chave fornecida pela administração"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Entre em contato com a administração para obter a chave secreta
              </p>
            </div>
          )}

          {message.text && (
            <div className={`flex items-center space-x-2 p-3 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processando...</span>
              </div>
            ) : (
              <>
                {isLogin ? 'Entrar' : 'Cadastrar'}
              </>
            )}
          </button>
        </form>

        <div className="mt-6 space-y-3">
          {isLogin ? (
            <>
              <button
                onClick={() => handleModeChange('register')}
                className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                Não tem conta? Cadastre-se como morador
              </button>
              <button
                onClick={() => handleModeChange('admin-register')}
                className="w-full text-gray-600 hover:text-gray-700 text-xs transition-colors flex items-center justify-center space-x-1"
              >
                <UserPlus className="h-4 w-4" />
                <span>Cadastrar Administrador</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => handleModeChange('login')}
              className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              Já tem conta? Faça login
            </button>
          )}
        </div>

        {isLogin && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Dados para teste:
            </p>
            <div className="text-xs text-gray-500 space-y-1 bg-gray-50 p-3 rounded-lg">
              <p><strong>Admin:</strong> admin@condominio.com | Senha: password</p>
              <p><strong>Chave Admin:</strong> CONDOMINIO_ADMIN_2024</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}