const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rutas Públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

// Registro de admin
router.post('/register-admin', authController.registerAdmin);

// Perfil de usuario (avatar + cover)
router.get('/profile/:id', authController.getProfile);
router.put('/profile', authController.updateProfile);

module.exports = router;
