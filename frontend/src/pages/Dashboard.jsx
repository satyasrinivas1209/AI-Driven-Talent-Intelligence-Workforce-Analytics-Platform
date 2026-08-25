import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Users, TrendingDown, Target, Zap } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCandidates: 0,
    shortlisted: 0,
    avgMatchScore: 0,
    totalSkills: 0
  });
  
  const [matchScoreData, setMatchScoreData] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/resume`);
        
        const resumes = res.data;
        const total = resumes.length;
        const shortlisted = resumes.filter(r => r.status === 'Shortlisted').length;
        const totalScore = resumes.reduce((acc, r) => acc + (r.matchScore || 0), 0);
        const avgScore = total > 0 ? Math.round(totalScore / total) : 0;
        
        const extractedSkills = resumes.reduce((acc, r) => acc + (r.skills ? r.skills.length : 0), 0);
        
        setStats(prev => ({
          ...prev,
          totalCandidates: total,
          shortlisted: shortlisted,
          avgMatchScore: avgScore,
          totalSkills: extractedSkills
        }));

        // Calculate Match Score Distribution
        const scoreRanges = { '0-20': 0, '21-40': 0, '41-60': 0, '61-80': 0, '81-100': 0 };
        resumes.forEach(r => {
          const s = r.matchScore || 0;
          if (s <= 20) scoreRanges['0-20']++;
          else if (s <= 40) scoreRanges['21-40']++;
          else if (s <= 60) scoreRanges['41-60']++;
          else if (s <= 80) scoreRanges['61-80']++;
          else scoreRanges['81-100']++;
        });

        setMatchScoreData({
          labels: Object.keys(scoreRanges),
          datasets: [{
            label: 'Number of Candidates',
            data: Object.values(scoreRanges),
            backgroundColor: 'rgba(88, 166, 255, 0.8)',
            borderRadius: 4
          }]
        });

        // Calculate Status Distribution
        const statuses = {};
        resumes.forEach(r => {
          const st = r.status || 'Applied';
          statuses[st] = (statuses[st] || 0) + 1;
        });

        const bgColors = ['rgba(88, 166, 255, 0.8)', 'rgba(46, 160, 67, 0.8)', 'rgba(248, 81, 73, 0.8)', 'rgba(210, 153, 34, 0.8)'];

        setStatusData({
          labels: Object.keys(statuses),
          datasets: [{
            data: Object.values(statuses),
            backgroundColor: Object.keys(statuses).map((_, i) => bgColors[i % bgColors.length]),
            borderWidth: 0,
          }]
        });

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#64748b' } },
      title: { display: false }
    },
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(0,0,0,0.05)' } },
      y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(0,0,0,0.05)' } }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#64748b' } }
    },
    cutout: '70%'
  };

  if (loading) return <div style={{ padding: '2rem 4rem', fontSize: '1.2rem' }}>Loading dashboard...</div>;

  return (
    <div>
      <div className="header">
        <div>
          <h1>Talent Intelligence Overview</h1>
          <p style={{ color: 'var(--text-secondary)' }}>AI-driven metrics and workforce analytics</p>
        </div>
      </div>

      <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
        <div className="glass-card fade-in" style={{ animationDelay: '0.1s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Candidates Analyzed</p>
              <h2 style={{ fontSize: '2rem' }}>{stats.totalCandidates}</h2>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(88, 166, 255, 0.1)', borderRadius: '12px' }}>
              <Users color="var(--accent-color)" size={24} />
            </div>
          </div>
        </div>

        <div className="glass-card fade-in" style={{ animationDelay: '0.2s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Candidates Shortlisted</p>
              <h2 style={{ fontSize: '2rem' }}>{stats.shortlisted}</h2>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(46, 160, 67, 0.1)', borderRadius: '12px' }}>
              <Target color="var(--success-color)" size={24} />
            </div>
          </div>
          <div style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            {stats.totalCandidates > 0 ? Math.round((stats.shortlisted / stats.totalCandidates) * 100) : 0}% acceptance rate
          </div>
        </div>

        <div className="glass-card fade-in" style={{ animationDelay: '0.3s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Average Match Score</p>
              <h2 style={{ fontSize: '2rem' }}>{stats.avgMatchScore}%</h2>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(248, 81, 73, 0.1)', borderRadius: '12px' }}>
              <TrendingDown color="var(--danger-color)" size={24} />
            </div>
          </div>
          <div style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Across all roles
          </div>
        </div>

        <div className="glass-card fade-in" style={{ animationDelay: '0.4s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Skills Extracted</p>
              <h2 style={{ fontSize: '2rem' }}>{stats.totalSkills}</h2>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(210, 153, 34, 0.1)', borderRadius: '12px' }}>
              <Zap color="#d29922" size={24} />
            </div>
          </div>
          <div style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            From parsed resumes
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="glass-card fade-in" style={{ height: '400px' }}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Candidate Match Score Distribution</h3>
          <div style={{ height: '300px' }}>
            {matchScoreData && <Bar data={matchScoreData} options={options} />}
          </div>
        </div>

        <div className="glass-card fade-in" style={{ height: '400px' }}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Candidate Status Distribution</h3>
          <div style={{ height: '300px' }}>
            {statusData && <Doughnut data={statusData} options={doughnutOptions} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
