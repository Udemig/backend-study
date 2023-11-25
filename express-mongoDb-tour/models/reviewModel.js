// yorum içieriği / 3 yıldız / oluştutlma tarihi / hangi tura atıldığının referansı / kullanıcının referansı

const mongoose = require('mongoose');

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

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
