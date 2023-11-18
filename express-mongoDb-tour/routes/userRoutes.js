const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// kaydolma için
router.post('/signup', authController.signup);

// giriş yapmak için
router.post('/login', authController.login);

// sıfır maili gönderirir
router.post('/forgotPassword', authController.forgotPassword);

// yeni şifreyi kaydeder
router.patch('/resetPassword/:token', authController.resetPassword);

// hesabı açıkken şifre dğeiştrimek isterse
router.patch(
  '/updateMyPassword',
  authController.protect, // kullanıcın oturumu açık mı kontrol eder
  authController.updatePassword // şifresni günceller
);

// hesbaın bilgielerini güncelle
router.patch(
  '/updateMe',
  authController.protect,
  userController.updateMe
);

// hasabı inaktif yapar
router.delete(
  '/deleteMe',
  authController.protect,
  userController.deleteMe
);

//   kullanıcılar için
router
  .route('/')
  .get(userController.getAllUsers) //
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
