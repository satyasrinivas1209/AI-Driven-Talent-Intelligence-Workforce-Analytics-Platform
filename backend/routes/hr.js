const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

// Route to Predict Attrition
router.post('/predict-attrition', auth, checkRole(['HR', 'Admin']), async (req, res) => {
  try {
    const employeeData = req.body;
    
    // Call ML Service attrition API
    const response = await axios.post('http://127.0.0.1:5001/predict-attrition', employeeData);
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error predicting attrition' });
  }
});

// Route for NLP Chatbot
router.post('/chatbot', auth, async (req, res) => {
  try {
    const { question } = req.body;
    
    const response = await axios.post('http://127.0.0.1:5001/chatbot', { question });
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error from Chatbot' });
  }
});

module.exports = router;
