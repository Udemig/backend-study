const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// mergeParams sayuesinde iki farklı route'un
// aynı parametreleri kullanabilmesini sağladık
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/') // "/reviews"
  .get(reviewController.getAllReviews)
  .post(
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;
