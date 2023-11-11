const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// jwt tokeni oluşturur ve döndürür
const signToken = (id) => {
  return (token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  }));
};

// yeni hesap oluştur
exports.signup = async (req, res) => {
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
};

// varolan hesaba giriş yapma
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // 1) email ve şifre düzgün mü kontrol
  if (!email || !password) {
    return res.status(400).json({
      status: 'fail',
      message: 'email ve şifre gönderiniz..',
    });
  }
  // 2) kullanıcı var mı ve şifresi doğru mu kontrol
  const user = await User.findOne({ email }).select('+password'); // şifreyi de çağır

  //  şifre doğru mu kontrol
  const correct = await user.correctPassword(password, user.password);

  if (!correct || !user) {
    return res.status(400).json({
      status: 'fail',
      message: 'şifre veya mail yanlış',
    });
  }

  // 3) her şey tamamsa tokeni oluştur ve gönder gönder
  const token = signToken(user.id);

  res.status(201).json({
    status: 'success',
    token,
  });
};
