import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import error from '../utils/error.js';

// yeni hesap oluşturma
export const register = async (req, res, next) => {
  try {
    // password'u hash ve saltlama
    const hash = bcrypt.hashSync(req.body.password, 5);

    // yeni kullanıcı oluştur
    const newUser = new User({ ...req.body, password: hash });

    // yeni kullnancııyı veritabanına kaydet
    await newUser.save();

    res.status(200).json({
      message: 'Yeni kullanıcı oluşturuldu',
      newUser,
    });
  } catch (err) {
    next(error(400, 'Giriş yaparken hata oluştu'));
  }
};

// hesaba giriş yapma
export const login = async (req, res, next) => {
  try {
    // 1) ismine göre kullancııyı bul
    const user = await User.findOne({ username: req.body.username });

    // 2) kullalncıcı bulunamazsa hata gönder
    if (!user) return next(error(404, 'Kullanıcı bulunamadı'));

    // 3) bulunursa şifreisi doğru mu kontrol et
    const isCorrect = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    // 4) şifre yanlışsa hata ver
    if (!isCorrect)
      return next(error(400, 'Şifre veya isminiz yanlış'));

    // 5) şifre doğruysa şifreyi kaldırıp jwt tokeni oluştur
    user.password = null;

    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller,
      },
      process.env.JWT_KEY
    );

    res
      .cookie('accessToken', token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        message: 'Hesaba giriş yapıldı',
        user,
      });
  } catch (err) {
    next(err);
  }
};

// hesaptan çıkış yapma cookieyi temizle
// temizlediğimi noktada artık tekrara hesaba giriş yapmak zorun kalıcak
export const logout = (req, res, next) => {
  res.clearCookie('accessToken').status(200).json({
    message: 'Kullanıcı hesabından çıkış yaptı',
  });
};
