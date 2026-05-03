const express = require('express');
const { signUp, login } = require('../controllers/authController');

const authRoutes = express.Router();

authRoutes.post('/signup', signUp);
authRoutes.post('/login', login);

module.exports = { authRoutes };
