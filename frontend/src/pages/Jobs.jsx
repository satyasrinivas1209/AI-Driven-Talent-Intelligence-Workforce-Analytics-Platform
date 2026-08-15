import { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requiredSkills: '',
    isActive: true
  });

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/jobs`, {
        headers: { 'x-auth-token': token }
      });
      setJobs(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleOpenModal = (job = null) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        title: job.title,
        description: job.description,
        requiredSkills: job.requiredSkills.join(', '),
        isActive: job.isActive
      });
    } else {
      setEditingJob(null);
      setFormData({ title: '', description: '', requiredSkills: '', isActive: true });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const payload = {
      ...formData,
      requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s)
    };

    try {
      if (editingJob) {
        await axios.put(`${import.meta.env.VITE_API_URL}/jobs/${editingJob._id}`, payload, {
          headers: { 'x-auth-token': token }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/jobs`, payload, {
          headers: { 'x-auth-token': token }
        });
      }
      fetchJobs();
      handleCloseModal();
    } catch (err) {
      alert('Failed to save job posting');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/jobs/${id}`, {
        headers: { 'x-auth-token': token }
      });
      fetchJobs();
    } catch (err) {
      alert('Failed to delete job posting');
    }
  };

  if (loading) return <div style={{ padding: '2rem 4rem' }}>Loading jobs...</div>;

  return (
    <div style={{ padding: '2rem 4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Briefcase color="var(--accent-color)" /> Job Postings
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage active roles for matching algorithms</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          style={{ background: 'var(--accent-color)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}
        >
          <Plus size={18} /> Create Job
        </button>
      </div>

      <div style={{ background: 'var(--bg-color-card)', borderRadius: '12px', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--glass-border)' }}>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Title</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Required Skills</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '1rem', fontWeight: 500 }}>{job.title}</td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {job.requiredSkills.slice(0, 4).map(s => (
                      <span key={s} style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>{s}</span>
                    ))}
                    {job.requiredSkills.length > 4 && <span style={{ fontSize: '0.75rem', padding: '2px 4px' }}>+{job.requiredSkills.length - 4}</span>}
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  {job.isActive ? 
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--success-color)', fontSize: '0.85rem' }}><CheckCircle size={14} /> Active</span> :
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--danger-color)', fontSize: '0.85rem' }}><XCircle size={14} /> Closed</span>
                  }
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button onClick={() => handleOpenModal(job)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', marginRight: '1rem' }}><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(job._id)} style={{ background: 'transparent', border: 'none', color: 'var(--danger-color)', cursor: 'pointer' }}><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No jobs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-color-card)', padding: '2rem', borderRadius: '12px', width: '500px', border: '1px solid var(--glass-border)' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>{editingJob ? 'Edit Job Posting' : 'Create Job Posting'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Job Title</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  required 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  required 
                  rows="3"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Required Skills (comma separated)</label>
                <input 
                  type="text" 
                  value={formData.requiredSkills} 
                  onChange={e => setFormData({...formData, requiredSkills: e.target.value})} 
                  placeholder="e.g. React, Node.js, Python"
                  required 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                />
              </div>
              <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  id="isActive"
                  checked={formData.isActive} 
                  onChange={e => setFormData({...formData, isActive: e.target.checked})} 
                />
                <label htmlFor="isActive" style={{ fontSize: '0.9rem' }}>Active Posting</label>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={handleCloseModal} style={{ background: 'transparent', color: 'white', border: '1px solid var(--glass-border)', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ background: 'var(--accent-color)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>{editingJob ? 'Update Job' : 'Create Job'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
