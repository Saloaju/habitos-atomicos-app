const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');

// 1. OBTENER todos los hábitos (GET)
router.get('/', async (req, res) => {
  try {
    const habits = await Habit.find();
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los hábitos', error });
  }
});

// 2. CREAR un nuevo hábito (POST)
router.post('/', async (req, res) => {
  try {
    const newHabit = new Habit(req.body);
    const savedHabit = await newHabit.save();
    res.status(201).json(savedHabit);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el hábito', error });
  }
});

// 3. ACTUALIZAR un hábito (PUT)
router.put('/:id', async (req, res) => {
  try {
    const updatedHabit = await Habit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedHabit);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar', error });
  }
});

// 4. ELIMINAR un hábito (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    await Habit.findByIdAndDelete(req.params.id);
    res.json({ message: 'Hábito eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar', error });
  }
});

// ==========================================
// NUEVA RUTA SEMANA 4: LÓGICA DE RACHA Y REINICIO
// ==========================================

// 5. CHECK-IN: Marcar hábito como realizado hoy (PATCH)
router.patch('/:id/check', async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ message: 'Hábito no encontrado' });

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalizamos a la medianoche para comparar solo fechas

    let lastCompleted = habit.lastCompletedDate ? new Date(habit.lastCompletedDate) : null;
    if (lastCompleted) lastCompleted.setHours(0, 0, 0, 0);

    // Si nunca se ha completado, o es la primera vez
    if (!lastCompleted) {
      habit.currentStreak = 1;
    } else {
      const diffTime = Math.abs(today - lastCompleted);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return res.status(400).json({ message: 'Ya completaste este hábito hoy' });
      } else if (diffDays === 1) {
        // Fue ayer, la racha continúa sumando
        habit.currentStreak += 1;
      } else {
        // Pasó más de 1 día, se rompió la racha (Reinicio a 1)
        habit.currentStreak = 1; 
      }
    }

    habit.lastCompletedDate = new Date(); // Registramos fecha y hora actual
    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar racha', error });
  }
});

module.exports = router;