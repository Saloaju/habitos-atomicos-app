# Hábitos Atómicos - Backend (Semana 1)

Este es el backend del proyecto de control de hábitos, construido con Node.js, Express y MongoDB.

## Requisitos previos
- Node.js instalado.
- Una cuenta en MongoDB Atlas.

## Instalación y Ejecución

1. Clona este repositorio:
   \`\`\`bash
   git clone [URL_DE_TU_REPOSITORIO]
   \`\`\`

2. Instala las dependencias:
   \`\`\`bash
   npm install
   \`\`\`

3. Configura las variables de entorno:
   Crea un archivo \`.env\` en la raíz del proyecto y agrega tu cadena de conexión:
   \`\`\`env
   PORT=5000
   MONGODB_URI=tu_cadena_de_conexion_de_mongo_atlas
   \`\`\`

4. Ejecuta el proyecto en modo desarrollo:
   \`\`\`bash
   npm run dev
   \`\`\`
   El servidor iniciará en \`http://localhost:5000\`.