import express from 'express';
import {
  login,
  logout,
  register,
} from '../controllers/auth.controller.js';

// 1) router oluşturma
const router = express.Router();

// 2) bu route gelen isteklerde çalışıcak
// fonksiyonları belirleme
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

export default router;
