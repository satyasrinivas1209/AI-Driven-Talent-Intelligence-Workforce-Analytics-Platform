import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

def generate_data(n_samples=500):
    # Generating synthetic data where features actually correlate with attrition
    np.random.seed(42)
    
    age = np.random.randint(20, 60, n_samples)
    monthly_income = np.random.randint(2000, 20000, n_samples)
    years_at_company = np.random.randint(0, 40, n_samples)
    job_satisfaction = np.random.randint(1, 5, n_samples)
    
    # Probability of attrition increases if job satisfaction is low, income is low, or age is low
    attrition_prob = np.zeros(n_samples)
    
    for i in range(n_samples):
        prob = 0.1 # Base probability
        
        if job_satisfaction[i] <= 2:
            prob += 0.4
        if monthly_income[i] < 5000:
            prob += 0.2
        if age[i] < 30:
            prob += 0.1
        if years_at_company[i] < 2:
            prob += 0.1
            
        attrition_prob[i] = min(prob, 0.95)
        
    attrition = np.random.binomial(1, attrition_prob)
    
    data = pd.DataFrame({
        'Age': age,
        'MonthlyIncome': monthly_income,
        'YearsAtCompany': years_at_company,
        'JobSatisfaction': job_satisfaction,
        'Attrition': attrition
    })
    
    return data

def train_and_save():
    print("Generating correlated synthetic data...")
    data = generate_data(1000)
    
    X = data.drop('Attrition', axis=1)
    y = data['Attrition']
    
    print("Training RandomForestClassifier...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    model_path = os.path.join(os.path.dirname(__file__), 'attrition_model.pkl')
    joblib.dump(model, model_path)
    print("Model successfully saved!")

if __name__ == '__main__':
    train_and_save()
