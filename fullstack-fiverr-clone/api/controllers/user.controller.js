import User from '../models/user.model.js';

export const deleteUser = async (req, res, next) => {
  // kullanıcıyı al
  const user = await User.findById(req.params.id);

  // kullanıcı kendi hesabını mı silmeye çalışıyor
  if (req.userUserId !== user._id.toString()) {
    return res.status(403).json({ message: 'Yetkiniz yok.' });
  }

  // kullanıcıyı sil
  await User.findByIdAndDelete(req.params.id);
  res.json({
    message: 'Kullanıcı Silindi',
  });
};
