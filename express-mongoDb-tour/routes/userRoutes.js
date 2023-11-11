const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// kaydolma için
router.post('/signup', authController.signup);

// giriş yapmak için
router.post('/login', authController.login);

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