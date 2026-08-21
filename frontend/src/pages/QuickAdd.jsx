import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as contentApi from '../api/content';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CONTENT_TYPES } from './contentTypes';

const DATE_OPTIONS = [
  { key: 'today', label: 'امروز', days: 0 },
  { key: 'tomorrow', label: 'فردا', days: 1 },
  { key: 'week', label: 'این هفته', days: 5 },
];

function dateFor(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

export default function QuickAdd() {
  const { member } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const ideaId = location.state?.ideaId || null;

  const [contentType, setContentType] = useState('reel');
  const [title, setTitle] = useState(location.state?.title || '');
  const [dateKey, setDateKey] = useState('today');
  const [team, setTeam] = useState([]);
  const [assigneeId, setAssigneeId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    contentApi.getTeam()
      .then((res) => {
        setTeam(res.data);
        setAssigneeId(member?.id || res.data[0]?.id || null);
      })
      .catch((err) => showToast(err.message, 'error'));
  }, []);

  async function handleSubmit() {
    if (!title.trim()) { showToast('موضوع محتوا را وارد کن.', 'error'); return; }
    setSaving(true);
    try {
      const opt = DATE_OPTIONS.find((o) => o.key === dateKey);
      const res = await contentApi.createContent({
        title: title.trim(),
        contentType,
        scheduledAt: dateFor(opt.days).toISOString(),
        assigneeId,
        ideaId,
      });
      showToast('محتوا ساخته شد.', 'success');
      navigate(`/content/${res.data.id}`, { replace: true });
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink)', maxWidth: 480, margin: '0 auto' }}>
    <div style={{ padding: '24px 20px 40px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 17, fontWeight: 800 }}>محتوای جدید</span>
        <button type="button" onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--ivory-dim)', cursor: 'pointer' }}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
      </div>

      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ivory-dim)', marginBottom: 10 }}>نوع محتوا</div>
        <div className="flex" style={{ gap: 8, overflowX: 'auto' }}>
          {CONTENT_TYPES.map((t) => {
            const active = contentType === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setContentType(t.value)}
                className="flex"
                style={{
                  gap: 6, flexShrink: 0, alignItems: 'center', borderRadius: 10, padding: '9px 14px', cursor: 'pointer',
                  background: active ? `${t.color}29` : 'var(--ink-2)',
                  border: active ? `1.5px solid ${t.color}` : '1px solid var(--line)',
                  color: active ? 'var(--ivory)' : 'var(--ivory-dim)', fontSize: 12.5, fontWeight: active ? 700 : 400,
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: t.color }} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ivory-dim)', marginBottom: 10 }}>موضوع</div>
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="مثلاً: ریلز لوکیشن عروسی سارا و امید"
          rows={2}
          autoFocus
          style={{ width: '100%', background: 'var(--ink-2)', border: '1px solid var(--line-2)', borderRadius: 11, padding: '14px 16px', color: 'var(--ivory)', fontFamily: 'inherit', fontSize: 13.5, resize: 'none', outline: 'none' }}
        />
      </div>

      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ivory-dim)', marginBottom: 10 }}>چه زمانی؟</div>
        <div className="flex" style={{ gap: 8 }}>
          {DATE_OPTIONS.map((opt) => {
            const active = dateKey === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => setDateKey(opt.key)}
                style={{
                  flex: 1, textAlign: 'center', borderRadius: 10, padding: '11px 0', fontSize: 12.5, cursor: 'pointer',
                  background: active ? 'var(--gold)' : 'var(--ink-2)',
                  border: active ? 'none' : '1px solid var(--line)',
                  color: active ? 'var(--ink)' : 'var(--ivory-dim)', fontWeight: active ? 700 : 400,
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ivory-dim)', marginBottom: 10 }}>مسئول</div>
        <div className="flex" style={{ gap: 10 }}>
          {team.map((teamMember) => {
            const active = assigneeId === teamMember.id;
            return (
              <button key={teamMember.id} type="button" onClick={() => setAssigneeId(teamMember.id)} style={{ textAlign: 'center', background: 'none', border: 'none', cursor: 'pointer' }}>
                <div style={{
                  width: 46, height: 46, borderRadius: '50%', background: 'var(--gold)', color: 'var(--ink)',
                  fontSize: 15, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 6, opacity: active ? 1 : 0.55, border: active ? '2px solid var(--ivory)' : 'none',
                }}>
                  {teamMember.full_name?.[0]}
                </div>
                <span style={{ fontSize: 10.5, color: active ? 'var(--ivory)' : 'var(--ivory-faint)', fontWeight: active ? 600 : 400 }}>
                  {teamMember.id === member?.id ? 'خودم' : teamMember.full_name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <button type="button" onClick={handleSubmit} disabled={saving} className="btn btn-primary btn-block" style={{ marginTop: 8, padding: '15px 0', fontSize: 14 }}>
        {saving ? <span className="spinner" /> : 'ساخت محتوا'}
      </button>
    </div>
    </div>
  );
}
