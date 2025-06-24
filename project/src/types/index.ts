export interface User {
  id: string;
  name: string;
  email: string;
  role: 'resident' | 'admin';
  apartment?: string;
  createdAt: string;
}

export interface Notice {
  id: string;
  title: string;
  description: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
  author: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: 'maintenance' | 'noise' | 'security' | 'cleaning' | 'other';
  date: string;
  status: 'pending' | 'in-progress' | 'resolved';
}

export interface Bill {
  id: string;
  apartment: string;
  month: string;
  year: number;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  downloadUrl: string;
  description?: string;
  createdAt: string;
  paymentId?: string;
  paymentUrl?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message: string }>;
  registerAdmin: (userData: AdminRegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  apartment: string;
  password: string;
}

export interface AdminRegisterData {
  name: string;
  email: string;
  password: string;
  secretKey: string;
}