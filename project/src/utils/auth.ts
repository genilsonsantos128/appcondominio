import bcrypt from 'bcryptjs';

// Simulated database - in production, use a real database
let users: Array<{
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'resident' | 'admin';
  apartment?: string;
  createdAt: string;
}> = [
  {
    id: '1',
    name: 'Admin Master',
    email: 'admin@condominio.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'admin',
    createdAt: new Date().toISOString()
  }
];

// Secret key for admin registration - in production, this should be environment variable
const ADMIN_SECRET_KEY = 'CONDOMINIO_ADMIN_2024';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const findUserByEmail = (email: string) => {
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
};

export const findUserById = (id: string) => {
  return users.find(user => user.id === id);
};

export const createUser = async (userData: {
  name: string;
  email: string;
  password: string;
  apartment?: string;
  role: 'resident' | 'admin';
}) => {
  const hashedPassword = await hashPassword(userData.password);
  const newUser = {
    id: Date.now().toString(),
    name: userData.name,
    email: userData.email.toLowerCase(),
    password: hashedPassword,
    role: userData.role,
    apartment: userData.apartment,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  return newUser;
};

export const validateSecretKey = (key: string): boolean => {
  return key === ADMIN_SECRET_KEY;
};

export const checkApartmentExists = (apartment: string): boolean => {
  return users.some(user => user.apartment === apartment && user.role === 'resident');
};

// Generate JWT token (simplified version)
export const generateToken = (userId: string): string => {
  // In production, use proper JWT library with secret key
  return btoa(JSON.stringify({ userId, timestamp: Date.now() }));
};

export const verifyToken = (token: string): { userId: string } | null => {
  try {
    const decoded = JSON.parse(atob(token));
    const user = findUserById(decoded.userId);
    if (user) {
      return { userId: decoded.userId };
    }
    return null;
  } catch {
    return null;
  }
};