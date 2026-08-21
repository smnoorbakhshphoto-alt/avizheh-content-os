import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import Layout from './components/layout/Layout';

import Login from './pages/Login';
import Today from './pages/Today';
import Calendar from './pages/Calendar';
import Ideas from './pages/Ideas';
import More from './pages/More';
import QuickAdd from './pages/QuickAdd';
import ContentDetail from './pages/ContentDetail';
import Team from './pages/Team';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/today" element={<Today />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/ideas" element={<Ideas />} />
          <Route path="/more" element={<More />} />
        </Route>
        <Route path="/new" element={<QuickAdd />} />
        <Route path="/content/:id" element={<ContentDetail />} />
        <Route path="/team" element={<Team />} />
      </Route>

      <Route path="/" element={<Navigate to="/today" replace />} />
      <Route path="*" element={<Navigate to="/today" replace />} />
    </Routes>
  );
}
