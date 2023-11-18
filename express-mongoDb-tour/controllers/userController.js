const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const filterObj = require('../utils/filterObj');

// kullanıclar için
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Şifre güncellemeye çalışırsa hata ver
  if (req.body.password || req.passwordConfirm) {
    return next(
      new AppError(
        "Şifrenizi bur route ile güncelleyemzsiniz.Lütfen /updateMyPassword route'unu kullanın",
        400
      )
    );
  }

  // 2) Kullanıcının belirli bilgilerini güncelle
  const filtredBody = filterObj(req.body, 'name', 'email');

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    filtredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  // 1) Kullanıcıyı bul ve active değerini false'a çek
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route tanımlanmadı',
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route "tanımlanmadı',
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route tanımlanmadı',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route tanımlanmadı',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route tanımlanmadı',
  });
};
