import { Bell, Search, UserCircle } from 'lucide-react';

const Topbar = () => {
  return (
    <div className="header" style={{ background: 'var(--bg-color-card)', padding: '1rem 2rem', borderRadius: '12px', backdropFilter: 'blur(12px)', border: '1px solid var(--glass-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '300px' }}>
        <Search size={20} color="var(--text-secondary)" />
        <input
          type="text"
          placeholder="Search candidates, jobs..."
          style={{ margin: 0, padding: '0.5rem', background: 'transparent', border: 'none', color: 'white' }}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <Bell size={24} color="var(--text-secondary)" />
          <span style={{ position: 'absolute', top: -2, right: -2, width: 10, height: 10, background: 'var(--danger-color)', borderRadius: '50%' }}></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Admin User</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>HR Manager</div>
          </div>
          <UserCircle size={36} color="var(--accent-color)" />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
