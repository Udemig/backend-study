const mongoose = require('mongoose');
const app = require('./app');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

// şifre alanını tamamamlama
const DB = process.env.DATABASE.replace(
  '<PASS>',
  process.env.DATABASE_PASS
);

// veritabanı ile bağlantı kurma
mongoose
  .connect(DB)
  .then(() => console.log('Veritabanı ile bağlantı kuruldu'))
  .catch(() => console.log('Veritabanı ile bağlantı başarısız!!!'));

//   server'ı ayağa kaldır
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Uygulama ${port} portunda çalışıyor...`);
});
