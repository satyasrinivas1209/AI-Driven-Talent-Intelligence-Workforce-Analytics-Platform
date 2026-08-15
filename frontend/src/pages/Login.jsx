import { useState } from 'react';
import axios from 'axios';
import { User, Lock, ExternalLink, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/';
    } catch (err) {
      console.error('Login failed', err);
      alert('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color-main)' }}>
      <div className="glass-card fade-in" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--accent-color)', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ExternalLink size={32} color="white" />
        </div>
        <h1 style={{ marginBottom: '0.5rem', fontWeight: 700 }}>TalentAI OS</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Sign in to the analytics portal</p>

        <form onSubmit={handleLogin}>
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <User size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: 14, top: 16 }} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          <div style={{ position: 'relative', marginBottom: '2rem' }}>
            <Lock size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: 14, top: 16 }} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
            />
            <div 
              style={{ position: 'absolute', right: 14, top: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} color="var(--text-secondary)" /> : <Eye size={18} color="var(--text-secondary)" />}
            </div>
          </div>

          <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In securely'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;
