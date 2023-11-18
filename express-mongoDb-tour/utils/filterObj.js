// objeden sadece izin veridiğimiz
// alanlarla yeni obje tanımlar
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  // objeyi diziye çevir
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

module.exports = filterObj;
