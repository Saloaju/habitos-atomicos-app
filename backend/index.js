const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
// Permitimos peticiones de cualquier origen para evitar errores de bloqueo en Vercel
app.use(cors({ origin: '*' }));
app.use(express.json());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('onectado a MongoDB Atlas'))
  .catch((error) => console.error('Error conectando a MongoDB:', error));

// Importar Rutas
const habitsRoutes = require('./routes/habits');
const authRoutes = require('./routes/auth');

// Usar Rutas
app.use('/api/habits', habitsRoutes);
app.use('/api/auth', authRoutes);

// Iniciar servidor (Solo localmente, en Vercel se ignora esto)
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}

// EXPORTAR LA APP (Paso crucial para Vercel)
module.exports = app;