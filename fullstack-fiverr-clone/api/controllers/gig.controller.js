import Gig from '../models/gig.model.js';
import error from '../utils/error.js';

export const createGig = async (req, res, next) => {
  // kulalnıcnı satıcı mı kontrol etme
  if (!req.isSeller)
    return next(error(403, 'Sadece satıcılar hizmet oluştutabilir'));

  // yeni hizmet oluşturma
  const newGig = new Gig({
    userId: req.userId,
    ...req.body,
  });

  // hizmeti kaydet
  try {
    const savedGig = await newGig.save();
    res.status(201).json({
      message: 'Başarıyla oluştutuldu',
      gig: savedGig,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteGig = async (req, res, next) => {
  try {
    //1) urldeki idden yola çıakrak hizmetin bilhelere eriş
    const gig = await Gig.findById(req.params.id);

    // 2) eğerki hizmeti silmey çalışan kişi
    // hizmet ile birlikte gelen userId ile eşit mi kontrol
    // yani herkes kendi hizmetini silebilecek
    if (gig.userId.toString() !== req.userId)
      return next(
        error(
          403,
          'Sadece kendi oluşturduğunuz hizmetleri silebilirsiniz.'
        )
      );

    //3) üstteki koşuldan geçersek sil ve cevap gönder
    await Gig.findByIdAndDelete(req.params.id);
    res.status(204).json({
      message: 'Başrıyla silindi',
    });
  } catch (err) {
    next(err);
  }
};

export const getGig = async (req, res, next) => {
  try {
    //1) urldeki id'den yola çıkarak hizmetin bilgelerine eriş
    const gig = await Gig.findById(req.params.id).populate('userId');

    if (!gig)
      return next(error(404, "Bu id'ye sahip bir hizmet bulunamadı"));

    res.status(200).json({
      gig,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllGigs = async (req, res, next) => {
  try {
    //1) bütün hizmetleri al
    const gigs = await Gig.find();

    res.status(200).json({
      gigs,
    });
  } catch (err) {
    next(err);
  }
};
