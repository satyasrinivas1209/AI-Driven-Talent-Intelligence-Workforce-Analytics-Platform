const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'HR'], default: 'HR' },
  gmailTokens: { type: String, default: null },
  gmailTokensIV: { type: String, default: null },
  gmailTokensAuthTag: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
