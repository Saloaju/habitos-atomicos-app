const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const authMiddleware = require('../middleware/auth'); // Importamos el guardia

// Proteger TODAS las rutas de este archivo
router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const habits = await Habit.find();
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: 'Error', error });
  }
});

router.post('/', async (req, res) => {
  try {
    const newHabit = new Habit(req.body);
    const savedHabit = await newHabit.save();
    res.status(201).json(savedHabit);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear', error });
  }
});

router.patch('/:id/check', async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ message: 'Hábito no encontrado' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let lastCompleted = habit.lastCompletedDate ? new Date(habit.lastCompletedDate) : null;
    if (lastCompleted) lastCompleted.setHours(0, 0, 0, 0);

    if (!lastCompleted) {
      habit.currentStreak = 1;
    } else {
      const diffTime = Math.abs(today - lastCompleted);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return res.status(400).json({ message: 'Ya completaste este hábito hoy' });
      else if (diffDays === 1) habit.currentStreak += 1;
      else habit.currentStreak = 1; 
    }

    habit.lastCompletedDate = new Date();
    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar', error });
  }
});

module.exports = router;