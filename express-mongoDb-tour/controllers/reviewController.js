const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// bütün yorumları getirir
exports.getAllReviews = factory.getAll(Review);
// exports.getAllReviews = catchAsync(async (req, res, next) => {
//   // bütün turları
//   const reviews = await Review.find(filter);

//   res.status(200).json({
//     status: 'success',
//     results: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });

exports.setTourUserIds = (req, res, next) => {
  // eğerki hangi tura yorum attığım isteği body'sinde geldiyse
  // bir şey yapma ama isteğin url'inde geldiyse onu al ve body'e ekle
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// yeni yorum oluşturur
exports.createReview = factory.createOne(Review);

// yorum sil
exports.deleteReview = factory.deleteOne(Review);

// yorumu güncelle
exports.updateReview = factory.updateOne(Review);

// bir yorum al
exports.getReview = factory.getOne(Review);
