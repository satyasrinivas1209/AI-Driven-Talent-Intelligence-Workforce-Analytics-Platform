import { FileQuestion } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '60vh', textAlign: 'center' }} className="fade-in">
      <div style={{ padding: '2rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '50%', marginBottom: '2rem' }}>
        <FileQuestion size={64} color="var(--text-secondary)" />
      </div>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px' }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <button className="btn">Return to Dashboard</button>
      </Link>
    </div>
  );
};

export default NotFound;
