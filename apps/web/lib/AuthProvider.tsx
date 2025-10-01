'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  initKeycloak,
  getKeycloak,
  getUser,
  getToken,
  isAuthenticated,
  resetKeycloak,
  logout as keycloakLogout,
} from './auth-simple';
import type Keycloak from 'keycloak-js';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  token: string | null;
  keycloak: Keycloak | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
  refreshAuth: () => void;
  resetAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [keycloakInstance, setKeycloakInstance] = useState<Keycloak | null>(
    null
  );

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Clean up any URL parameters that might be left over
        const urlParams = new URLSearchParams(window.location.search);
        if (
          urlParams.has('logout') ||
          window.location.search.includes('logout')
        ) {
          console.log('AuthProvider: Cleaning up logout URL parameters');
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        }

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

  // Re-check authentication state when the page loads (after login redirect)
  useEffect(() => {
    const checkAuthState = () => {
      const kc = getKeycloak();
      if (kc) {
        const isAuth = kc.authenticated;
        console.log('AuthProvider: Checking auth state:', isAuth);
        setAuthenticated(isAuth);
        if (isAuth) {
          setUser(getUser());
          setToken(getToken());
          console.log('AuthProvider: User authenticated:', getUser());
        } else {
          setUser(null);
          setToken(null);
        }
      }
    };

    // Check auth state multiple times to catch authentication
    const timers = [
      setTimeout(checkAuthState, 1000),
      setTimeout(checkAuthState, 3000),
      setTimeout(checkAuthState, 5000),
    ];

    // Also check when the page becomes visible (user comes back from login)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('AuthProvider: Page visible, checking auth state');
        checkAuthState();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', checkAuthState);

    return () => {
      timers.forEach(clearTimeout);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', checkAuthState);
    };
  }, []);

  const login = () => {
    const kc = getKeycloak();
    // Force a fresh login by adding multiple parameters to ensure login form is shown
    kc.login({
      prompt: 'login',
      maxAge: 0, // Force re-authentication
      loginHint: '', // Clear any cached login hints
    });
  };

  const logout = () => {
    const kc = getKeycloak();
    if (kc && kc.authenticated) {
      console.log('AuthProvider: Starting logout process');

      // Clear local state immediately
      setAuthenticated(false);
      setUser(null);
      setToken(null);
      setKeycloakInstance(null);

      // Clear all storage
      try {
        localStorage.clear();
        sessionStorage.clear();

        // Clear cookies
        document.cookie.split(';').forEach(function (c) {
          const eqPos = c.indexOf('=');
          const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
          if (name) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
          }
        });
      } catch (error) {
        console.error('Error clearing storage during logout:', error);
      }

      // Use a simple client-side logout approach
      try {
        console.log('Performing client-side logout - immediate redirect');

        // Reset the Keycloak instance to clear any cached state
        resetKeycloak();

        // Redirect immediately - the user will be logged out on the client side
        // The server-side session will be handled by forcing fresh logins
        console.log('Redirecting to home page immediately');
        window.location.href = '/';
      } catch (error) {
        console.error('Client-side logout failed:', error);
        // Final fallback - just redirect to home
        window.location.href = '/';
      }
    } else {
      console.log(
        'AuthProvider: Not authenticated, clearing state and redirecting'
      );
      // If not authenticated, just clear local state and redirect
      setAuthenticated(false);
      setUser(null);
      setToken(null);
      setKeycloakInstance(null);

      // Clear storage anyway
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (error) {
        console.error('Error clearing storage:', error);
      }

      window.location.href = '/';
    }
  };

  const refreshAuth = () => {
    const kc = getKeycloak();
    if (kc) {
      const isAuth = kc.authenticated;
      setAuthenticated(isAuth);
      if (isAuth) {
        setUser(getUser());
        setToken(getToken());
      } else {
        setUser(null);
        setToken(null);
      }
    }
  };

  const resetAuth = () => {
    console.log('AuthProvider: Resetting authentication state');
    setAuthenticated(false);
    setUser(null);
    setToken(null);
    setKeycloakInstance(null);
    setLoading(false);

    // Also reset the Keycloak instance
    try {
      resetKeycloak();
    } catch (error) {
      console.error('Error resetting Keycloak instance:', error);
    }
  };

  const value = {
    isAuthenticated: authenticated,
    user,
    token,
    keycloak: keycloakInstance,
    login,
    logout,
    loading,
    refreshAuth,
    resetAuth,
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
