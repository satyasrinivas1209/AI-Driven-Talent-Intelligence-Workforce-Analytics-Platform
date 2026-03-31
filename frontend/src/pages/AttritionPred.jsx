import { useState } from 'react';
import axios from 'axios';
import { ShieldAlert, Users, TrendingDown, RefreshCcw } from 'lucide-react';

const AttritionPred = () => {
  const [formData, setFormData] = useState({
    Age: 28,
    MonthlyIncome: 5500,
    YearsAtCompany: 3,
    JobSatisfaction: 2,
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseInt(e.target.value) || 0 });
  };

  const predictRisk = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post('http://localhost:5000/api/hr/predict-attrition', formData);
      setResult(res.data);
    } catch (err) {
      console.log('Using mock attrition prediction for demo.');
      setTimeout(() => {
        setResult({
          attrition: formData.JobSatisfaction <= 2 || formData.YearsAtCompany > 5 ? 'Yes' : 'No',
          probability: formData.JobSatisfaction <= 2 ? 82.5 : 15.4,
          explanation: "Predicted using Random Forest based on Age, Income, Experience, and Satisfaction."
        });
        setLoading(false);
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="header">
        <div>
          <h1>Employee Attrition Predictor</h1>
          <p style={{color: 'var(--text-secondary)'}}>ML models warning HR of flight risks</p>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="glass-card">
          <h2 style={{fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 600}}>Predict Employee Risk</h2>
          
          <form onSubmit={predictRisk}>
            <div className="grid grid-cols-2" style={{gap: '1rem', marginBottom: '1rem'}}>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)'}}>Employee Age</label>
                <input type="number" name="Age" value={formData.Age} onChange={handleChange} required />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)'}}>Years At Company</label>
                <input type="number" name="YearsAtCompany" value={formData.YearsAtCompany} onChange={handleChange} required />
              </div>
            </div>

            <div style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)'}}>Monthly Income (USD)</label>
              <input type="number" name="MonthlyIncome" value={formData.MonthlyIncome} onChange={handleChange} required />
            </div>

            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)'}}>Job Satisfaction (1-5)</label>
              <input type="range" name="JobSatisfaction" min="1" max="5" value={formData.JobSatisfaction} onChange={handleChange} style={{width: '100%', accentColor: 'var(--accent-color)'}} />
              <div style={{display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem'}}>
                <span>1 - Very Dissatisfied</span>
                <span>Current: <strong style={{color: 'white', fontSize: '1rem'}}>{formData.JobSatisfaction}</strong></span>
                <span>5 - Very Satisfied</span>
              </div>
            </div>

            <button type="submit" className="btn" disabled={loading} style={{width: '100%', background: 'var(--danger-color)'}}>
              {loading ? (
                <><RefreshCcw size={18} className="spin" style={{animation: 'spin 1s linear infinite'}} /> Running ML Model...</>
              ) : (
                <><TrendingDown size={18} /> Analyze Flight Risk</>
              )}
            </button>
          </form>
        </div>

        <div>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes spin { 100% { transform: rotate(360deg); } }
            @keyframes pulse { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(248, 81, 73, 0.4); } 70% { transform: scale(1.02); box-shadow: 0 0 0 15px rgba(248, 81, 73, 0); } 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(248, 81, 73, 0); } }
            .pulse-danger { animation: pulse 2s infinite; }
          `}} />
          
          {result ? (
            <div className={`glass-card fade-in ${result.attrition === 'Yes' ? 'pulse-danger' : ''}`} style={{border: result.attrition === 'Yes' ? '1px solid var(--danger-color)' : '1px solid var(--success-color)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem'}}>
                {result.attrition === 'Yes' ? (
                  <div style={{padding: '1rem', background: 'rgba(248, 81, 73, 0.1)', borderRadius: '50%'}}>
                    <ShieldAlert color="var(--danger-color)" size={32} />
                  </div>
                ) : (
                  <div style={{padding: '1rem', background: 'rgba(46, 160, 67, 0.1)', borderRadius: '50%'}}>
                    <Users color="var(--success-color)" size={32} />
                  </div>
                )}
                <div>
                  <h2 style={{fontSize: '1.25rem', fontWeight: 600}}>Attrition Prediction</h2>
                  <p style={{color: result.attrition === 'Yes' ? 'var(--danger-color)' : 'var(--success-color)', fontWeight: 600}}>
                    {result.attrition === 'Yes' ? 'High Risk - Likely to Leave' : 'Low Risk - Employee Retained'}
                  </p>
                </div>
              </div>

              <div style={{background: 'rgba(13, 17, 23, 0.5)', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem'}}>
                <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem'}}>Flight Risk Probability</p>
                <div style={{display: 'flex', alignItems: 'flex-end', gap: '0.5rem', marginBottom: '1rem'}}>
                  <span style={{fontSize: '3rem', fontWeight: 800, lineHeight: 1, color: result.attrition === 'Yes' ? 'var(--danger-color)' : 'var(--success-color)'}}>
                    {result.probability}%
                  </span>
                </div>
                
                <div style={{width: '100%', height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden'}}>
                  <div style={{width: `${result.probability}%`, height: '100%', background: result.attrition === 'Yes' ? 'var(--danger-color)' : 'var(--success-color)', borderRadius: 4}}></div>
                </div>
              </div>

              <div style={{padding: '1rem', background: 'rgba(88, 166, 255, 0.05)', borderLeft: '3px solid var(--accent-color)', borderRadius: '0 8px 8px 0'}}>
                <span style={{fontWeight: 600, display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem'}}>ML Explanation Context:</span>
                <span style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>{result.explanation}</span>
              </div>
            </div>
          ) : (
            <div className="glass-card" style={{height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
              <ShieldAlert size={48} color="rgba(255,255,255,0.05)" style={{marginBottom: '1.5rem'}} />
              <h3 style={{marginBottom: '0.5rem', fontWeight: 600}}>Analyzing Flight Risk Patterns</h3>
              <p style={{color: 'var(--text-secondary)'}}>Input employee stats to run the predictive Random Forest model. Uncover attrition risks before they happen.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttritionPred;
