import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as contentApi from '../api/content';
import { useToast } from '../context/ToastContext';

const STATUS_LABEL = { new: 'جدید', converted: 'تبدیل شد', archived: 'بایگانی' };

export default function Ideas() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  function load() {
    contentApi.listIdeas()
      .then((res) => setIdeas(res.data))
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      await contentApi.createIdea(title.trim());
      setTitle('');
      showToast('ایده ثبت شد.', 'success');
      load();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ padding: '26px 20px 10px' }}>
      <div className="display" style={{ fontSize: 25, color: 'var(--ivory)', marginBottom: 4 }}>چه ایده‌ای داری؟</div>
      <div style={{ fontSize: 12.5, color: 'var(--ivory-faint)', marginBottom: 20 }}>هر چیزی به ذهنت رسید، همین‌جا ثبتش کن.</div>

      <form onSubmit={handleSubmit} style={{ background: 'var(--ink-2)', border: '1px solid var(--line-2)', borderRadius: 14, padding: 16, marginBottom: 26 }}>
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="مثلاً: یه ریلز درباره‌ی نگهداری از آلبوم چاپی..."
          rows={2}
          style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', resize: 'none', color: 'var(--ivory)', fontFamily: 'inherit', fontSize: 13, marginBottom: 12 }}
        />
        <div className="flex" style={{ justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary btn-sm" disabled={saving || !title.trim()}>
            {saving ? <span className="spinner" /> : '+ ثبت ایده'}
          </button>
        </div>
      </form>

      {loading && <div className="flex items-center justify-center" style={{ minHeight: 200 }}><div className="spinner" /></div>}

      {!loading && ideas.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--ivory-faint)', fontSize: 13.5 }}>
          هنوز ایده‌ای ثبت نشده. اولین ایده‌ات را ثبت کن.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {ideas.map((idea) => {
          const converted = idea.status === 'converted';
          return (
            <div key={idea.id} style={{ background: 'var(--ink-2)', border: '1px solid var(--line)', borderRadius: 13, padding: 15, opacity: converted ? 0.55 : 1 }}>
              <div style={{ fontSize: 14, lineHeight: 1.7, color: converted ? 'var(--ivory-dim)' : 'var(--ivory)', marginBottom: 12 }}>{idea.title}</div>
              <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--ivory-faint)' }}>{idea.created_by_name} · {new Date(idea.created_at).toLocaleDateString('fa-IR')}</span>
                {converted ? (
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--success)' }}>{STATUS_LABEL[idea.status]}</span>
                ) : (
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/new', { state: { ideaId: idea.id, title: idea.title } })}>
                    تبدیل به محتوا
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
