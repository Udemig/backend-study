// Bir fonksiyonu parametre olarak alır
// fonksiyonu çalıştırır
// hata oluşursa hata middleware'ine yönlendirir
// bütün async fonksiyonlar bu fonk. ile sarmalayıcağız

module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
