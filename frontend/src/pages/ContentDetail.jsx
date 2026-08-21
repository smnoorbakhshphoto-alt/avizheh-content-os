import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as contentApi from '../api/content';
import { useToast } from '../context/ToastContext';
import { typeMeta } from './contentTypes';

export default function ContentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  function load() {
    contentApi.getContent(id)
      .then((res) => setContent(res.data))
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [id]);

  async function handleCompleteCurrentTask() {
    if (!content?.currentTask) return;
    setBusy(true);
    try {
      const res = await contentApi.completeTask(content.currentTask.id);
      setContent(res.data);
      if (res.data.status === 'ready') showToast('همه‌ی کارها تمام شد — آماده‌ی انتشار است.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  async function handlePublish() {
    setBusy(true);
    try {
      const res = await contentApi.publishContent(id);
      setContent((prev) => ({ ...prev, status: res.data.status, published_at: res.data.published_at }));
      showToast('منتشر شد.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <div style={{ minHeight: '100vh', background: 'var(--ink)' }} className="flex items-center justify-center"><div className="spinner" /></div>;
  }
  if (!content) return null;

  const meta = typeMeta(content.content_type);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink)', maxWidth: 480, margin: '0 auto' }}>
      <div style={{ padding: '24px 20px 40px' }}>
        <button type="button" onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--ivory-dim)', cursor: 'pointer', marginBottom: 6 }}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6" /></svg>
        </button>

        <div className="flex" style={{ gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, background: `${meta.color}29`, color: meta.color, padding: '4px 10px', borderRadius: 999 }}>{meta.label}</span>
        </div>

        <div style={{ fontSize: 19, fontWeight: 800, lineHeight: 1.5, marginBottom: 10 }}>{content.title}</div>

        {content.scheduled_at && (
          <div className="flex" style={{ gap: 7, marginBottom: 20, alignItems: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ivory-faint)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4.5" width="18" height="16" rx="3" /><path d="M3 9.5h18M8 3v3M16 3v3" /></svg>
            <span style={{ fontSize: 12, color: 'var(--ivory-faint)' }}>
              انتشار: {new Intl.DateTimeFormat('fa-IR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(new Date(content.scheduled_at))}
            </span>
          </div>
        )}

        {content.currentTask && (
          <div style={{ background: 'var(--gold-wash)', border: '1px solid rgba(199,154,91,0.35)', borderRadius: 14, padding: 15, marginBottom: 22 }}>
            <div className="flex" style={{ gap: 11, alignItems: 'center' }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--gold)', color: 'var(--ink)', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {content.currentTask.assignee_name?.[0] || '؟'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: 'var(--gold-dim)', fontWeight: 700, marginBottom: 2 }}>الان نوبت {content.currentTask.assignee_name || 'کسی نیست'} است</div>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--ivory)' }}>{content.currentTask.title}</div>
              </div>
            </div>
          </div>
        )}

        {content.status === 'ready' && (
          <div className="flex" style={{ gap: 10, background: 'var(--success-wash)', border: '1px solid rgba(127,168,118,0.35)', borderRadius: 14, padding: 15, marginBottom: 22, alignItems: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            <span style={{ fontSize: 13.5, color: 'var(--ivory)', fontWeight: 600 }}>همه‌ی کارها تمام شده — آماده‌ی انتشار</span>
          </div>
        )}

        {content.status === 'published' && (
          <div style={{ fontSize: 12.5, color: 'var(--success)', fontWeight: 700, marginBottom: 22 }}>
            منتشر شد — {new Date(content.published_at).toLocaleDateString('fa-IR')}
          </div>
        )}

        <div style={{ marginBottom: 22 }}>
          <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ivory-dim)' }}>کارها</span>
            <span style={{ fontSize: 11.5, color: 'var(--ivory-faint)' }}>{content.tasks.filter((t) => t.status === 'done').length} از {content.tasks.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {content.tasks.map((task) => {
              const done = task.status === 'done';
              const isCurrent = content.currentTask?.id === task.id;
              return (
                <div key={task.id} className="flex" style={{ gap: 10, background: 'var(--ink-2)', borderRadius: 10, padding: '11px 13px', border: `1px solid ${isCurrent ? 'var(--gold-dim)' : 'var(--line)'}`, alignItems: 'center' }}>
                  {done ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="var(--gold)" stroke="none"><circle cx="12" cy="12" r="10" /><path d="m8.5 12.5 2.3 2.3L16 9.6" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={isCurrent ? 'var(--gold)' : 'var(--ivory-faint)'} strokeWidth="1.8"><circle cx="12" cy="12" r="9" /></svg>
                  )}
                  <span style={{ fontSize: 13, color: done ? 'var(--ivory-faint)' : (isCurrent ? 'var(--ivory)' : 'var(--ivory-dim)'), fontWeight: isCurrent ? 600 : 400, textDecoration: done ? 'line-through' : 'none' }}>
                    {task.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {content.currentTask && (
          <button type="button" onClick={handleCompleteCurrentTask} disabled={busy} className="btn btn-primary btn-block" style={{ padding: '15px 0', fontSize: 14 }}>
            {busy ? <span className="spinner" /> : 'تکمیل کار'}
          </button>
        )}
        {!content.currentTask && content.status === 'ready' && (
          <button type="button" onClick={handlePublish} disabled={busy} className="btn btn-primary btn-block" style={{ padding: '15px 0', fontSize: 14 }}>
            {busy ? <span className="spinner" /> : 'علامت‌گذاری به‌عنوان منتشرشده'}
          </button>
        )}
      </div>
    </div>
  );
}
