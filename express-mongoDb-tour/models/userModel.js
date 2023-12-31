const { default: mongoose } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Lütfen isminizi giriniz'],
  },

  email: {
    type: String,
    required: [true, 'Lütfen mailinizi giriniz'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Lütfen geçerli bir email giriniz'],
  },

  photo: {
    type: String,
    default: 'defaultpic.webp',
  },

  password: {
    type: String,
    required: [true, 'Lütfen şifre giriniz'],
    minLength: 8,
    select: false, // find isteği ile kullanacılar çağrıdlığında şifreleri alınmasın
  },

  passwordConfirm: {
    type: String,
    required: [true, 'Lütfen şifre onayını giriniz'],
    validate: {
      // bu sadece yeni kullanıcı oluştururken > create > save de çalışır
      validator: function (value) {
        return value === this.password;
      },
      message: 'Onay şifreniz eşleşmiyor',
    },
  },

  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },

  passwordChangedAt: Date,

  passwordResetToken: String,

  passwordResetExpires: Date,

  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// Veritabanıan kaydetmeden önce veriyi şifrele
// ve passwordConfirmi kaldır
userSchema.pre('save', async function (next) {
  // şifre değişmediyse tekrardan koruma işlemini aktif et
  if (!this.isModified('password')) return next();

  // Hashing
  // Belirli algoritmalar kullanarak verininin benszersiz şifrelenmiş verisyonunu oluştur
  // Aynı girdi için her zman aynı çıktı oluşturlu
  this.password = await bcrypt.hash(this.password, 12);

  // Şifreye reastgele benzersiz karakterler ekler
  // normal şifre >  deneme:1234
  // hashlenmiş şifre >  sdg431@$£#$₺sadg..sad
  // salt'lanmış şifre >  sdg431@$£#$₺sadg..sadsdhı24h78349t736wer

  // onay şifresini sil
  this.passwordConfirm = undefined;
});

// eğerki şifre değişmişse şifre değişme tarihini ekle
userSchema.pre('save', function (next) {
  // şifre değişmediyse veya yeni döküman oluştuysa bir şey yapma
  if (!this.isModified('password') || this.isNew) return next();

  // şifre değişim tarihinin her zaman yeni oluşturulan tokenden
  // önce olması için değişim tarihini tanımlarken 1 saniye çıkarttık
  this.passwordChangedAt = Date.now() - 1000;

  next();
});

// kullanıcıyı veirtabanında almaya çalışmadan önbce çalışırı
// inaktif olan hesapları aradan çıkartır
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// hashlenmiş şifree ile orjinalini karşılaştıran fonk. oluştur
// ve kullanıcı modeline ekle
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// verilen tarihten sonra şifre değiştirilmiş mi kontrol eder
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    // şifre değiştirme tarihini jwt tarihi ile aynı formata getirme
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    // jwt alındıktan sonra şifre değişmiş mi?
    return JWTTimestamp < changedTimeStamp;
  }

  return false;
};

// şifre sıfırlama tokeni oluştur
// bu token reset paswsword a atılan istekler kullanılcak
// 10dakikalık bir geçerlilik süresine sahip olucak
userSchema.methods.createPasswordResetToken = function () {
  // şifres sıfırlama işlemini tamamlamak için kullanıcığı token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // tokenı şifrele ve veritabanında sakla
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // tokennin geçerliği olucağı son tarihi belirle (10 dk sonrası)
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  console.log(this);

  // fonksiyonun çağrıldığı yerer döndür
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
