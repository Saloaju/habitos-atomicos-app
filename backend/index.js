const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Permite recibir datos en formato JSON

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch((error) => console.error('❌ Error conectando a MongoDB:', error));

// Importar Rutas
const habitsRoutes = require('./routes/habits');
const authRoutes = require('./routes/auth'); // Ruta de autenticación (Semana 4)

// Usar Rutas
app.use('/api/habits', habitsRoutes);
app.use('/api/auth', authRoutes); // Usar ruta de autenticación (Semana 4)

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});