// file system özelliklerini bu dosyada kullanbilecez
const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

// Dosya Sistemi
//! Senkron > Blocking
//* Senkron İşlemler sırayla gerçekleşir
//* Senk işlemler bir işlem tammalandığında diğer işlem için beklemek zorunda kalır
//* bu nedenler tek bir işlem için uzun süre beklediimiz durumda tüm uygulama durabilir.
//* Dosya okuma veritabanı sorguları gini senkron işlemler
//* uygulmanın tümünün bloke olmasına sebep olabilir

// Dosya Okuma
// const text = fs.readFileSync('./txt/input.txt', 'utf-8');

// // Dosya Yazma
// const newText = `Avakoda hakkında edindiğim bilgiler:\n ${text}. \n Oluşturulma Tarihi: ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', newText);
// console.log('Dosya başarıyla oluşturuldu');

//! ASenkron > NonBlocking
// * bu fonksiyon asenkron bir şekilde soyayı okumaya başlar
// * okumayı bitirdiinde geri çağırma (callback) fonk. çalıştırır
// fs.readFile('./txt/start.txt', 'utf-8', (err, fileName) => {
//   if (err) return console.log('HATA VAR!! 💥');
//   console.log('1.okuma işlemi', fileName);
//   // ilk okumadan aldığımız dosyayı okuma
//   fs.readFile(`./txt/${fileName}.txt`, 'utf-8', (err, data) => {
//     console.log('2. okumdan elde eidldi', data);
//     // üçüncü olarak yeni dosya oluştur
//     fs.writeFile(`./txt/final.txt`, data, () => {
//       console.log('3. dosya yazma işlemi sonlandı');
//     });
//   });
// });

// console.log('Kullanıcı Giriş Çıkış İşlemleri');

//! Server
// routing > isteğin url'ine göre ekrana farklı içerikler basma

// sayfa şablonlarına erişme
let tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
let tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
let tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

// json formatı
const data = fs.readFileSync(
  `${__dirname}/dev-data/data.json`,
  'utf-8'
);

// js de kullanaiblir format
const dataObj = JSON.parse(data);

// her istek atıdğında çalışıcak fonk.
const server = http.createServer((req, res) => {
  // url'deki parçalara erişme
  const { query, pathname } = url.parse(req.url, true);
  console.log(query.id, pathname);

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });

    // meyvelerDizisi dön ve her meyve için kart oluştur
    const cardHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');

    // kartlar alanına oluştudğumuz html'i ekleme
    const output = tempOverview.replace(
      '{%PRODUCT_CARDS%}',
      cardHtml
    );

    //* res.end >  döndürülecek cevabı belirle
    res.end(output);
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    // urldeki id ye göre ürünü bulma
    const product = dataObj[query.id];
    // template'i ürüne göre ayarla
    const output = replaceTemplate(tempProduct, product);
    // client'e html'i gönder
    res.end(output);
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
    });
    res.end(data);
  } else {
    // headerlerı düzenleme
    res.writeHead(404, {
      'Content-Type': 'text/html',
      Date: Date.now(),
    });
    res.end('<h1>Aradaginiz Sayfa Bulunamadi</h1>');
  }
});

// belirli porttan gelen istekleri dinlemeye başlatma
server.listen(8000, '127.0.0.1', () => {
  console.log('8000 port dinlemeye başlandı');
});
