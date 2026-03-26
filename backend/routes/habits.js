const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');

// 1. OBTENER todos los hábitos (Listar)
router.get('/', async (req, res) => {
  try {
    const habits = await Habit.find();
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener hábitos', error });
  }
});

// 2. ALTAS: Crear un nuevo hábito
router.post('/', async (req, res) => {
  try {
    const newHabit = new Habit(req.body);
    const savedHabit = await newHabit.save();
    res.status(201).json(savedHabit);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear hábito', error });
  }
});

// 3. CAMBIOS: Actualizar un hábito (ej. marcar como completado hoy)
router.put('/:id', async (req, res) => {
  try {
    const updatedHabit = await Habit.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true } // Devuelve el documento actualizado
    );
    if (!updatedHabit) return res.status(404).json({ message: 'Hábito no encontrado' });
    res.json(updatedHabit);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar hábito', error });
  }
});

// 4. BAJAS: Eliminar un hábito
router.delete('/:id', async (req, res) => {
  try {
    const deletedHabit = await Habit.findByIdAndDelete(req.params.id);
    if (!deletedHabit) return res.status(404).json({ message: 'Hábito no encontrado' });
    res.json({ message: 'Hábito eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar hábito', error });
  }
});

module.exports = router;