const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Job = require('../models/Job');

// Helper to seed jobs if none exist
const seedJobsIfEmpty = async () => {
  try {
    const count = await Job.countDocuments();
    if (count === 0) {
      await Job.insertMany([
        {
          title: 'Senior Frontend Engineer',
          description: 'Looking for a senior frontend developer experienced in React and Node.',
          requiredSkills: ['react', 'node', 'javascript', 'typescript', 'css', 'html'],
          isActive: true
        },
        {
          title: 'DevOps Specialist',
          description: 'Seeking a DevOps expert to manage our AWS infrastructure.',
          requiredSkills: ['aws', 'docker', 'kubernetes', 'linux', 'ci/cd', 'python'],
          isActive: true
        },
        {
          title: 'Data Scientist',
          description: 'Data Scientist with a background in machine learning and predictive analytics.',
          requiredSkills: ['python', 'machine learning', 'tensorflow', 'pandas', 'numpy', 'sql'],
          isActive: true
        }
      ]);
      console.log('Seeded initial job postings.');
    }
  } catch (err) {
    console.error('Failed to seed jobs', err);
  }
};

router.get('/', auth, async (req, res) => {
  try {
    await seedJobsIfEmpty();
    const jobs = await Job.find({ isActive: true });
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
