const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const Resume = require('../models-mysql/Resume');
const Job = require('../models-mysql/Job');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    const { candidateName, email, phone, jobId } = req.body;
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // Assuming we have one active job or it's passed
    let jobTitle = "General";
    let requiredSkills = [];
    if (jobId) {
      const job = await Job.findByPk(jobId);
      if (job) {
        jobTitle = job.title;
        requiredSkills = job.requiredSkills;
      }
    }

    const form = new FormData();
    form.append('file', fs.createReadStream(req.file.path));
    form.append('jobTitle', jobTitle);
    form.append('requiredSkills', requiredSkills.join(','));

    // Send to Python ML Service
    const mlResponse = await axios.post('http://127.0.0.1:5001/parse', form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    const { skills, experience, education, matchScore } = mlResponse.data;

    const resume = await Resume.create({
      candidateName,
      email,
      phone,
      skills: skills || [],
      experience: experience || 'Fresher',
      education: education || 'N/A',
      filePath: req.file.path,
      matchScore: matchScore || 0,
    });
    
    // Clean up
    fs.unlinkSync(req.file.path);

    res.json({ message: 'Resume uploaded successfully', resume });
  } catch (error) {
    console.error(error);
    if(req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).send('Error parsing resume');
  }
});

router.get('/', async (req, res) => {
  try {
    const resumes = await Resume.findAll({ order: [['matchScore', 'DESC']] });
    res.json(resumes);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
