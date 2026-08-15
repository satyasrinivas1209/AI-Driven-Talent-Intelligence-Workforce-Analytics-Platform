import { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, FileText, Check, X, Filter, Search, Download, Mail, Calendar, MapPin, TrendingUp, Users, ChevronDown, Share2, Zap, MessageSquare, Briefcase, Award } from 'lucide-react';

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtering & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('score_desc');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/resume`, {
          headers: { 'x-auth-token': token }
        });
        setCandidates(res.data);
        if (res.data.length > 0) {
          setSelectedCandidate(res.data[0]);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch candidates');
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  const updateStatus = async (status) => {
    const isDestructive = status === 'Rejected';
    if (!window.confirm(`Are you sure you want to mark this candidate as ${status}?${isDestructive ? ' This action cannot be easily undone.' : ''}`)) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${import.meta.env.VITE_API_URL}/resume/${selectedCandidate._id}/status`, { status }, { headers: { 'x-auth-token': token } });
      
      const updatedCandidate = { ...selectedCandidate, status };
      setSelectedCandidate(updatedCandidate);
      setCandidates(candidates.map(c => c._id === updatedCandidate._id ? updatedCandidate : c));
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) return <div style={{ padding: '2rem 4rem', fontSize: '1.2rem' }}>Loading candidates...</div>;
  if (error) return <div style={{ padding: '2rem 4rem', color: 'red' }}>{error}</div>;

  // Apply filters and sort
  let filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.candidateName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.skills?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'All' || (c.status || 'Applied') === filterStatus;
    return matchesSearch && matchesStatus;
  });

  filteredCandidates.sort((a, b) => {
    if (sortBy === 'score_desc') return (b.matchScore || 0) - (a.matchScore || 0);
    if (sortBy === 'score_asc') return (a.matchScore || 0) - (b.matchScore || 0);
    if (sortBy === 'name_asc') return (a.candidateName || '').localeCompare(b.candidateName || '');
    return 0;
  });

  return (
    <div style={{ padding: '2rem 4rem', background: 'var(--bg-color)', minHeight: '100vh', fontFamily: '"Inter", sans-serif', display: 'flex', gap: '2rem' }}>
      
      {/* LEFT SIDEBAR: List of Candidates */}
      <div style={{ width: '320px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1rem', height: 'calc(100vh - 4rem)', overflowY: 'auto', paddingRight: '10px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Talent Pool</h2>
        
        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
          <input 
            type="text" 
            placeholder="Search name or skills..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-color-card)', color: 'var(--text-primary)' }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select 
              value={filterStatus} 
              onChange={e => setFilterStatus(e.target.value)}
              style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-color-card)', color: 'var(--text-primary)' }}
            >
              <option value="All">All Status</option>
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)}
              style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-color-card)', color: 'var(--text-primary)' }}
            >
              <option value="score_desc">Highest Score</option>
              <option value="score_asc">Lowest Score</option>
              <option value="name_asc">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {filteredCandidates.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No candidates match criteria.</p>
        ) : (
          filteredCandidates.map(c => (
            <div 
              key={c._id} 
              onClick={() => setSelectedCandidate(c)}
              style={{ 
                background: selectedCandidate?._id === c._id ? '#e0e7ff' : 'white', 
                border: selectedCandidate?._id === c._id ? '1px solid #151e5e' : '1px solid #e2e8f0',
                padding: '1rem', 
                borderRadius: '1rem', 
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <h4 style={{ fontWeight: 800, color: '#1e293b', marginBottom: '0.25rem' }}>{c.candidateName || 'Unknown'}</h4>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>{c.email}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>{c.status || 'Applied'}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#151e5e' }}>Score: {c.matchScore}%</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MAIN VIEW: Selected Candidate Details */}
      <div style={{ flex: 1, overflowY: 'auto', height: 'calc(100vh - 4rem)', paddingRight: '1rem' }}>
        {selectedCandidate ? (
          <>
            {/* Breadcrumb & Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
              <div>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
                  Talent Pool / <span style={{ color: '#151e5e', fontWeight: 700 }}>{selectedCandidate.candidateName}</span>
                </p>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>{selectedCandidate.candidateName}</h1>
                <p style={{ fontSize: '1.1rem', color: '#64748b' }}>{selectedCandidate.email} • {selectedCandidate.phone}</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => updateStatus('Rejected')} style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '0.75rem 2rem', borderRadius: '0.75rem', fontWeight: 800, color: '#ef4444', cursor: 'pointer' }}>Reject</button>
                <button onClick={() => updateStatus('Shortlisted')} style={{ background: 'white', border: '1px solid #e2e8f0', padding: '0.75rem 2rem', borderRadius: '0.75rem', fontWeight: 800, color: '#1e293b', cursor: 'pointer' }}>Shortlist</button>
                <button onClick={() => updateStatus('Interviewing')} style={{ background: '#151e5e', color: 'white', border: 'none', padding: '0.75rem 2.5rem', borderRadius: '0.75rem', fontWeight: 800, cursor: 'pointer' }}>Schedule Interview</button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '2.5rem', marginBottom: '2.5rem' }}>
              
              {/* Profile Summary & Skill Matrix Row */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                
                <div style={{ background: 'white', padding: '3rem', borderRadius: '2rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', gap: '2.5rem', marginBottom: '2.5rem' }}>
                     <div style={{ width: '120px', height: '120px', borderRadius: '1.5rem', overflow: 'hidden', background: '#f1f5f9' }}>
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedCandidate.candidateName}`} alt="" style={{ width: '100%', height: '100%' }} />
                     </div>
                     <div style={{ flex: 1 }}>
                       {selectedCandidate.matchScore > 80 && (
                         <div style={{ background: '#e0e7ff', color: '#151e5e', fontSize: '0.65rem', fontWeight: 800, padding: '0.25rem 0.5rem', borderRadius: '4px', display: 'inline-block', marginBottom: '1rem' }}>HIGH INTENT</div>
                       )}
                       <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem' }}>Profile Summary</h3>
                       <p style={{ fontSize: '1.15rem', color: '#475569', fontStyle: 'italic', lineHeight: 1.6 }}>
                        AI Generated Summary: Based on the extracted skills and experience, this candidate has a {selectedCandidate.matchScore}% match for the current position requirements.
                       </p>
                     </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', paddingTop: '2.5rem', borderTop: '1px solid #f1f5f9' }}>
                     <div>
                       <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Experience</p>
                       <p style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>{selectedCandidate.experience}</p>
                     </div>
                     <div>
                       <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Education</p>
                       <p style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>{selectedCandidate.education}</p>
                     </div>
                     <div>
                       <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Status</p>
                       <p style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>{selectedCandidate.status}</p>
                     </div>
                  </div>
                </div>

                <div style={{ background: 'white', padding: '3rem', borderRadius: '2rem', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                     <Zap size={24} fill="#151e5e" /> Extracted Skills
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedCandidate.skills && selectedCandidate.skills.length > 0 ? (
                      selectedCandidate.skills.map((skill, index) => (
                        <span key={index} style={{ background: '#f1f5f9', color: '#334155', padding: '0.5rem 1rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: 600 }}>
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p style={{ color: '#94a3b8' }}>No skills extracted.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right AI & Insights Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                
                <div style={{ background: '#151e5e', padding: '3rem', borderRadius: '2rem', color: 'white' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Zap size={18} fill="white" /> AI VERDICT
                  </p>
                  <div style={{ marginBottom: '2.5rem' }}>
                    <div style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1 }}>{selectedCandidate.matchScore}%</div>
                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Overall Match Score</p>
                  </div>
                  
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>Key Strengths</p>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>Demonstrated proficiency in {selectedCandidate.skills && selectedCandidate.skills.slice(0, 3).join(', ')}.</p>
                  </div>
                </div>

                <div style={{ background: 'white', padding: '2.5rem', borderRadius: '2rem', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                     <MessageSquare size={20} /> Next Recommended Step
                  </h3>
                  <div style={{ background: '#f1f5f9', padding: '1.5rem', borderRadius: '1rem', marginBottom: '1.5rem' }}>
                     <p style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1e293b', marginBottom: '0.25rem' }}>Initial Screening</p>
                     <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Schedule a 15-min intro call to verify {selectedCandidate.experience} experience.</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
            <p>Select a candidate from the sidebar to view their full profile.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Candidates;
