const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para Registrar a un nuevo usuario (POST /api/auth/register)
router.post('/register', authController.register);

// Ruta para Iniciar Sesión (POST /api/auth/login)
router.post('/login', authController.login);

module.exports = router;
