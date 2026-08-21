import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as contentApi from '../api/content';
import { useToast } from '../context/ToastContext';
import { typeMeta } from './contentTypes';

function dayKey(dateStr) { return new Date(dateStr).toDateString(); }
function dayLabel(dateStr) { return new Intl.DateTimeFormat('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(dateStr)); }

export default function Calendar() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    contentApi.listContent()
      .then((res) => setItems(res.data.filter((c) => c.scheduled_at)))
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}><div className="spinner" /></div>;

  const groups = [];
  for (const item of items) {
    const key = dayKey(item.scheduled_at);
    let group = groups.find((g) => g.key === key);
    if (!group) { group = { key, date: item.scheduled_at, items: [] }; groups.push(group); }
    group.items.push(item);
  }

  return (
    <div style={{ padding: '26px 20px 10px' }}>
      <div style={{ fontSize: 19, fontWeight: 800, marginBottom: 22 }}>تقویم</div>

      {groups.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--ivory-faint)', fontSize: 13.5 }}>هنوز محتوایی برنامه‌ریزی نشده.</div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {groups.map((group) => (
          <div key={group.key}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ivory-dim)', marginBottom: 10 }}>{dayLabel(group.date)}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {group.items.map((item) => {
                const meta = typeMeta(item.content_type);
                return (
                  <div key={item.id} onClick={() => navigate(`/content/${item.id}`)} className="flex" style={{ gap: 11, background: 'var(--ink-2)', border: '1px solid var(--line)', borderRadius: 12, padding: 13, cursor: 'pointer', alignItems: 'center' }}>
                    <div style={{ width: 30, height: 30, flexShrink: 0, borderRadius: 9, background: `${meta.color}29`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: meta.color }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700 }}>{item.title}</div>
                      <div className="flex" style={{ justifyContent: 'space-between', marginTop: 4 }}>
                        <span style={{ fontSize: 11.5, color: 'var(--ivory-faint)' }}>{new Date(item.scheduled_at).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })} · {item.assignee_name || 'بدون مسئول'}</span>
                        {item.status === 'ready' && <span style={{ fontSize: 10, background: 'var(--success-wash)', color: 'var(--success)', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>آماده</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
