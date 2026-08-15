import { useState, useEffect } from 'react';
import axios from 'axios';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Target } from 'lucide-react';

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [candidateName, setCandidateName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');


  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/jobs`, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        setJobs(res.data);
        if (res.data.length > 0) {
          setJobId(res.data[0]._id);
        }
      } catch (err) {
        console.error('Failed to fetch jobs', err);
      }
    };
    fetchJobs();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select a PDF file first.');
    
    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('candidateName', candidateName);
    formData.append('email', email);
    formData.append('phone', phone);
    if (jobId) formData.append('jobId', jobId);
    
    try {
      // Backend handles forwarding to ML API
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/resume/upload`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'x-auth-token': localStorage.getItem('token')
        }
      });
      setResult(res.data.resume);
      setFile(null);
      setCandidateName('');
      setEmail('');
      setPhone('');
    } catch (err) {
      setError('Error parsing resume. Make sure both Node Backend and Flask ML Service are running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="header">
        <div>
          <h1>Smart Resume Parsing</h1>
          <p style={{color: 'var(--text-secondary)'}}>Extract ML-driven insights from CVs</p>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="glass-card">
          <h2 style={{fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 600}}>Upload New Resume</h2>
          
          <form onSubmit={handleUpload}>
            <div style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)'}}>Target Job Role</label>
              <select value={jobId} onChange={e => setJobId(e.target.value)} required style={{width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(13, 17, 23, 0.5)', color: 'white'}}>
                {jobs.map(j => (
                  <option key={j._id} value={j._id}>{j.title}</option>
                ))}
              </select>
            </div>

            <div style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)'}}>Candidate Name</label>
              <input type="text" value={candidateName} onChange={e => setCandidateName(e.target.value)} required />
            </div>

            <div style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)'}}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <div style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)'}}>Phone Number</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
            </div>

            <div 
              style={{
                border: '2px dashed var(--glass-border)',
                borderRadius: '8px',
                padding: '2rem',
                textAlign: 'center',
                marginBottom: '1.5rem',
                background: file ? 'rgba(88, 166, 255, 0.05)' : 'transparent',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onClick={() => document.getElementById('fileUpload').click()}
            >
              {file ? (
                <>
                  <FileText size={48} color="var(--accent-color)" style={{marginBottom: '1rem'}} />
                  <p style={{fontWeight: 600, color: 'var(--accent-color)'}}>{file.name}</p>
                </>
              ) : (
                <>
                  <UploadCloud size={48} color="var(--text-secondary)" style={{marginBottom: '1rem'}} />
                  <p style={{color: 'var(--text-secondary)'}}>Click to browse or drag and drop PDF here</p>
                </>
              )}
              <input 
                id="fileUpload" 
                type="file" 
                accept="application/pdf" 
                style={{display: 'none'}} 
                onChange={(e) => setFile(e.target.files[0])} 
              />
            </div>

            {error && <div style={{color: 'var(--danger-color)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><AlertCircle size={16} />{error}</div>}

            <button type="submit" className="btn" disabled={loading} style={{width: '100%'}}>
              {loading ? (
                <>Processing with NLP AI...</>
              ) : (
                <>Extract Data & Analyze</>
              )}
            </button>
          </form>
        </div>

        <div>
          {result ? (
            <div className="glass-card fade-in" style={{border: '1px solid var(--accent-color)', boxShadow: '0 0 20px rgba(88, 166, 255, 0.2)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem'}}>
                <CheckCircle color="var(--success-color)" size={24} />
                <h2 style={{fontSize: '1.25rem', fontWeight: 600}}>AI Extraction Results</h2>
              </div>
              
              <div style={{background: 'rgba(13, 17, 23, 0.5)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem'}}>
                <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>AI-Matched Score</p>
                <div style={{fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent-color)'}}>{result.matchScore}%</div>
              </div>

              <div className="grid grid-cols-2" style={{gap: '1rem', marginBottom: '1.5rem'}}>
                <div>
                  <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>Extracted Experience</p>
                  <p style={{fontWeight: 600}}>{result.experience}</p>
                </div>
                <div>
                  <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>Education Level</p>
                  <p style={{fontWeight: 600}}>{result.education}</p>
                </div>
              </div>

              <div>
                <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem'}}>Detected Skills (NER)</p>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
                  {result.skills.map((skill, i) => (
                    <span key={i} className="badge" style={{background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)'}}>{skill}</span>
                  ))}
                  {result.skills.length === 0 && <span style={{color: 'var(--text-secondary)'}}>No skills detected</span>}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card" style={{height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', borderStyle: 'dashed'}}>
              <div style={{width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem'}}>
                <Target size={32} color="var(--text-secondary)" />
              </div>
              <h3 style={{marginBottom: '0.5rem', fontWeight: 600}}>No results yet</h3>
              <p style={{color: 'var(--text-secondary)', maxWidth: '250px'}}>Upload a resume to see AI-driven NLP parsing and TF-IDF matching score here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadResume;
