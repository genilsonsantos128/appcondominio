import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, RegisterData, AdminRegisterData } from '../types';
import { 
  findUserByEmail, 
  comparePassword, 
  createUser, 
  validateSecretKey, 
  checkApartmentExists,
  generateToken,
  verifyToken
} from '../utils/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const token = localStorage.getItem('auth_token');
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const userData = findUserByEmail(''); // This would be improved with proper user lookup
        // For now, we'll skip auto-login and require fresh login
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const foundUser = findUserByEmail(email);
      
      if (!foundUser) {
        return { success: false, message: 'Email não encontrado' };
      }

      const isValidPassword = await comparePassword(password, foundUser.password);
      
      if (!isValidPassword) {
        return { success: false, message: 'Senha incorreta' };
      }

      const token = generateToken(foundUser.id);
      localStorage.setItem('auth_token', token);

      const userWithoutPassword = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        apartment: foundUser.apartment,
        createdAt: foundUser.createdAt
      };

      setUser(userWithoutPassword);
      return { success: true, message: 'Login realizado com sucesso' };
    } catch (error) {
      return { success: false, message: 'Erro interno do servidor' };
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; message: string }> => {
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        return { success: false, message: 'Email inválido' };
      }

      // Check if email already exists
      if (findUserByEmail(userData.email)) {
        return { success: false, message: 'Email já cadastrado' };
      }

      // Check if apartment already has a resident
      if (checkApartmentExists(userData.apartment)) {
        return { success: false, message: 'Apartamento já possui um morador cadastrado' };
      }

      // Validate password strength
      if (userData.password.length < 6) {
        return { success: false, message: 'Senha deve ter pelo menos 6 caracteres' };
      }

      // Create new user
      await createUser({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        apartment: userData.apartment,
        role: 'resident'
      });

      return { success: true, message: 'Cadastro realizado com sucesso! Faça login para continuar.' };
    } catch (error) {
      return { success: false, message: 'Erro interno do servidor' };
    }
  };

  const registerAdmin = async (userData: AdminRegisterData): Promise<{ success: boolean; message: string }> => {
    try {
      // Validate secret key
      if (!validateSecretKey(userData.secretKey)) {
        return { success: false, message: 'Chave secreta inválida' };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        return { success: false, message: 'Email inválido' };
      }

      // Check if email already exists
      if (findUserByEmail(userData.email)) {
        return { success: false, message: 'Email já cadastrado' };
      }

      // Validate password strength
      if (userData.password.length < 6) {
        return { success: false, message: 'Senha deve ter pelo menos 6 caracteres' };
      }

      // Create new admin
      await createUser({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: 'admin'
      });

      return { success: true, message: 'Administrador cadastrado com sucesso!' };
    } catch (error) {
      return { success: false, message: 'Erro interno do servidor' };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    registerAdmin,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}