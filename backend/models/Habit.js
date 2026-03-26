const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  targetDays: {
    type: Number,
    default: 66 // Basado en el estudio mencionado en el enunciado
  },
  lastCompletedDate: {
    type: Date,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Habit', HabitSchema);