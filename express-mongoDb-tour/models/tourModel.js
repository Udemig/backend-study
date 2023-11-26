const mongoose = require('mongoose');
var slugify = require('slugify');
var validator = require('validator');

//!  Şema / Şablon
//* Veri tabanına ekleyeceğimiz dökümanın hangi değerler
//* hangi tipteki verilere sahip olmasnı belirlediğmiz.
//* varsayılan değerlerini / benzersiz olma durumu +++
//* gibi durumları belirlediğimiz şablondur
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tur mutlaka name alanına sahip olmalıdır'],
      unique: true,
      minLength: [10, 'Tur ismi en az 10 karakter olamalıdır'],
      maxLength: [40, 'Tur ismi en fazla 40 karakter olamalıdır'],
      // validate: [
      //   validator.isAlpha,
      //   'İsimde sadce karakterler olmalıdır',
      // ],
    },
    duration: {
      type: Number,
      required: [
        true,
        'Tur mutlaka duration alanına sahip olmalıdır',
      ],
    },
    maxGroupSize: {
      type: Number,
      required: [
        true,
        'Tur mutlaka maxGroupSize alanına sahip olmalıdır',
      ],
    },
    difficulty: {
      type: String,
      required: [
        true,
        'Tur mutlaka difficulty alanına sahip olmalıdır',
      ],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message:
          'Zorluk sadece bunlardan biir olabilir: easy,medium,difficult',
      },
    },
    ratingsAvarage: {
      type: Number,
      default: 4.0, // rating belirlemezsem devreye girer (varsayılan)
      min: 1,
      max: 5,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Tur mutlaka price alanına sahip olamalıdır'],
    },
    priceDiscount: {
      type: Number,
      // custom validator > kendi yazdığımız doğrulamalar
      validate: {
        validator: function (value) {
          return value < this.price;
        },
        message: 'İndirim fiyatı asıl fiyattan büyük olamaz',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [
        true,
        'Tur mutlaka summary alanına sahip olamalıdır',
      ],
    },
    description: {
      type: String,
      maxLength: 2000,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [
        true,
        'Tur mutlaka imageCover alanına sahip olamalıdır',
      ],
    },
    images: [String],
    startDates: [Date],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    slug: String,
    startLocation: {
      // GeoJson
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      description: String,
      coordinates: [Number],
      adress: String,
    },

    // lokasyonları embeddig yöntemiyle tutma
    // dizi tanımlamak çok önemli her bir lokasyon turun içine
    // gömülmüş bir döüman olucaj
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        adreess: String,
        description: String,
        day: Number,
      },
    ],

    // tur rehberleri
    guides: [
      {
        type: mongoose.Schema.ObjectId, // burayı bir dökümanın id'si gelicek
        ref: 'User',
      },
    ],
  },

  // ayarları belirleme
  // sanal değerleri aktif ettik
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// birden fazla filtre için  index tanımlama
tourSchema.index({ price: 1, ratingsAvarage: -1 });
// hangi alan için coğrafi filtreleme yapıcaksak
// o alan için index oluşturmak zorundayız
tourSchema.index({ startLocation: '2dsphere' });

//! virtual property (sanal değer)
// veritabanında tutmamıza değmeyecek
// ama frontend tarafından istenenelin veriler
// isteğe cevap  göndermeden önce ekleme
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//! virtual populate
// normalde yorumları parent refeerance ile turlara bağlamıştık
// ama turları aldığımız zzaman yorumlara ertişemiyoruz.
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour', // referans aladığımız dökümanın hagi alanına göre bu döküma ekliyecez
  localField: '_id', // diğer döükmandan aldığımız alanın bü dokumandaki karşılığı
});

//! document middleware
//* iki olay arasında çalışan yapı
//* ör: verinin alınıp veritabanına kaydedilmesi sırasında
tourSchema.pre('save', function (next) {
  // console.log('deneme', this); // eklenen dökğmana erişimimi sağlar
  this.slug = slugify(this.name, { lower: true });
  next();
});

// belirl ibir işlemden sonra fonk çalıştırma
tourSchema.post('save', function (doc, next) {
  console.log('kaydedilen döüman', doc);
  next();
});

//! query middleware
// sorgulardan önce veysa sonra devreye giren middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

//* Populating (Doldurma)
// MongoDB'de populating bir belgedeki belirli bir alanın,
// o alaana referans veren diğer bir belgedki belegelerle doldurlması
// anlamına gelir. Yani poplating, referansları gerçek verilerle
// doldurmayı sağlar
tourSchema.pre(/^find/, function (next) {
  this.populate({
    // doldurulması gereken alan ismi
    path: 'guides',
    // doldururken istemediğimiz alanları tanımlama
    select:
      '-__v -passwordChangedAt -passwordResetExpires -passwordResetToken',
  });
  next();
});

// Aggregation Middleware
// istatistik hesaplarken ilk adımda gizli olanları çıkarma
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });

// model sayesinde schema yola çıkarak dökümanlar oluşturabilir
// ve bunları veritabanına kaydedebiliriz.
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
