const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
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
    // Return all jobs, including inactive ones for the management UI
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.post('/', [auth, checkRole(['Admin'])], async (req, res) => {
  try {
    const { title, description, requiredSkills, isActive } = req.body;
    const newJob = new Job({ title, description, requiredSkills, isActive });
    await newJob.save();
    res.json(newJob);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.put('/:id', [auth, checkRole(['Admin'])], async (req, res) => {
  try {
    const { title, description, requiredSkills, isActive } = req.body;
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { title, description, requiredSkills, isActive },
      { returnDocument: 'after' }
    );
    res.json(updatedJob);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.delete('/:id', [auth, checkRole(['Admin'])], async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Job deleted' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
