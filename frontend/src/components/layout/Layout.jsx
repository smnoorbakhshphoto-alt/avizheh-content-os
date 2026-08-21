import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  {
    to: '/today',
    label: 'امروز',
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m4 13 3-3 4 3 6-7 3 3" /><path d="M4 19h16" />
      </svg>
    ),
  },
  {
    to: '/calendar',
    label: 'تقویم',
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4.5" width="18" height="16" rx="3" /><path d="M3 9.5h18M8 3v3M16 3v3" />
      </svg>
    ),
  },
  {
    to: '/ideas',
    label: 'ایده‌ها',
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 3 4 6v6c0 5 3.8 7.7 8 9 4.2-1.3 8-4 8-9V6l-5.5-3-3-2Z" /><path d="M9.5 3 12 5l2.5-2" />
      </svg>
    ),
  },
  {
    to: '/more',
    label: 'بیشتر',
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function Layout() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink)', maxWidth: 480, margin: '0 auto', position: 'relative' }}>
      <div style={{ paddingBottom: 96 }}>
        <Outlet />
      </div>

      <button
        type="button"
        onClick={() => navigate('/new')}
        aria-label="محتوای جدید"
        style={{
          position: 'fixed', bottom: 66, left: '50%', transform: 'translateX(-50%)',
          width: 54, height: 54, borderRadius: '50%', border: 'none',
          background: 'linear-gradient(155deg,#DCB279,#B9863F)',
          boxShadow: '0 10px 24px rgba(199,154,91,0.4), 0 2px 6px rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, cursor: 'pointer',
        }}
      >
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#1B1310" strokeWidth="2.4" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>

      <nav
        style={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480,
          height: 82, background: 'rgba(31,23,20,0.94)', backdropFilter: 'blur(6px)',
          borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'flex-start', paddingTop: 12, zIndex: 15,
        }}
      >
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
              color: isActive ? 'var(--gold)' : 'var(--ivory-faint)', fontWeight: isActive ? 700 : 400,
            })}
          >
            {item.icon}
            <span style={{ fontSize: '10.5px' }}>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
