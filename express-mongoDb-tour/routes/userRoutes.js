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

// bu satırın altındaki bütün route'lar dan önce bu çalışır
router.use(authController.protect);

// hesabı açıkken şifre dğeiştrimek isterse
router.patch(
  '/updateMyPassword',
  authController.updatePassword // şifresni günceller
);

// hesbaın bilgielerini güncelle
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.updateMe
);

// hasabı inaktif yapar
router.delete('/deleteMe', userController.deleteMe);

// sadece adminlerin yapabilcekleri
router.use(authController.restricTo('admin'));

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
