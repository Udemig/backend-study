// temp > güncelleincek  değiştirilecek şablon html
// product > ürünün bilgileri
// export et
module.exports = (temp, product) => {
  // metni düzenleme
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIĞTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  //   oluştudğumuz füzenlenmiş metni döndürme
  return output;
};
