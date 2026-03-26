# Proyecto Hábitos Atómicos

Aplicación web basada en el libro "Hábitos Atómicos", desarrollada con el stack MERN + Next.js.

## Estructura del Proyecto
El proyecto está dividido en dos partes principales:
- `/backend`: API REST hecha con Node.js, Express y MongoDB.
- `/frontend`: Interfaz de usuario construida con Next.js y Redux.

## Instrucciones para ejecutar el proyecto localmente

Para correr esta aplicación, necesitas tener **dos terminales abiertas**, una para el backend y otra para el frontend.

### 1. Levantar el Backend
Abre una terminal y ejecuta:
\`\`\`bash
cd backend
npm install   # Solo la primera vez
npm run dev
\`\`\`
El backend correrá en `http://localhost:5000`.

### 2. Levantar el Frontend
Abre **otra** terminal y ejecuta:
\`\`\`bash
cd frontend
npm install   # Solo la primera vez
npm run dev
\`\`\`
El frontend correrá en `http://localhost:3000`.