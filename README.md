# AI-Driven Talent Intelligence & Workforce Analytics Platform

![Project Status](https://img.shields.io/badge/status-active-brightgreen.svg)
![React](https://img.shields.io/badge/Frontend-React%20Vite-blue.svg)
![Node](https://img.shields.io/badge/Backend-Node.js-green.svg)
![Python](https://img.shields.io/badge/ML-Python%20Flask-yellow.svg)

A complete production-ready full-stack AI/ML-based platform designed to revolutionize HR operations. This intelligent analytics platform automates recruitment, analyzes workforce data, and assists in data-driven hiring decisions using Artificial Intelligence and Machine Learning.

---

## 📑 Table of Contents
- [Tech Stack](#-tech-stack)
- [Core Features](#-core-features)
- [Project Architecture](#-project-architecture)
- [Setup & Installation Instructions](#-setup--installation-instructions)
  - [1. Database Setup](#1-database-setup)
  - [2. Python ML Service Setup](#2-python-ml-service-setup)
  - [3. Node.js Backend Setup](#3-nodejs-backend-setup)
  - [4. React Frontend Setup](#4-react-frontend-setup)
- [Usage](#-usage)
- [Recent Updates](#-recent-updates)
- [Hackathon/Viva Note](#-hackathonviva-note)

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling/UI**: Tailwind CSS, Glassmorphism UI
- **Icons**: Lucide-React
- **Data Visualization**: Chart.js (React-chartjs-2)

### Backend
- **Framework**: Node.js, Express.js
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: MongoDB (via Mongoose)
- **File Handling**: Multer

### AI / ML Service
- **Environment**: Python, Flask
- **Libraries**: Pandas, Scikit-learn, PyPDF2
- **Algorithms**: Random Forest, TF-IDF

---

## 🚀 Core Features

1. **Resume Parsing Module**: Extracts skills, experience, and education from PDF resumes using AI (PyPDF2 & NLP).
2. **Candidate Matching & Ranking**: Utilizes TF-IDF algorithms to compare candidate profiles against job requirements, providing an accurate Match %.
3. **Employee Attrition Prediction**: Employs a Random Forest Machine Learning model to predict flight risk and identify potential turnover.
4. **Employee Performance Prediction**: Visualized metrics predicting departmental statistics and individual performance trajectories.
5. **HR Chatbot**: NLP/Rule-based virtual assistant available 24/7 on the dashboard to answer HR-related queries.
6. **Admin Dashboard**: Comprehensive visual analytics featuring a modern glassmorphism UI/UX design.
7. **Secure Authentication**: Robust JWT-based login system.

---

## ⚙️ Project Architecture

The project is designed using a microservices-inspired architecture, divided into three parallel services:
- **Frontend** (`/frontend`): The user interface interacting with users.
- **Backend** (`/backend`): The main API server handling business logic, DB interactions, and authentication.
- **ML Service** (`/ml_service`): A dedicated Python microservice handling heavy computational tasks like model predictions and document parsing.

---

## 💻 Setup & Installation Instructions

You must run all three services for full functionality. However, the frontend includes intelligent fallback mechanisms for demonstration purposes.

### 1. Database Setup
Ensure you have MongoDB installed and running locally on port `27017`.
- Alternatively, you can use a MongoDB Atlas cloud URI. Update the `MONGO_URI` inside `backend/.env`.

### 2. Python ML Service Setup
*(Requires Python 3.9+)*
```bash
cd ml_service
# Create virtual environment
python -m venv venv

# Activate virtual environment:
# Windows: .\venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the Flask server
python app.py
```
*Service runs on **Port 5001***

### 3. Node.js Backend Setup
```bash
cd backend
npm install
npm install axios form-data
node server.js
```
*Service runs on **Port 5000***

### 4. React Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Service runs on **Port 5173***

---

## 📖 Usage

1. Open your browser and navigate to **http://localhost:5173**.
2. **Login Credentials**: Use the default credentials to access the system:
   - **Email**: `admin@talentai.com`
   - **Password**: `password123`
3. Navigate through the different modules (Dashboard, Recruitment, Analytics) using the Sidebar.

---

## 🆕 Recent Updates
- **Security Enhancements**: Resolved an authentication bypass vulnerability to ensure robust data security.
- **UI/UX Improvements**: Implemented a password visibility toggle on the login screen for better user experience.

---

## 🛡️ Hackathon/Viva Note
**Safe Fallbacks Built-in!** 
By default, if the backend or database struggles to connect (e.g., during a live demo or hackathon presentation), the frontend uses intelligent fallback mechanisms including:
- Dummy JWT proxy
- Mock JSON responses
- `setTimeout` loaders
This gracefully ensures the presentation never breaks and the UI remains fully functional!
