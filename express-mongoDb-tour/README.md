# Komutlar

- Veritabanını temizler:
  `node ./dev-data/data/import-dev-data.js --delete`

- Veritabanına hazır verileri aktarır:
  `node ./dev-data/data/import-dev-data.js --import`

# Güvenlik Paketleri

- `express-rate-limit` > ayni ip adresinden gelen istekleri sınırlar
- `helmet` > güvenlik header'ları ekler
- `express-mongo-sanitize` > body/param ile enjekte edilmeye çalışan komutları bozar
- `xss-clean` > enjekte edilmeye çalışan html / js'yi bozar
- `hpp` > parametre kirliliğini ortadan kaldırır (aynı isimdeki paramtrelerli görmezden gelir)

# Data Modeling

- Bir uygulamanın ihtiyaçlarına göre uygun bir şekilde veriyi organize etme sürecidir

# Veriler arasonda farklı türde ilişkile kurulabilir

1. Referencing (Referans) / Normalization:

- Tanım: Referans, belirli belgedki veirleri başka bir belgeye referanslar kullanrak ilişkilendirmeye yarar. Yani, iki belge arasınd ailşki vardır, ancak gerçek veri bir belgede saklnırken diğer belgelerde sadece referans bilgisi bulunur

2. Embedding (Gömme) / Denormalization:

- Tanım: Belirli bir belge içersine diğer belgeleri doğrudan gömmeyi ifade eder.

# Verilerin birbiri arasında ilişi tipleri

- 1:1 (One to One): Bu ilişki türünde, bir kayıt türündeki bir öğte , d,ğer kayıt türündeki yalnca bir öğe ile ilişkilidir.

- 1:Many (One to Many): Bu ilişki türünde, birinci taraftaki döküman ikincii taraftaki bir den çok dökmanla eşleşebilir.

- Many:Many (Many to Many): Bu ilişki türünde, heriki taraftaki öğeler birbirleriyle çoklu ilişkiye sahip olabilir. Birinci kolleksiyondak, döüman ikinci kollekisyondaki dökümanlardan bir çoğu ile işki kurabilir. Aynısını ikinci kolleksiyon içinde geçerli

# Hangi Durumda Embedding Hangi Durumda Refference kullanılrı ?

                        #Embedding                           #Referencing

1. İlişki Tipi: 1:Few, 1:Many 1:Many, 1:Ton, Many:Many

2. Erişim Durumu: Okuma daha yüksekse Veri Çok güncelleniyorsa
   Veri Çok Değişmiyorsa Düşük (Okuma / Yazma) oranı  
    Yüksek (Okuma/Yazma) oranı

3. Yakınlık Durumu: Dökümanlar birbiryle çok alaklı Bazı durumlarda birlikte
   kullanılması gerekiyorsa

# Referance Tipleri

1. Child Refferance (Çocuk Referansı)

2. Parent Refferance (Ebevyn Referansı)

3. Two Way Refferance (İki Yönlü Referans)
