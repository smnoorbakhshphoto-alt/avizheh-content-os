import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [member, setMember] = useState(() => {
    const raw = localStorage.getItem('contentos_member');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('contentos_token');
    if (!token) { setLoading(false); return; }
    authApi.getMe()
      .then((res) => setMember(res.data.member))
      .catch(() => {
        localStorage.removeItem('contentos_token');
        localStorage.removeItem('contentos_member');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback((token, memberData) => {
    localStorage.setItem('contentos_token', token);
    localStorage.setItem('contentos_member', JSON.stringify(memberData));
    setMember(memberData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('contentos_token');
    localStorage.removeItem('contentos_member');
    setMember(null);
  }, []);

  return (
    <AuthContext.Provider value={{ member, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth باید داخل AuthProvider استفاده شود.');
  return ctx;
}
