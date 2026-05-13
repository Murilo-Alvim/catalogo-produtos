import { createContext, useContext, useState, useEffect } from 'react';

// Cria o contexto de autenticação
const AuthContext = createContext(null);

// Provider que envolve toda a aplicação
export function AuthProvider({ children }) {
  // Recupera o usuário e token do localStorage ao carregar a página (persistência de sessão)
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  // Salva o login: guarda usuário e token no estado e no localStorage
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
  };

  // Limpa tudo ao fazer logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook customizado para usar o contexto facilmente
export function useAuth() {
  return useContext(AuthContext);
}
