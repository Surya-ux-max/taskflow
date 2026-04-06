import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('taskflow_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData) => {
    // defaults if not provided
    const userPayload = {
      name: userData.name || 'Alex Morgan',
      email: userData.email,
      accountType: userData.accountType || 'Organization', // Organization or Individual
      avatar: 32
    };
    setUser(userPayload);
    localStorage.setItem('taskflow_user', JSON.stringify(userPayload));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('taskflow_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
