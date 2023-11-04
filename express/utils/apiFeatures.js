class APIFeatures {
  constructor(query, queryParams) {
    this.query = query;
    this.queryParams = queryParams;
  }
  // 1) Filtreleme
  filter() {
    // 1-a) Klasik filtreleme
    // istek ile beraber gelen parametreler
    const queryObj = { ...this.queryParams };
    // sort , limit, fields ,page  alanlarını filtrelemek için kullılan
    // queryObj isimli objeden çıkart
    const excludedFields = ['sort', 'limit', 'page', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1-b) Gelişmiş Filtreleme (operatörleri devreye sokma)
    let queryString = JSON.stringify(queryObj);

    // gte lte lt gt > bunların başına "$" ekle
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (found) => `$${found}`
    );

    // filtreleme ayarlarını olluştur
    this.query = this.query.find(JSON.parse(queryString)); //url'deki parametrelere göre filtreleme yapar

    return this;
  }

  // 2) Sıralama
  sort() {
    if (this.queryParams.sort) {
      // veriyi sort methodnun istediği formata getirdik
      const sortBy = this.queryParams.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  // 3) Alan Limitleme
  limit() {
    if (this.queryParams.fields) {
      const fields = this.queryParams.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  // 4) Sayfalama
  paginate() {
    // skip > kaç tane döküman atlanıcak
    // limit > max kaç döküman alınıcak
    const page = this.queryParams.page * 1 || 1; // 5 sayfadki
    const limit = this.queryParams.limit * 1 || 100; // 20 ürün
    const skip = (page - 1) * limit; // 80 tane atla
    this.query = this.query.skip(skip).limit(limit); // 7-8-9

    return this;
  }
}

module.exports = APIFeatures;
