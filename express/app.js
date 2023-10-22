const express = require('express');
var morgan = require('morgan');
var tourRouter = require('./routes/tourRoutes');
var userRouter = require('./routes/userRoutes');

const app = express();
app.use(express.json());
const port = 3000;

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

app.listen(port, () => {
  console.log(`Uygulama ${port} portunda çalışıyor...`);
});
