//! komut node klasör_yolu --import/delete
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');
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

// turlar dosyasındaki verilei oku
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`)
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`));

// tüm verileri veritababaınıa aktar
const importData = async () => {
  try {
    await Tour.create(tours); // dizideki her bir elmanı kaydeder
    await Review.create(reviews);
    await User.create(users, { validateBeforeSave: false });
    console.log('kaydetme başarılı');
    process.exit(); // terminaldeki görevi bitirir
  } catch (err) {
    console.log(err);
  }
};
// veritabanını temizle
const deleteData = async () => {
  try {
    await Tour.deleteMany(); // koşul vermediğimiz için bütün dökümanları siler
    await Review.deleteMany();
    await User.deleteMany();
    console.log('silme başarılı');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  // veritabanına verileri ekle
  importData();
} else if (process.argv[2] === '--delete') {
  // veritabnaını temizle
  deleteData();
}
