import { useState, useEffect } from 'react';
import { Mail, RefreshCw, Link2, CheckCircle, AlertCircle, Search, Download, ChevronUp, ChevronDown } from 'lucide-react';

const API = `${import.meta.env.VITE_API_URL}/email`;

const StatusBadge = ({ score }) => {
  const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';
  const label = score >= 70 ? 'Strong' : score >= 40 ? 'Moderate' : 'Weak';
  return (
    <span style={{
      padding: '2px 10px', borderRadius: 20, fontSize: '0.75rem',
      fontWeight: 700, background: color + '20', color,
    }}>{label} ({score}%)</span>
  );
};

const EmailApplications = () => {
  const [status, setStatus] = useState({ connected: false, authUrl: null });
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [limit, setLimit] = useState(20);
  const [error, setError] = useState('');

  useEffect(() => {
    checkStatus();
    // Handle redirect back from OAuth
    const params = new URLSearchParams(window.location.search);
    if (params.get('connected') === 'true') fetchEmails();
  }, []);

  const checkStatus = async () => {
    try {
      const res = await fetch(`${API}/status`);
      const data = await res.json();
      setStatus(data);
      if (data.connected) fetchEmails();
    } catch { setError('Cannot reach backend server.'); }
  };

  const fetchEmails = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/fetch?limit=${limit}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setEmails(data.emails || []);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronUp size={14} style={{ opacity: 0.3 }} />;
    return sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const filtered = emails
    .filter(e => {
      const q = search.toLowerCase();
      return (
        e.from?.toLowerCase().includes(q) ||
        e.subject?.toLowerCase().includes(q) ||
        e.parsedResume?.skills?.some(s => s.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      let va = a[sortField] ?? '', vb = b[sortField] ?? '';
      if (sortField === 'matchScore') {
        va = a.parsedResume?.matchScore ?? 0;
        vb = b.parsedResume?.matchScore ?? 0;
      }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const exportCSV = () => {
    const rows = [
      ['From', 'Subject', 'Date', 'Skills', 'Experience', 'Education', 'Match Score'],
      ...filtered.map(e => [
        e.from, e.subject, e.date,
        (e.parsedResume?.skills || []).join('; '),
        e.parsedResume?.experience || 'N/A',
        e.parsedResume?.education || 'N/A',
        e.parsedResume?.matchScore ?? 'N/A',
      ]),
    ];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'email_applications.csv'; a.click();
  };

  return (
    <div style={{ padding: '2rem 4rem', fontFamily: 'Inter, sans-serif', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Mail size={28} style={{ color: 'var(--accent-color)' }} /> Email Applications
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.9rem' }}>
            Fetch resumes from Gmail and rank candidates automatically
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {status.connected ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success-color)', fontWeight: 600, fontSize: '0.85rem' }}>
              <CheckCircle size={16} /> Gmail Connected
            </span>
          ) : (
            <a href={status.authUrl} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--accent-color)', color: 'white', padding: '0.6rem 1.2rem',
              borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem',
            }}>
              <Link2 size={16} /> Connect Gmail
            </a>
          )}
          {status.connected && (
            <button onClick={fetchEmails} disabled={loading} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--bg-color-card)', border: '1px solid var(--glass-border)', padding: '0.6rem 1.2rem',
              borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)'
            }}>
              <RefreshCw size={16} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              {loading ? 'Fetching...' : 'Refresh'}
            </button>
          )}
          {emails.length > 0 && (
            <button onClick={exportCSV} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--success-color)', color: 'white', border: 'none',
              padding: '0.6rem 1.2rem', borderRadius: 10, cursor: 'pointer',
              fontWeight: 600, fontSize: '0.85rem',
            }}>
              <Download size={16} /> Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger-color)', borderRadius: 10, padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--danger-color)' }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* Not connected */}
      {!status.connected && !error && (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'var(--bg-color-card)', borderRadius: 16, border: '2px dashed var(--glass-border)' }}>
          <Mail size={56} style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>Connect Your Gmail Account</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: 400, margin: '0.5rem auto 1.5rem' }}>
            Link your Gmail to automatically fetch job application emails and AI-parse attached resumes.
          </p>
          <a href={status.authUrl} style={{
            background: 'var(--accent-color)', color: 'white', padding: '0.75rem 2rem',
            borderRadius: 10, textDecoration: 'none', fontWeight: 700,
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <Link2 size={18} /> Connect Gmail Account
          </a>
        </div>
      )}

      {/* Controls */}
      {status.connected && (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by sender, subject or skills..."
              style={{
                width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.25rem',
                borderRadius: 10, border: '1.5px solid var(--glass-border)', background: 'var(--bg-color-card)', color: 'var(--text-primary)',
                fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          <select value={limit} onChange={e => { setLimit(+e.target.value); fetchEmails(); }}
            style={{ padding: '0.65rem 1rem', borderRadius: 10, border: '1.5px solid var(--glass-border)', background: 'var(--bg-color-card)', color: 'var(--text-primary)', fontSize: '0.9rem', cursor: 'pointer' }}>
            <option value={10}>Last 10</option>
            <option value={20}>Last 20</option>
            <option value={50}>Last 50</option>
          </select>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Table */}
      {status.connected && emails.length > 0 && (
        <div style={{ background: 'var(--bg-color-card)', borderRadius: 16, border: '1px solid var(--glass-border)', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--glass-border)' }}>
                  {[
                    { label: 'Sender', field: 'from' },
                    { label: 'Subject', field: 'subject' },
                    { label: 'Date', field: 'date' },
                    { label: 'Skills Extracted', field: null },
                    { label: 'Experience', field: null },
                    { label: 'Education', field: null },
                    { label: 'Match Score', field: 'matchScore' },
                    { label: 'Attachments', field: null },
                  ].map(({ label, field }) => (
                    <th key={label} onClick={() => field && handleSort(field)}
                      style={{
                        padding: '1rem 1.25rem', textAlign: 'left', fontWeight: 700,
                        fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em',
                        color: 'var(--text-secondary)', cursor: field ? 'pointer' : 'default',
                        userSelect: 'none', whiteSpace: 'nowrap',
                      }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        {label} {field && <SortIcon field={field} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((email, i) => (
                  <tr key={email.id} style={{ borderBottom: '1px solid var(--glass-border)', background: 'transparent', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '1rem 1.25rem', maxWidth: 180 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {email.from?.replace(/<.*>/, '').trim() || 'Unknown'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {email.from?.match(/<(.+)>/)?.[1] || email.from}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', maxWidth: 220 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>
                        {email.subject || '(No Subject)'}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                      {email.date ? new Date(email.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', maxWidth: 200 }}>
                      {email.parsedResume?.skills?.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {email.parsedResume.skills.slice(0, 4).map(s => (
                            <span key={s} style={{ background: 'rgba(109, 40, 217, 0.1)', color: 'var(--accent-color)', padding: '2px 8px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 600 }}>
                              {s}
                            </span>
                          ))}
                          {email.parsedResume.skills.length > 4 && (
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>+{email.parsedResume.skills.length - 4} more</span>
                          )}
                        </div>
                      ) : <span style={{ color: 'var(--text-secondary)' }}>No resume parsed</span>}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>
                      {email.parsedResume?.experience || <span style={{ color: 'var(--text-secondary)' }}>N/A</span>}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>
                      {email.parsedResume?.education || <span style={{ color: 'var(--text-secondary)' }}>N/A</span>}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      {email.parsedResume?.matchScore != null
                        ? <StatusBadge score={email.parsedResume.matchScore} />
                        : <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>No attachment</span>}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      {email.attachments?.length > 0
                        ? email.attachments.map(a => (
                          <div key={a.attachmentId} style={{ fontSize: '0.75rem', color: 'var(--accent-color)', fontWeight: 600 }}>📎 {a.filename}</div>
                        ))
                        : <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>None</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty state */}
      {status.connected && !loading && emails.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-color-card)', borderRadius: 16, border: '2px dashed var(--glass-border)' }}>
          <Mail size={48} style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--text-primary)', fontWeight: 700 }}>No Application Emails Found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>No emails with resume attachments matching job application keywords were found.</p>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default EmailApplications;
