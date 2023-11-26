const express = require('express');
const {
  getAllTours,
  aliasTopTours,
  getMonthlyPlan,
  getTourStats,
  getToursWithin,
  getTour,
  updateTour,
  deleteTour,
  createTour,
  getDistances,
} = require('../controllers/tourController');

const authController = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRoutes');

// router oluşturma
const router = express.Router();

//! nested route tanımlama
router.use('/:tourId/reviews', reviewRouter); // "/tour/:tourId/reviews"

// top-five-best çok kullanılan bir route olsun
// bizde onun için frontend'den parametre gelemese bile
// filtreleme yapıcak ayrıca bir route oluşturduk
// aliasTopTours ara yazılım devreye girip gerekli param. ekler
// getAllTours çalışıp bu parametrele göre verileri döndürür
router.route('/top-five-best').get(aliasTopTours, getAllTours);

// gerçek seneryo: admin paneli için zorluğa göre turların istastiklerini hesapla
router.route('/tour-stats').get(getTourStats);

// gerçek seneryo: belirili yıl için her ay başlıyacak tur sayısı ve isimleri
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restricTo('admin', 'lead-guide', 'guide'),
    getMonthlyPlan
  );

// belirli alan içerisndeki turları bulma
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

// uzaklıklaırnı bulma
router.route('/distances/:latlng/unit/:unit').get(getDistances);

// router'a yapılan isteklerde
// çalışacak fonksiyonları belirleme
router
  .route('/')
  .get(getAllTours) //
  .post(
    authController.protect,
    authController.restricTo('admin', 'lead-guide'),
    createTour
  );

router
  .route('/:id')
  .get(getTour) //
  .patch(updateTour) //
  .delete(
    authController.protect, // oturum kontrolü
    authController.restricTo('admin', 'lead-guide'), // rol kontrolü
    deleteTour
  );

//   app.js de kullanmak için export etme
module.exports = router;
