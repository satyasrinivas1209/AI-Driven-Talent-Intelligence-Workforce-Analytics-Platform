import { useEffect, useState } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler } from 'chart.js';
import { Users, TrendingDown, Target, Zap } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCandidates: 142,
    shortlisted: 45,
    attritionRate: '12%',
    predictions: 18
  });

  // Mock data for charts
  const hiringData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Candidates Applied',
        data: [65, 59, 80, 81, 56, 142],
        backgroundColor: 'rgba(88, 166, 255, 0.8)',
        borderRadius: 4
      },
      {
        label: 'Hired',
        data: [12, 19, 15, 22, 14, 30],
        backgroundColor: 'rgba(46, 160, 67, 0.8)',
        borderRadius: 4
      }
    ]
  };

  const attritionData = {
    labels: ['Resigned', 'Retained'],
    datasets: [
      {
        data: [12, 88],
        backgroundColor: ['rgba(248, 81, 73, 0.8)', 'rgba(46, 160, 67, 0.8)'],
        borderWidth: 0,
      }
    ]
  };

  const performanceData = {
    labels: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'],
    datasets: [
      {
        label: 'Avg Performance Score/10',
        data: [8.5, 7.2, 8.8, 8.0, 9.1],
        borderColor: '#58a6ff',
        backgroundColor: 'rgba(88, 166, 255, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

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
          <div style={{ marginTop: '1rem', color: 'var(--success-color)', fontSize: '0.85rem', fontWeight: 600 }}>
            +24% from last month
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
            31% acceptance rate
          </div>
        </div>

        <div className="glass-card fade-in" style={{ animationDelay: '0.3s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Predicted Attrition Rate</p>
              <h2 style={{ fontSize: '2rem' }}>{stats.attritionRate}</h2>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(248, 81, 73, 0.1)', borderRadius: '12px' }}>
              <TrendingDown color="var(--danger-color)" size={24} />
            </div>
          </div>
          <div style={{ marginTop: '1rem', color: 'var(--danger-color)', fontSize: '0.85rem', fontWeight: 600 }}>
            Warning: Up 2%
          </div>
        </div>

        <div className="glass-card fade-in" style={{ animationDelay: '0.4s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>ML Predictions Run</p>
              <h2 style={{ fontSize: '2rem' }}>{stats.predictions}k</h2>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(210, 153, 34, 0.1)', borderRadius: '12px' }}>
              <Zap color="#d29922" size={24} />
            </div>
          </div>
          <div style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Across 5 models
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3">
        <div className="glass-card fade-in" style={{ gridColumn: 'span 2', height: '400px' }}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Hiring Pipeline Analytics & Match Score</h3>
          <div style={{ height: '300px' }}>
            <Bar data={hiringData} options={options} />
          </div>
        </div>

        <div className="glass-card fade-in" style={{ height: '400px' }}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Workforce Attrition Risk</h3>
          <div style={{ height: '300px' }}>
            <Doughnut data={attritionData} options={doughnutOptions} />
          </div>
        </div>

        <div className="glass-card fade-in" style={{ gridColumn: 'span 3', height: '400px' }}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Departmental Performance Prediction (Regression)</h3>
          <div style={{ height: '300px' }}>
            <Line data={performanceData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
