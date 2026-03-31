import { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, FileText, Check, X, Filter, Search, Download, Mail, Calendar, MapPin, TrendingUp, Users, ChevronDown, Share2, Zap, MessageSquare, Briefcase, Award } from 'lucide-react';

const Candidates = () => {
  const [profile, setProfile] = useState({
    name: 'Evelyn Harper',
    role: 'Lead Systems Architect',
    exp: '12 years experience',
    location: 'London, UK',
    matchScore: 98,
    isHighIntent: true
  });

  return (
    <div style={{ padding: '2rem 4rem', background: '#f8fafc', minHeight: '100vh', fontFamily: '"Inter", sans-serif' }}>
      
      {/* Breadcrumb & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
            Talent Pool / Senior Product Engineers / <span style={{ color: '#151e5e', fontWeight: 700 }}>{profile.name}</span>
          </p>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>{profile.name}</h1>
          <p style={{ fontSize: '1.1rem', color: '#64748b' }}>{profile.role} • {profile.exp} • {profile.location}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ background: 'white', border: '1px solid #e2e8f0', padding: '0.75rem 2rem', borderRadius: '0.75rem', fontWeight: 800, color: '#1e293b' }}>Shortlist</button>
          <button style={{ background: '#151e5e', color: 'white', border: 'none', padding: '0.75rem 2.5rem', borderRadius: '0.75rem', fontWeight: 800 }}>Schedule Interview</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '2.5rem', marginBottom: '2.5rem' }}>
        
        {/* Profile Summary & Skill Matrix Row */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          <div style={{ background: 'white', padding: '3rem', borderRadius: '2rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', gap: '2.5rem', marginBottom: '2.5rem' }}>
               <div style={{ width: '120px', height: '120px', borderRadius: '1.5rem', overflow: 'hidden', background: '#f1f5f9' }}>
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Evelyn" alt="" style={{ width: '100%', height: '100%' }} />
               </div>
               <div style={{ flex: 1 }}>
                 <div style={{ background: '#e0e7ff', color: '#151e5e', fontSize: '0.65rem', fontWeight: 800, padding: '0.25rem 0.5rem', borderRadius: '4px', display: 'inline-block', marginBottom: '1rem' }}>HIGH INTENT</div>
                 <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem' }}>Profile Summary</h3>
                 <p style={{ fontSize: '1.15rem', color: '#475569', fontStyle: 'italic', lineHeight: 1.6 }}>
                  "A strategic architect known for scaling distributed systems from zero to 10M+ users. Evelyn combines deep technical rigor with a journalistic eye for detail, making her an ideal fit for high-trust editorial platforms."
                 </p>
               </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', paddingTop: '2.5rem', borderTop: '1px solid #f1f5f9' }}>
               <div>
                 <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Current Role</p>
                 <p style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Staff Engineer at FlowState</p>
               </div>
               <div>
                 <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Education</p>
                 <p style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>MSc CompSci, Imperial College</p>
               </div>
               <div>
                 <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Salary Expectation</p>
                 <p style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>£145k - £160k</p>
               </div>
            </div>
          </div>

          <div style={{ background: 'white', padding: '3rem', borderRadius: '2rem', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
               <Zap size={24} fill="#151e5e" /> Skill Matrix Analysis
            </h3>
            {/* Mock Radar Chart visualization */}
            <div style={{ height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
               <div style={{ width: '280px', height: '280px', border: '1px dashed #cbd5e1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '180px', height: '180px', background: 'rgba(21, 30, 94, 0.1)', border: '2px solid #151e5e', clipPath: 'polygon(50% 0%, 100% 38%, 81% 91%, 19% 91%, 0% 38%)' }}></div>
               </div>
               {/* Labels */}
               <div style={{ position: 'absolute', top: 0, fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8' }}>ARCHITECTURAL DESIGN</div>
               <div style={{ position: 'absolute', bottom: 0, fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8' }}>TEAM LEADERSHIP</div>
               <div style={{ position: 'absolute', left: 0, top: '50%', fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8' }}>FRONTEND</div>
               <div style={{ position: 'absolute', right: 0, top: '50%', fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8' }}>DEVOPS</div>
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
              <div style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1 }}>98%</div>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Overall Match Score</p>
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>Key Strengths</p>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>Systems Resilience, Technical Mentorship, Cross-functional alignment.</p>
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '1rem' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>Risk Assessment</p>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>Low risk. Highly aligned with long-term retention markers.</p>
            </div>
          </div>

          <div style={{ background: 'white', padding: '2.5rem', borderRadius: '2rem', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
               <MessageSquare size={20} /> Sentiment Analysis
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
               {[
                 { interview: 'Technical Interview (Phase 1)', sentiment: '92% POSITIVE', text: '"Exceptional clarity when discussing state management. High enthusiasm for collaborative problem solving."', color: '#10b981' },
                 { interview: 'Initial Screening', sentiment: '88% POSITIVE', text: '"Calm, measured, and highly analytical. Aligned with organizational values around transparency."', color: '#3b82f6' }
               ].map((s, i) => (
                 <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b' }}>{s.interview}</p>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: s.color }}>{s.sentiment}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>{s.text}</p>
                    <div style={{ width: '100%', height: '4px', background: '#f1f5f9', borderRadius: '2px', marginTop: '1rem' }}>
                      <div style={{ width: s.sentiment.split('%')[0] + '%', height: '100%', background: s.color, borderRadius: '2px' }}></div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '2.5rem' }}>
        {/* Timeline */}
        <div style={{ background: 'white', padding: '3rem', borderRadius: '2rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '3rem' }}>Experience Timeline</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {[
              { role: 'Staff Engineer', company: 'FlowState Systems', period: '2019 — PRESENT', desc: 'Led the transition from monolith to event-driven microservices. Managed a distributed team of 14 engineers across 3 timezones.' },
              { role: 'Senior Software Architect', company: 'Beacon Media Group', period: '2015 — 2019', desc: 'Oversaw the technical architecture for a suite of high-traffic content management tools.' }
            ].map((exp, i) => (
              <div key={i} style={{ display: 'flex', gap: '2rem', position: 'relative' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: i === 0 ? '#151e5e' : '#e2e8f0', marginTop: '6px', flexShrink: 0 }}></div>
                {i === 0 && <div style={{ position: 'absolute', left: '5px', top: '24px', bottom: '-48px', width: '2px', background: '#f1f5f9' }}></div>}
                <div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>{exp.role}</h4>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>{exp.period}</span>
                   </div>
                   <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#151e5e', marginBottom: '1rem' }}>{exp.company}</p>
                   <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.6 }}>{exp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Talent Intelligence Right Side */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div style={{ background: 'white', padding: '2.5rem', borderRadius: '2rem', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#151e5e', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
               <Briefcase size={20} /> Cultural Fit
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {[
                { label: 'Autonomous', score: 9.5 },
                { label: 'Risk Appetite', score: 5.5, labelText: 'Low-Medium' },
                { label: 'Mentorship', score: 9.8, labelText: 'Expert' }
              ].map((fit, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>{fit.label}</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#151e5e' }}>{fit.labelText || `${fit.score}/10`}</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', background: '#f1f5f9', borderRadius: '2px' }}>
                    <div style={{ width: (fit.score * 10) + '%', height: '100%', background: '#151e5e', borderRadius: '2px' }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', marginTop: '2.5rem', border: '1px solid #f1f5f9' }}>
               <p style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic', lineHeight: 1.5 }}>
                 "Evelyn thrives in environments where engineering decisions are documented and debated. She is unlikely to fit in a 'move fast and break things' culture without proper peer review."
               </p>
            </div>
          </div>

          <div style={{ background: 'white', padding: '2.5rem', borderRadius: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
               <Award size={20} /> Next Recommended Step
            </h3>
            <div style={{ background: '#f1f5f9', padding: '1.5rem', borderRadius: '1rem', marginBottom: '1.5rem' }}>
               <p style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1e293b', marginBottom: '0.25rem' }}>Architectural Review</p>
               <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Schedule a 60-min deep dive with our CTO, Marcus Chen.</p>
            </div>
            <button style={{ width: '100%', padding: '1rem', background: '#151e5e', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 800, fontSize: '0.9rem' }}>
               View Calendar Availability
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Candidates;
