import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Lütfen username alanını gönderiniz'],
      unique: [true, 'Bu isimde bir kullanıcı mevcut'],
    },
    email: {
      type: String,
      required: [true, 'Lütfen mail alanını gönderiniz'],
      unique: [true, 'Bu mailde bir kullanıcı mevcut'],
    },
    password: {
      type: String,
      required: [true, 'Lütfen şifre alanını gönderiniz'],
      select: false,
    },
    img: {
      type: String,
      // required: [true, 'Lütfen resim alanını gönderiniz'],
    },
    country: {
      type: String,
      required: [true, 'Lütfen ülke alanını gönderiniz'],
    },
    phone: {
      type: String,
      required: false,
    },
    desc: {
      type: String,
      required: false,
    },
    isSeller: {
      type: Boolean,
      default: false,
    },
  },
  // ayarlar
  //timestamp sayesinde mongoose oluşturulma ve güncellenme tarihi ekler
  { timestamps: true }
);

// model oluşturma
export default mongoose.model('User', userSchema);
