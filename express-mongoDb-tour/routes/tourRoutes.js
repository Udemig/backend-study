const express = require('express');
const {
  getAllTours,
  aliasTopTours,
  getMonthlyPlan,
  getTourStats,
  getTour,
  updateTour,
  deleteTour,
  createTour,
} = require('../controllers/tourController');

// router oluşturma
const router = express.Router();

// top-five-best çok kullanılan bir route olsun
// bizde onun için frontend'den parametre gelemese bile
// filtreleme yapıcak ayrıca bir route oluşturduk
// aliasTopTours ara yazılım devreye girip gerekli param. ekler
// getAllTours çalışıp bu parametrele göre verileri döndürür
router.route('/top-five-best').get(aliasTopTours, getAllTours);

// gerçek seneryo: admin paneli için zorluğa göre turların istastiklerini hesapla
router.route('/tour-stats').get(getTourStats);

// gerçek seneryo: belirili yıl için her ay başlıyacak tur sayısı ve isimleri
router.route('/monthly-plan/:year').get(getMonthlyPlan);

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
