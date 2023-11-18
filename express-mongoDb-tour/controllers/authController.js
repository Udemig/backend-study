const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

// jwt tokeni oluşturur ve döndürür
const signToken = (id) => {
  return (token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  }));
};

// tokeni oluştur ve cevap olarak gönder
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
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
    createSendToken(newUser, 200, res);
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
  createSendToken(user, 200, res);
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

  // 2) Şifre sıfırlama tokeni oluştur1
  const resetToken = user.createPasswordResetToken();

  // TODO veritabanını tokenin şifrelenmiş halini sakla
  await user.save({ validateBeforeSave: false });

  // TODO 3) Kullanıcının maline gönder
  try {
    const resetURL = `http://127.0.0.1:3000/api/v1/users/resetPassword/${resetToken}`;

    const text = `Şifrenizi mi unuttunuz?
    Yeri şifre ile birlikte ${resetURL} 'e PATCH  isteği gönderin.
    Sıfırlamak istemiyorsanız sadece bir şey yapmanıza grerek yok.`;

    await sendEmail({
      email: user.email,
      subject: 'Şifre sıfırlama tokeni (10 dakika)',
      text: text,
    });

    res.status(200).json({
      status: 'success',
      message: 'token maile gönderildi',
    });
  } catch (err) {
    // şifre sıfırlama tokenini ve date'ini kaldır
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    next(
      new AppError(
        'Mail göndermeye çalışırken bir hata oluştu! Lütfen daha sonra tekrar deneyin.',
        500
      )
    );
  }
});

// kullanıcnın yeni şifreisni kaydeder
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) token'den yola çıkarak kullanıcıyı bul
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken, // token'le eşeleşn kullanıcıyı ala
    passwordResetExpires: { $gt: Date.now() }, //geçerlilik tarihi şuanki tarihten daha büyük olan kullanıcları getir
  });

  // 2) kullanıcı bulunduysa ve tokenin tarihi geçememişse yeni şifereyi belirle
  if (!user) {
    return next(
      new AppError('Token geçerli değil veya süresi dolmuş', 400)
    );
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) kullanıcın şifre değiştirme tarihini güncelle
  //  bunun için otomatik çalışan yapı oluşştur

  // 4) kullanıcın hesabına giriş yap > jwt gönder
  createSendToken(user, 201, res);
});

// eski şifreyi hatırlayan kullanıcı için şifre değiştirme
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Kullanıcıyı al
  const user = await User.findById(req.user.id).select('+password');

  // 2) gelen mevcut şifre doğru mu kontrol et
  if (
    !(await user.correctPassword(
      req.body.passwordCurrent,
      user.password
    ))
  ) {
    return next(new AppError('Göderdiğiniz mevcut şifre yanlış'));
  }

  // 3) Doğruysa şifreyi güncelle
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4) Yeni JWT tokenşi oluştur ve gönder
  createSendToken(user, 200, res);
});
