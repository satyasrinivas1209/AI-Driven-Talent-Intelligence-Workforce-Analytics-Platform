const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Resume = sequelize.define('Resume', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  candidateName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
  },
  skills: {
    type: DataTypes.JSON, // To store array of skills
    defaultValue: [],
  },
  experience: {
    type: DataTypes.STRING,
  },
  education: {
    type: DataTypes.STRING,
  },
  filePath: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending',
  },
  matchScore: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  timestamps: true,
});

module.exports = Resume;
