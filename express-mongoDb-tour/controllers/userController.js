const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const filterObj = require('../utils/filterObj');
const factory = require('./handlerFactory');
var multer = require('multer');

const multerStorage = multer.diskStorage({
  // hedef klasörü belirleme
  destination: function (req, file, cb) {
    cb(null, 'public/img/users');
  },
  // dosya ismini belirleme
  filename: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1]; // jpg
    cb(null, `/user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

// SADECE RTESİMLERİ KABUL EDER
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'Lütfen bir resim türünde dosya gönderiniz..',
        400
      ),
      false
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// fotoğrafı kaydeder
exports.uploadUserPhoto = upload.single('photo');

// kullanıclar için
exports.updateMe = catchAsync(async (req, res, next) => {
  console.log('body: ', req.body);
  console.log('form: ', req.file);
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

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route tanımlanmadı /signup kullanın ',
  });
};

exports.getAllUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
