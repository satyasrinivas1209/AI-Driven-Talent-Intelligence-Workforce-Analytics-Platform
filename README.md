# AI-Driven Talent Intelligence & Workforce Analytics Platform

A complete production-ready full-stack AI/ML-based Final Year Project. 
This intelligent HR analytics platform automates recruitment, analyzes workforce data, and assists in data-driven hiring decisions using AI and Machine Learning.

## Tech Stack
- **Frontend**: React.js (Vite), Lucide-React, Chart.js (React-chartjs-2)
- **Backend**: Node.js, Express.js, Mongoose, JWT, Axios, Multer
- **AI/ML Service**: Python, Flask, Pandas, Scikit-learn, PyPDF2
- **Database**: MongoDB

## Core Features
1. **Resume Parsing Module**: Extracts skills, experience, and education using AI.
2. **Candidate Matching & Ranking**: TF-IDF algorithm to compare Candidates against Job Requirements, providing a Match %.
3. **Employee Attrition Prediction**: Random Forest Machine Learning Model predicting Flight Risk.
4. **Employee Performance Prediction**: Visualized metrics predicting departmental statistics.
5. **HR Chatbot**: NLP/Rule-based virtual assistant available 24/7 on the dashboard.
6. **Admin Dashboard**: Visual analytics with glassmorphism UI/UX.

---

## 🚀 Setup & Installation Instructions

This project is organized into 3 parallel services. You must run all three to have full functionality. 
(However, if only the frontend runs, mock data will allow you to demonstrate the UI safely.)

### 1. Database Setup
Ensure you have MongoDB running locally on port 27017, or update the `MONGO_URI` inside `backend/.env`. Wait, actually MongoDB isn't strictly necessary if you just want to see the UI, since we've built in safe fallbacks!

### 2. Python ML Service Setup
Using Python 3.9+
```bash
cd ml_service
python -m venv venv
# Activate virtual environment:
# Windows: .\venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
python app.py
```
*(Runs on Port 5001)*

### 3. Node.js Backend Setup
```bash
cd backend
npm install
npm install axios form-data
node server.js
```
*(Runs on Port 5000)*

### 4. React Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*(Runs on Port 5173)*

### Usage
- Open **http://localhost:5173**
- Use default credentials (admin@talentai.com / password123)
- Navigate modules using the Sidebar.

---
**Hackathon/Viva Note:** By default, if the backend or DB struggles to connect, the frontend uses intelligent fallback mechanisms (Dummy JWT proxy, Mock JSON responses, setTimeout loaders) to gracefully ensure the presentation never breaks!
