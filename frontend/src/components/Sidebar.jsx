import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, TrendingDown, LogOut, Settings, BarChart2, Mail } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="sidebar" style={{ background: '#ffffff', color: '#1e293b' }}>
      <div style={{ padding: '1rem 0', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#151e5e', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#151e5e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            T
          </div>
          TalentAI
        </h2>
      </div>

      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem', paddingLeft: '1rem' }}>Principal</p>
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link to="/candidates" className={`nav-link ${location.pathname === '/candidates' ? 'active' : ''}`}>
          <BarChart2 size={20} /> Talent Ranking
        </Link>
        <Link to="/upload" className={`nav-link ${location.pathname === '/upload' ? 'active' : ''}`}>
          <UserPlus size={20} /> Upload Resume
        </Link>
        <Link to="/attrition" className={`nav-link ${location.pathname === '/attrition' ? 'active' : ''}`}>
          <TrendingDown size={20} /> Attrition Predictor
        </Link>
        <Link to="/email-applications" className={`nav-link ${location.pathname === '/email-applications' ? 'active' : ''}`}>
          <Mail size={20} /> Email Applications
        </Link>


      </div>

      <div style={{ marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
        <button className="nav-link" onClick={handleLogout} style={{ background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', color: '#ef4444' }}>
          <LogOut size={20} /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
