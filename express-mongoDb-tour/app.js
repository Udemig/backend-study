const express = require('express');
var morgan = require('morgan');

var tourRouter = require('./routes/tourRoutes');
var userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');

const app = express();
app.use(express.json());

// * 1 ) MiddleWare'ler

// isteğin detayını konsola yazan 3.parti middleware
app.use(morgan('dev'));

// yapılan isteğe  zaman ekleyen middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Route MiddleWare
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// tanımlanmayan route'a istek atıllırsa uyarı ver
app.all('*', (req, res, next) => {
  next(new AppError('Yol Tanımlanmadı', 404));
});

// Herhnagi bir yerde  hata olduğunda devereye girer
// çalışması için next'e parameter vermek gerekir
app.use((err, req, res, next) => {
  // hata yolunu ekrna basar
  console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// export
module.exports = app;
