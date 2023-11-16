const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// jwt tokeni oluşturur ve döndürür
const signToken = (id) => {
  return (token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  }));
};

// yeni hesap oluştur
exports.signup = catchAsync(async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    // jwt tokeni oluştur
    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      data: err,
    });
  }
});

// varolan hesaba giriş yapma
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) email ve şifre düzgün mü kontrol
  if (!email || !password) {
    return next(new AppError('Email ve şifrenizi tanımlayın', 400));
  }
  // 2) kullanıcı var mı ve şifresi doğru mu kontrol
  const user = await User.findOne({ email }).select('+password'); // şifreyi de çağır

  if (
    !user ||
    !(await user.correctPassword(password, user.password))
  ) {
    return next(new AppError('Eposta veya şifreniz yanlış', 400));
  }

  // 3) her şey tamamsa tokeni oluştur ve gönder gönder
  const token = signToken(user.id);

  res.status(201).json({
    status: 'success',
    token,
  });
});

// kormumalı route
// kulanıcın  tokenine göre route'a erişmimi belirler
exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // 1) Tokeni al ve tokenin doğru geldiğinden emin ol
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError(
        'Hesabıza giriş yapmadınız. Bu sayfaya erişim için oturum açın!',
        401
      )
    );
  }

  let decoded;

  // 2) Tokenin geçerliliğini doğrula
  // Hem bizim belirlediğim imzaya uygun birşekilde mi şifrelenmiş
  // Süresi dolmuş mu const
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    // token süreden geçersiz kaldıysa (süresi geçtiyse)
    if (err.message === 'jwt expired') {
      return next(
        new AppError(
          'Otrumunuzun süresi doldun. Lütfen tekrar giriş yapın'
        ),
        401
      );
    }
    // token geçrsizse
    return next(new AppError('Geçersiz token'), 401);
  }

  // 3) Kullanıcın hesabı duruyor mu kontrol
  const activeUser = await User.findById(decoded.id);

  if (!activeUser) {
    return next(
      new AppError(
        'Tokenini gönderidiğini kullanıcının hesabına artık erişilemiyor! Hesap Silinmiş.',
        401
      )
    );
  }

  // 4) Tokeni verdiğimizden sonra şifresini değiştiriş mi kontrol
  if (activeUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'Yakın zamanda şifrenizi değiştridiniz. Lütfen tekrar giriş yapın',
        401
      )
    );
  }

  // yapılan isteğe kullanıcıyı ekle
  // ve route'a erişmesine izin ver
  req.user = activeUser;
  next();
});

// kullanıcın rolüne göre erişme izin veriri
exports.restricTo = (...roles) => {
  return (req, res, next) => {
    // roles: erişme izin veridiğim rolller
    // kullanıcın rolü: req.user.role

    // kullanın rolu erişme izin verdiklerim arasında DEĞİLSE çalışır
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('Bu işlemi yapmak için yetkiniz yok', 403)
      );
    }

    // kullanın rolu erişme izin verdiklerim ARASINDAYSA devam et
    next();
  };
};

// kullanıcı şifresini unuttuysa
// epostasına şifre sıfırlama isteği gönder
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) e-posta'ya göre kullanıcın hesabına eriş
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new AppError("Bu email'e sahip kullanıcı bulunamadı", 404)
    );
  }

  // 2) Şifre sıfırlama tokeni oluştur
  const resetToken = user.createPasswordResetToken();

  // TODO veritabanını tokenin şifrelenmiş halini sakla
  await user.save({ validateBeforeSave: false });

  // TODO 3) Kullanıcının maline gönder
});

// kullanıcnın yeni şifreisni kaydeder
exports.resetPassword = (req, res, next) => {};
