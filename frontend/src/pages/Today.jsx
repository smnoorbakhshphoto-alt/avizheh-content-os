import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as contentApi from '../api/content';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { typeMeta } from './contentTypes';

function TaskCard({ task, urgent }) {
  const navigate = useNavigate();
  const meta = typeMeta(task.content_type);
  return (
    <div
      onClick={() => navigate(`/content/${task.content_id}`)}
      style={{
        background: 'var(--ink-2)', border: `1px solid ${urgent ? 'var(--line-2)' : 'var(--line)'}`,
        borderRadius: 14, padding: 16, cursor: 'pointer', position: 'relative', overflow: 'hidden',
      }}
    >
      {urgent && <div style={{ position: 'absolute', inset: '0 0 auto 0', height: 2, background: `linear-gradient(90deg, ${meta.color}, transparent)` }} />}
      <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
        <div className="flex" style={{ gap: 10, alignItems: 'center' }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: `${meta.color}26`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={meta.color} strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="4" /></svg>
          </div>
          <span style={{ fontSize: 11, color: meta.color, fontWeight: 700 }}>{meta.label}</span>
        </div>
        {task.due_at && (
          <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 999, background: urgent ? 'var(--danger-wash)' : 'var(--gold-wash)', color: urgent ? 'var(--danger)' : 'var(--gold)' }}>
            {new Date(task.due_at).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
      <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--ivory)', marginBottom: 4 }}>{task.content_title}</div>
      <div style={{ fontSize: 12.5, color: 'var(--ivory-dim)' }}>{task.title} — الان نوبت شماست</div>
    </div>
  );
}

export default function Today() {
  const { member } = useAuth();
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    contentApi.getToday()
      .then((res) => setData(res.data))
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}><div className="spinner" /></div>;

  const isEmpty = data && data.needsAction.length === 0 && data.dueToday.length === 0 && data.readyToPublish.length === 0;

  return (
    <div style={{ padding: '26px 20px 10px' }}>
      <div className="display" style={{ fontSize: 27, color: 'var(--ivory)' }}>سلام {member?.full_name}</div>
      <div style={{ fontSize: 12.5, color: 'var(--ivory-faint)', marginTop: 3, marginBottom: 26 }}>
        {new Intl.DateTimeFormat('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}
      </div>

      {isEmpty && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--ivory-faint)' }}>
          <div style={{ fontSize: 14, marginBottom: 16 }}>هنوز کاری برای امروز نداری</div>
          <button className="btn btn-primary" onClick={() => navigate('/new')}>+ محتوای جدید</button>
        </div>
      )}

      {data?.needsAction.length > 0 && (
        <div style={{ marginBottom: 26 }}>
          <div className="flex" style={{ gap: 8, marginBottom: 12, alignItems: 'center' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--danger)', boxShadow: '0 0 0 4px var(--danger-wash)' }} />
            <span style={{ fontSize: 13, fontWeight: 700 }}>نیاز به اقدام</span>
            <span style={{ fontSize: 11, color: 'var(--danger)', background: 'var(--danger-wash)', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>{data.needsAction.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.needsAction.map((t) => <TaskCard key={t.id} task={t} urgent />)}
          </div>
        </div>
      )}

      {data?.dueToday.length > 0 && (
        <div style={{ marginBottom: 26 }}>
          <div className="flex" style={{ gap: 8, marginBottom: 12, alignItems: 'center' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#D9A441', boxShadow: '0 0 0 4px rgba(217,164,65,0.16)' }} />
            <span style={{ fontSize: 13, fontWeight: 700 }}>امروز</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.dueToday.map((t) => <TaskCard key={t.id} task={t} />)}
          </div>
        </div>
      )}

      {data?.readyToPublish.length > 0 && (
        <div style={{ marginBottom: 26 }}>
          <div className="flex" style={{ gap: 8, marginBottom: 12, alignItems: 'center' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 0 4px var(--success-wash)' }} />
            <span style={{ fontSize: 13, fontWeight: 700 }}>آماده انتشار</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.readyToPublish.map((c) => (
              <div key={c.id} onClick={() => navigate(`/content/${c.id}`)} className="flex" style={{ gap: 10, background: 'var(--ink-2)', border: '1px solid var(--line)', borderRadius: 12, padding: '12px 13px', cursor: 'pointer', alignItems: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                <span style={{ fontSize: 13, color: 'var(--ivory-dim)', flex: 1 }}>{c.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
