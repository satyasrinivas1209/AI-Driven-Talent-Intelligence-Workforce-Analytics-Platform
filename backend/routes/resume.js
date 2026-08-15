const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const Resume = require('../models/Resume');
const Job = require('../models/Job');

const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'));
    }
  }
});

router.post('/upload', auth, upload.single('resume'), async (req, res) => {
  try {
    const { candidateName, email, phone, jobId } = req.body;
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    let jobTitle = 'General';
    let requiredSkills = [];
    if (jobId) {
      const job = await Job.findById(jobId);
      if (job) {
        jobTitle = job.title;
        requiredSkills = job.requiredSkills || [];
      }
    }

    const form = new FormData();
    form.append('file', fs.createReadStream(req.file.path));
    form.append('jobTitle', jobTitle);
    form.append('requiredSkills', requiredSkills.join(','));

    let skills = [], experience = 'Fresher', education = 'N/A', matchScore = 0;
    try {
      const mlApiUrl = process.env.ML_API_URL || 'http://127.0.0.1:5001';
      const mlResponse = await axios.post(`${mlApiUrl}/parse`, form, {
        headers: { ...form.getHeaders() },
      });
      ({ skills, experience, education, matchScore } = mlResponse.data);
    } catch (mlErr) {
      console.warn('ML service unavailable, saving with defaults.');
    }

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

    res.json({ message: 'Resume uploaded successfully', resume });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error parsing resume' });
  } finally {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ matchScore: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

router.patch('/:id/status', auth, checkRole(['HR', 'Admin']), async (req, res) => {
  try {
    const { status } = req.body;
    const resume = await Resume.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(resume);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
