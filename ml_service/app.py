import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import PyPDF2
import textwrap
import re
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.ensemble import RandomForestClassifier

app = Flask(__name__)
CORS(app)

# Dummy dataset for training Employee Attrition Model
# usually use IBM HR dataset, simulating here
data = pd.DataFrame({
    'Age': np.random.randint(20, 60, 500),
    'MonthlyIncome': np.random.randint(2000, 20000, 500),
    'YearsAtCompany': np.random.randint(0, 40, 500),
    'JobSatisfaction': np.random.randint(1, 5, 500),
    'Attrition': np.random.choice([0, 1], 500, p=[0.8, 0.2])
})
X = data.drop('Attrition', axis=1)
y = data['Attrition']

attrition_model = RandomForestClassifier(n_estimators=50, random_state=42)
attrition_model.fit(X, y)

def parse_pdf(file_path):
    text = ""
    try:
        with open(file_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                text += page.extract_text()
    except Exception as e:
        print(f"Error reading PDF: {e}")
    return text

def extract_skills(text):
    # A basic list of skills to look for in the text
    known_skills = ['python', 'java', 'c++', 'react', 'node', 'express', 'machine learning', 
                   'sql', 'mongodb', 'docker', 'aws', 'data analysis', 'javascript', 'html', 'css',
                   'tensorflow', 'keras', 'pandas', 'numpy']
    text_lower = text.lower()
    skills_found = [skill for skill in known_skills if skill in text_lower]
    return list(set(skills_found))

@app.route('/parse', methods=['POST'])
def parse_resume():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
        
    file = request.files['file']
    required_skills_str = request.form.get('requiredSkills', '')
    
    file_path = f"temp_{file.filename}"
    file.save(file_path)
    
    text = parse_pdf(file_path)
    os.remove(file_path)
    
    skills = extract_skills(text)
    
    # Simple semantic similarity using TF-IDF
    required_skills = required_skills_str.split(',') if required_skills_str else ['react', 'node', 'mongodb', 'javascript']
    
    # Calculate match score based on shared skills vs required skills
    req_skills_lower = [s.strip().lower() for s in required_skills if s.strip()]
    if not req_skills_lower:
        req_skills_lower = ['python', 'ml', 'data']
        
    matched = set(skills).intersection(set(req_skills_lower))
    match_score = len(matched) / len(req_skills_lower) * 100 if req_skills_lower else 0
    
    # Alternative using TF-IDF for text vs requirement matching
    vectorizer = TfidfVectorizer()
    try:
        tfidf = vectorizer.fit_transform([text.lower(), " ".join(req_skills_lower)])
        cos_sim = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
        # blend explicit skill match with overall description match
        final_score = int((match_score * 0.7) + (cos_sim * 100 * 0.3))
    except:
        final_score = int(match_score)
    
    return jsonify({
        "skills": skills,
        "experience": "2 Years (Extracted)", # Mock extraction
        "education": "B.Tech Computer Science", # Mock extraction
        "matchScore": min(final_score, 100)
    })

@app.route('/predict-attrition', methods=['POST'])
def predict_attrition():
    req_data = request.json
    try:
        # Expected keys: Age, MonthlyIncome, YearsAtCompany, JobSatisfaction
        features = [[
            int(req_data.get('Age', 30)),
            int(req_data.get('MonthlyIncome', 5000)),
            int(req_data.get('YearsAtCompany', 3)),
            int(req_data.get('JobSatisfaction', 3))
        ]]
        pred = attrition_model.predict(features)[0]
        proba = attrition_model.predict_proba(features)[0][1]
        
        return jsonify({
            "attrition": "Yes" if pred == 1 else "No",
            "probability": round(proba * 100, 2),
            "explanation": "Predicted using Random Forest based on Age, Income, Experience, and Satisfaction."
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/chatbot', methods=['POST'])
def chatbot():
    question = request.json.get('question', '').lower()
    # Simple rules based chatbot
    if 'leave' in question or 'holiday' in question:
        reply = "Employees are entitled to 20 days of paid leave per year along with public holidays."
    elif 'salary' in question or 'payroll' in question:
        reply = "Salary is credited on the last working day of the month."
    elif 'notice' in question or 'resign' in question:
        reply = "The standard notice period is 60 days."
    else:
        reply = "I'm sorry, I am an HR bot. Please ask questions related to leave policies, salary, or notice period."
    
    return jsonify({"answer": reply})

if __name__ == '__main__':
    app.run(port=5001, debug=True)
