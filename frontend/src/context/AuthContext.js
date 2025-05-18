// src/context/AuthContext.js
import { createContext, useContext } from 'react';

// Create context with proper default value
const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  loading: false
});

export const AuthProvider = ({ children }) => {
  // ... your existing implementation
};

// Custom hook with safety check
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};