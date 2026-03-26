const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // 1. Obtener el token del encabezado (header) de la petición
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Acceso denegado. No hay token.' });
  }

  try {
    // 2. Limpiar el token (quitar la palabra "Bearer ")
    const token = authHeader.replace('Bearer ', '');
    
    // 3. Verificar si el token es válido usando nuestro secreto
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Adjuntar los datos del usuario a la petición y dejarlo pasar
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token no válido o expirado' });
  }
}

module.exports = authMiddleware;