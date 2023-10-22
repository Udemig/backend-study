const express = require('express');
const {
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  createTour,
} = require('../controllers/tourController');

// router oluşturma
const router = express.Router();

// router'a yapılan isteklerde
// çalışacak fonksiyonları belirleme
router
  .route('/')
  .get(getAllTours) //
  .post(createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

//   app.js de kullanmak için export etme
module.exports = router;
