import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authApi from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!username || !password) { setError('نام کاربری و رمز عبور را وارد کنید.'); return; }
    setLoading(true);
    try {
      const res = await authApi.login(username, password);
      login(res.data.token, res.data.member);
      navigate('/today', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        <div className="display" style={{ fontSize: 30, color: 'var(--gold)', textAlign: 'center', marginBottom: 6 }}>آویژه</div>
        <div style={{ fontSize: 13, color: 'var(--ivory-faint)', textAlign: 'center', marginBottom: 30 }}>ورود به ابزار مدیریت محتوا</div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>نام کاربری</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} autoFocus autoComplete="username" />
          </div>
          <div className="field">
            <label>رمز عبور</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
            {error && <div className="field-error">{error}</div>}
          </div>
          <button className="btn btn-primary btn-block" disabled={loading} style={{ padding: '14px 0' }}>
            {loading ? <span className="spinner" /> : 'ورود'}
          </button>
        </form>
      </div>
    </div>
  );
}
