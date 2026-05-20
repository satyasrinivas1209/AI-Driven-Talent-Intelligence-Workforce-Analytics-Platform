import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Chatbot from './components/Chatbot';
import Dashboard from './pages/Dashboard';
import UploadResume from './pages/UploadResume';
import Candidates from './pages/Candidates';
import AttritionPred from './pages/AttritionPred';
import Login from './pages/Login';
import Topbar from './components/Topbar';
import EmailApplications from './pages/EmailApplications';

function App() {
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  return (
    <Router>
      <div className="layout-container">
        {isLoggedIn && <Sidebar />}
        <div className="main-content">
          {isLoggedIn && <Topbar />}
          <div className="fade-in">
            <Routes>
              <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/" />} />
              <Route path="/" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/upload" element={isLoggedIn ? <UploadResume /> : <Navigate to="/login" />} />
              <Route path="/candidates" element={isLoggedIn ? <Candidates /> : <Navigate to="/login" />} />
              <Route path="/attrition" element={isLoggedIn ? <AttritionPred /> : <Navigate to="/login" />} />
              <Route path="/email-applications" element={isLoggedIn ? <EmailApplications /> : <Navigate to="/login" />} />
            </Routes>
          </div>
        </div>
        {isLoggedIn && <Chatbot />}
      </div>
    </Router>
  );
}

export default App;
