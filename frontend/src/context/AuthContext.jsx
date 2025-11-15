import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authAPI, profileAPI, setAuthTokens, clearAuthTokens } from '../services/api';

const AuthContext = createContext(null);

const storageKey = 'genz-auth-tokens';

export function AuthProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [authError, setAuthError] = useState(null);

  // hydrate tokens from storage
  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.accessToken && parsed.refreshToken) {
          setSession(parsed.accessToken, parsed.refreshToken);
          bootstrapProfile();
          return;
        }
      } catch (error) {
        console.error('Failed to parse stored tokens', error);
      }
    }
    setIsInitializing(false);
  }, []);

  const setSession = useCallback((access, refresh, incomingProfile) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    setAuthTokens({ accessToken: access, refreshToken: refresh });
    window.localStorage.setItem(storageKey, JSON.stringify({ accessToken: access, refreshToken: refresh }));
    if (incomingProfile) {
      setProfile(incomingProfile);
    }
  }, []);

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setProfile(null);
    clearAuthTokens();
    window.localStorage.removeItem(storageKey);
  }, []);

  const bootstrapProfile = useCallback(async () => {
    try {
      const me = await profileAPI.me();
      setProfile(me);
    } catch (error) {
      console.error('Failed to fetch profile, clearing session', error);
      clearSession();
    } finally {
      setIsInitializing(false);
    }
  }, [clearSession]);

  const authenticate = useCallback(async ({ email, password, handle, mode }) => {
    setAuthError(null);
    try {
      const payload = mode === 'register'
        ? await authAPI.register({ email, password, handle })
        : await authAPI.login({ email, password });
      setSession(payload.accessToken, payload.refreshToken, payload.profile);
      setIsInitializing(false);
      return payload.profile;
    } catch (error) {
      console.error('Auth failed', error);
      setAuthError(error.response?.data?.message || 'Authentication failed');
      throw error;
    }
  }, [setSession]);

  const refresh = useCallback(async () => {
    if (!refreshToken) throw new Error('No refresh token');
    const payload = await authAPI.refresh();
    setSession(payload.accessToken, payload.refreshToken, payload.profile);
    return payload.profile;
  }, [refreshToken, setSession]);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const value = {
    profile,
    accessToken,
    refreshToken,
    isInitializing,
    authError,
    authenticate,
    refresh,
    logout,
    bootstrapProfile,
    clearSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
