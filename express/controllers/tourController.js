const fs = require('fs');

// turların verisini alma
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

//! Fonksiyonlar
//! Route Handlers
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    reqTime: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};
exports.getTour = (req, res) => {
  // id belirleme
  const newId = tours[tours.length - 1].id + 1;
  // gönderilen tura id ekleme
  const newTour = Object.assign({ id: newId }, req.body);
  // turlar disini gğncelleme
  tours.push(newTour);
  // json dosyasını güncelleme
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};
exports.createTour = (req, res) => {
  const id = Number(req.params.id);

  // id geçersiz mi kontrol >
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Geçersiz Id',
    });
  }

  //   id geçersiz değilse >
  const tour = tours.find((i) => i.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};
exports.updateTour = (req, res) => {
  // id geçerli mi kontrol
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Geçersiz Id',
    });
  }

  //   id geçerliyse turu güncelle
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Güncel Tur Verisi',
    },
  });
};
exports.deleteTour = (req, res) => {
  // id geçerli mi kontrol
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Geçersiz Id',
    });
  }

  //   id geçerliyse turu güncelle
  res.status(204).json({
    status: 'success',
    data: {
      tour: null,
    },
  });
};
