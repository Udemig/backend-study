import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';
import gigRoute from './routes/gig.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

// .env dosyasındaki veilere erişimimizi sağlar
dotenv.config();

// veritbanaı ile bağlantı kur
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log('Veritabanı ile bağlantı kuruldu'))
  .catch((error) =>
    console.log('Veritabanına bağlanırken hata oluştu', error)
  );

// body kısmında gelen verileri kabul et
app.use(express.json());
// cookileri al
app.use(cookieParser());
// react uygulamsından gelen isteklere cevap ver
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// route tanımlamama
app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/gigs', gigRoute);

// hata yönetimi
app.use((err, req, res, next) => {
  const errStatus = err.status || 500;
  const errMessage = err.message || 'Üzgünüz bir şeyler yanlış gitti';

  return res.status(errStatus).json({
    statusCode: errStatus,
    message: errMessage,
  });
});

app.listen(8000, () => {
  console.log('API 8000 portu dinlemeye başladı');
});
