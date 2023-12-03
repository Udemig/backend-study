const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// bütün döükman tipleri için bir tane döküman silemeye
// yarayan ortak oalarak kullanılacak method
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('Bu idye sahip döküman bulunamadı'));
    }

    //   id geçerliyse turu güncelle
    res.status(204).json({
      status: 'success',
      data: {
        tour: null,
      },
    });
  });

// bütun dökünalar için orta kullanılabilcek güncelleme methodu
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // id'sine göre bir turu bulur ve günceller
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!doc) {
      return next(
        new AppError(
          `Bu id için ${Model.collection.collectionName} verisinde dökuman bulunamadı`,
          404
        )
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

// oluşturmak için
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    //  mongo db'deki tours kolleksiyonuna veriyi dokuman olarak kaydet
    const newDoc = await Model.create(req.body);

    res.status(200).json({
      status: 'success',
      data: { data: newDoc },
    });
  });

// id'sine göre kolleksiyondan bir dökuman getirme
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    // sorguyu oluştur
    let query = Model.findById(req.params.id);

    // eğerki populate ayarları gönderilyse yapılan sorguya ekle
    if (popOptions) query = query.populate(popOptions);

    // sorguyu çalıştır
    const doc = await query;

    if (!doc) {
      return next(
        new AppError(
          `Bu id için ${Model.collection.collectionName} verisinde dökuman bulunamadı`,
          404
        )
      );
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

// hepsni al
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //* "/reviews" > bütüun yorumları getir
    //* "/tours/tur_id/reviews" > bu tura atılan yorumları getir
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // api özellikleri için oluştudğumuz sınıfın methdolarını kullanma
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limit()
      .paginate();

    // Son Komutları çalıştır
    const docs = await features.query.explain();

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: { docs },
    });
  });
