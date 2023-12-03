import jwt from 'jsonwebtoken';
import error from '../utils/error.js';

export const verifyToken = (req, res, next) => {
  // 1) tokeni var mı kontrol et
  const token = req.cookies.accessToken;

  // 2) token varsa geçerli mi kontrol et
  if (!token) return next(error(400, 'Yetkiniz yok.'));

  // 3) token geçerli mi kontrol et
  jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
    if (err) return next(error(403, 'Tokniniz geçerli değil.'));

    // bir sonraki adımda bu bilgeler erişlebilmesi için
    // req'e tokendan aldığımız bu iki bilgiyi ekliyoruz
    req.userId = payload.id;
    req.isSeller = payload.isSeller;
  });

  next();
};
