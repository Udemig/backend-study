const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

// middleware >  alias : takma ad
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAvarage,price';
  req.query.fields = 'name,price,ratingsAvarage,summary,difficulty';
  // bir sonraki eyleeme çalışma izni veririr
  next();
};

//! Fonksiyonlar
//! Route Handlers
// bir yıl içiresindeki her ay için o ay başlayan tur saıyısı
// başalayan turların isimleri
// Ocak > 2 > Orman > Dağ |Şubat > 3 > x,y,z
exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = Number(req.params.year);

    const plan = await Tour.aggregate([
      // 1) başlama tarihi dizisindeki her bir eleman için turun bir kopyasını oluşturs
      {
        $unwind: '$startDates',
      },
      // 2) belirli yıldaki turları al
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },

      // 3) belirli ayda başlayanları sayısını belirle
      {
        $group: {
          _id: { $month: '$startDates' }, // aylara göre gurupla
          numTourStarts: { $sum: 1 }, // ay içindeki tur sayısını hesapla
          tours: { $push: '$name' }, // o ay içindeki turların isimlerini ekle
        },
      },

      // 4) rapordaki objelere "ay" elemanı ekle
      {
        $addFields: { month: '$_id' },
      },

      // 5) objelerden _id propertysini çıkarma
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    //   id geçerliyse turu güncelle
    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      error: err,
    });
  }
};

//
//
//
//
exports.getTourStats = async (req, res) => {
  try {
    // Aggregate Pipeline
    // Raporlama Adımları
    const stats = await Tour.aggregate([
      // 1.Adım )  ratingi 4 ve üstü olanları alma
      {
        $match: { ratingsAvarage: { $gte: 4.0 } },
      },
      // 2.Adım ) gruplandırma
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          tourCount: { $sum: 1 },
          avgRating: { $avg: '$ratingsAvarage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      // 3.Adım ) sıralama oluşturdğumuz istatistikleri sıralama
      {
        $sort: { avgPrice: 1 },
      },
      // 4.Adım ) İstemediğimiz değerleri çıkar
      {
        $match: { minPrice: { $gte: 400 } },
      },
    ]);

    //   id geçerliyse turu güncelle
    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      error: err,
    });
  }
};

exports.getAllTours = async (req, res) => {
  try {
    // api özellikleri için oluştudğumuz sınıfın methdolarını kullanma
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limit()
      .paginate();

    // Son) Komutları çalıştır
    const tours = await features.query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'fail',
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
