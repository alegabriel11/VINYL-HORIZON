const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');

// Inicializar la aplicación Express
const app = express();

// Configurar Middlewares
app.use(cors()); // Permite peticiones desde el Frontend (React)
app.use(express.json({ limit: '10mb' })); // Permite que el servidor entienda JSON de hasta 10mb (para imágenes en base64)

// Rutas
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const vinylRoutes = require('./routes/vinylRoutes');
app.use('/api/vinyls', vinylRoutes);


// Ruta base de prueba
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenido a la API de Vinyl Horizon!' });
});

// Manejo de errores global simple
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo salió mal en el servidor!', error: err.message });
});

// Levantar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
