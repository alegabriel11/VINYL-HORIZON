const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rutas Públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rutas Protegidas (Idealmente añadiríamos middleware de JWT y Rol aquí después)
router.post('/register-admin', authController.registerAdmin);

module.exports = router;
