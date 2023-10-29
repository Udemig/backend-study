const Tour = require('../models/tourModel');

// const tours = await Tour.find()
//   .where('duration')
//   .equals(5)
//   .where('difficulty')
//   .equals('easy');

//! Fonksiyonlar
//! Route Handlers
exports.getAllTours = async (req, res) => {
  try {
    // bütün tur verisini alır
    const tours = await Tour.find(req.query); //url'deki parametrelere göre filtreleme yapar

    res.status(200).json({
      status: 'success',
      reqTime: req.requestTime,
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(400).json({
      status: fail,
      error: err,
    });
  }
};
exports.getTour = async (req, res) => {
  try {
    // id'sine göre kolleksiyondan bir dökuman getirme
    const tour = await Tour.findById(req.params.id);
    // const tour = await Tour.findOne({_id: req.params.id });

    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fal',
      error: err,
    });
  }
};
exports.createTour = async (req, res) => {
  try {
    //  mongo db'deki tours kolleksiyonuna veriyi dokuman olarak kaydet
    const newTour = await Tour.create(req.body);

    res.status(200).json({
      status: 'success',
      data: { tour: newTour },
    });
  } catch (err) {
    // hata olursa hatayı gönder
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.updateTour = async (req, res) => {
  try {
    // id'sine göre bir turu bulur ve günceller
    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      req.body
    );

    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      error: err,
    });
  }
};
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    //   id geçerliyse turu güncelle
    res.status(204).json({
      status: 'success',
      data: {
        tour: null,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      error: err,
    });
  }
};
