import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { member, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center" style={{ minHeight: '100vh' }}><div className="spinner" /></div>;
  if (!member) return <Navigate to="/login" replace />;
  return <Outlet />;
}
