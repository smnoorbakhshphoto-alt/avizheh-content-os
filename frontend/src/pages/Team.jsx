import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as contentApi from '../api/content';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Team() {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');
  const [saving, setSaving] = useState(false);

  function load() {
    contentApi.getTeam()
      .then((res) => setMembers(res.data))
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!isAdmin) { navigate('/more', { replace: true }); return; }
    load();
  }, [isAdmin]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await contentApi.createTeamMember({ fullName, username, password, role });
      showToast('عضو جدید اضافه شد.', 'success');
      setFullName(''); setUsername(''); setPassword(''); setRole('member');
      load();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  if (!isAdmin) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink)', maxWidth: 480, margin: '0 auto' }}>
      <div style={{ padding: '24px 20px 40px' }}>
        <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <span style={{ fontSize: 19, fontWeight: 800 }}>مدیریت تیم</span>
          <button type="button" onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--ivory-dim)', cursor: 'pointer' }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ background: 'var(--ink-2)', border: '1px solid var(--line-2)', borderRadius: 14, padding: 16, marginBottom: 26, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ivory-dim)' }}>افزودن عضو جدید</div>
          <input placeholder="نام کامل" value={fullName} onChange={(e) => setFullName(e.target.value)} style={inputStyle} />
          <input placeholder="نام کاربری (انگلیسی)" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} />
          <input placeholder="رمز عبور (حداقل ۸ کاراکتر)" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
          <div className="flex" style={{ gap: 8 }}>
            <button type="button" onClick={() => setRole('member')} style={roleBtnStyle(role === 'member')}>عضو عادی</button>
            <button type="button" onClick={() => setRole('admin')} style={roleBtnStyle(role === 'admin')}>ادمین</button>
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving || !fullName || !username || !password}>
            {saving ? <span className="spinner" /> : '+ افزودن عضو'}
          </button>
        </form>

        {loading ? (
          <div className="flex items-center justify-center" style={{ minHeight: 100 }}><div className="spinner" /></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {members.map((m) => (
              <div key={m.id} className="flex" style={{ gap: 12, background: 'var(--ink-2)', border: '1px solid var(--line)', borderRadius: 12, padding: 13, alignItems: 'center' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gold)', color: 'var(--ink)', fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {m.full_name?.[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>{m.full_name}</div>
                  <div style={{ fontSize: 11, color: 'var(--ivory-faint)' }}>{m.username}</div>
                </div>
                {m.role === 'admin' && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--gold)', background: 'var(--gold-wash)', padding: '3px 9px', borderRadius: 999 }}>ادمین</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', background: 'var(--ink-3)', border: '1px solid var(--line)', borderRadius: 9,
  padding: '11px 13px', color: 'var(--ivory)', fontFamily: 'inherit', fontSize: 13, outline: 'none',
};

function roleBtnStyle(active) {
  return {
    flex: 1, textAlign: 'center', borderRadius: 9, padding: '9px 0', fontSize: 12.5, cursor: 'pointer',
    background: active ? 'var(--gold)' : 'var(--ink-3)', border: active ? 'none' : '1px solid var(--line)',
    color: active ? 'var(--ink)' : 'var(--ivory-dim)', fontWeight: active ? 700 : 400,
  };
}
