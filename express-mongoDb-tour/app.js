const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
var hpp = require('hpp');

const app = express();

// * 1 ) Global MiddleWare'ler

// güvenlik için header'lar ekler
app.use(helmet());

// isteğin detayını konsola yazan 3.parti middleware
app.use(morgan('dev'));

// bir ip adresinden gelebilecek istek sınırını belirle
const limiter = rateLimit({
  max: 100, // aynı ip'den 1 saati içinde gelebilecek max istek
  windowMs: 60 * 60 * 1000, // ms cinsinden 1 saat
  message:
    '1 saat içinde atabileceğiniz max istek hakkına ulaştınız. Daha sonra tekrar deneyin!',
});

app.use('/api', limiter);

// isteğin body kısmını işliyor
app.use(express.json({ limit: '10kb' }));

// Data sanitization - Verileri Sterilize Etme - Query Injection;
// isteğin body / params / header kısmına eklenen her türlü operatörü kaldır
app.use(mongoSanitize());

// html kodunun içerisine saklanan jsleri tespi eder ve bozar
app.use(xss());

// Parameter Pollution > Parametre kirliliğini kaldır
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuatity',
      'ratingsAvarage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

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
