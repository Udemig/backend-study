// yorum içieriği / 3 yıldız / oluştutlma tarihi / hangi tura atıldığının referansı / kullanıcının referansı

const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Yorum içierği boş olamaz'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    // parent referanslar
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Yorumun hangi tura atıldığını gönderin'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      red: 'User',
      required: [true, 'Yorumu hangi kullanıcının attığını gönderin'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name',
  });

  next();
});

// Bir tur için ortalama yorum hesaplayacak fonksiyon
// review schemasına ekledik
reviewSchema.statics.calcAvarageRatings = async function (tourId) {
  // gönderilen tur için ortalama değerlendirme
  // ve toplam yorum sayısını hesaplar
  const stats = await this.aggregate([
    // 1) gönderilen turId'siyle eşeleşen yorumları al
    {
      $match: { tour: tourId },
    },
    // 2) toplam yorum sayısı ve ort. rating
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 }, // tura gelen toplam yorum sayısı
        avgRating: { $avg: '$rating' }, // ort rating
      },
    },
  ]);

  if (stats.length > 0) {
    // istatistik sonuçlarıyla, ilgili turu güncelle
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAvarage: stats[0].avgRating,
      ratingQuantity: stats[0].nRating,
    });
  } else {
    // eğerki hiç yorum yoksa varsasayılan değelere ayarla
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAvarage: 4,
      ratingQuantity: 0,
    });
  }
};

// TODO KONTROL ET
// bütün kullanıcı ve tur kombinosyonları benzersiz olmalı
// eğerki bir kullanıcı aynı tura ikinci yorumu atarsa hata verir
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// her yeni yorum atıldığında ratingi hesapla
reviewSchema.post('save', function () {
  // this oluşturlan yoruma denk gelir
  // this constuctor ise yorumu oluşturan model
  this.constructor.calcAvarageRatings(this.tour);
});

// yorum her güncellendiğinde ve silindiğinde
// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.post(/^findOneAnd/, async function (doc) {
  await doc.constructor.calcAvarageRatings(doc.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
