'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { initKeycloak, getKeycloak, getUser, getToken, isAuthenticated } from './auth';
import type Keycloak from 'keycloak-js';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  token: string | null;
  keycloak: Keycloak | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);
  const [keycloakInstance, setKeycloakInstance] = useState<Keycloak | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { kc, authenticated } = await initKeycloak((kc) => {
          setAuthenticated(true);
          setUser(getUser());
          setToken(getToken());
          setKeycloakInstance(kc);
        });

        setAuthenticated(authenticated);
        setKeycloakInstance(kc);

        if (authenticated) {
          setUser(getUser());
          setToken(getToken());
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = () => {
    const kc = getKeycloak();
    kc.login();
  };

  const logout = () => {
    const kc = getKeycloak();
    kc.logout();
  };

  const value = {
    isAuthenticated: authenticated,
    user,
    token,
    keycloak: keycloakInstance,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
