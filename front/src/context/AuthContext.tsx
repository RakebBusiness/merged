import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  idUser: number;
  Email: string;
  nom: string;
  prenom: string;
  role: 'etudiant' | 'enseignant';
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isTeacher: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('accessToken');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setAccessToken(storedToken);
    }
  }, []);

  const login = async (email: string, motDePasse: string) => {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, motDePasse }),
    });

    const data = await response.json();

    if (data.success) {
      setUser(data.user);
      setAccessToken(data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('accessToken', data.accessToken);
    } else {
      throw new Error(data.error || 'Login failed');
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
  };

  const value: AuthContextType = {
    user,
    accessToken,
    login,
    logout,
    isAuthenticated: !!user && !!accessToken,
    isTeacher: user?.role === 'enseignant',
    isStudent: user?.role === 'etudiant',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
