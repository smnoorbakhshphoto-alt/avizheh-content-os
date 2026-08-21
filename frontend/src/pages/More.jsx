import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function More() {
  const { member, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div style={{ padding: '26px 20px 10px' }}>
      <div style={{ fontSize: 19, fontWeight: 800, marginBottom: 22 }}>بیشتر</div>

      <div className="flex" style={{ gap: 12, background: 'var(--ink-2)', border: '1px solid var(--line)', borderRadius: 13, padding: 16, marginBottom: 20, alignItems: 'center' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--gold)', color: 'var(--ink)', fontSize: 16, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {member?.full_name?.[0]}
        </div>
        <div>
          <div style={{ fontSize: 14.5, fontWeight: 700 }}>{member?.full_name}</div>
          <div style={{ fontSize: 11.5, color: 'var(--ivory-faint)' }}>عضو تیم</div>
        </div>
      </div>

      <button type="button" className="btn btn-ghost btn-block" onClick={handleLogout}>خروج از حساب</button>
    </div>
  );
}
