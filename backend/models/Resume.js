const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  candidateName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  skills: [{ type: String }],
  experience: { type: String },
  education: { type: String },
  filePath: { type: String },
  status: { type: String, default: 'Pending' }, // Pending, Shortlisted, Rejected
  matchScore: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Resume', ResumeSchema);
