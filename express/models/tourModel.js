const mongoose = require('mongoose');

//!  Şema / Şablon
//* Veri tabanına ekleyeceğimiz dökümanın hangi değerler
//* hangi tipteki verilere sahip olmasnı belirlediğmiz.
//* varsayılan değerlerini / benzersiz olma durumu +++
//* gibi durumları belirlediğimiz şablondur
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tur mutlaka name alanına sahip olmalıdır'],
    unique: true,
  },
  duration: {
    type: Number,
    required: [true, 'Tur mutlaka duration alanına sahip olmalıdır'],
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
  },
  ratingsAvarage: {
    type: Number,
    default: 4.0, // rating belirlemezsem devreye girer (varsayılan)
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'Tur mutlaka price alanına sahip olamalıdır'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'Tur mutlaka summary alanına sahip olamalıdır'],
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
});

// model sayesinde schema yola çıkarak dökümanlar oluşturabilir
// ve bunları veritabanına kaydedebiliriz.
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
