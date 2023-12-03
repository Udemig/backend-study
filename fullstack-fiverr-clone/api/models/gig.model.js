import mongoose, { Schema } from 'mongoose';

const gigSchema = new Schema(
  {
    userId: {
      type: Schema.ObjectId,
      ref: 'User',
      required: [true, 'Lütfen userId alanını gönderiniz'],
    },
    title: {
      type: String,
      required: [true, 'Lütfen title alanını gönderiniz'],
    },
    desc: {
      type: String,
      required: [true, 'Lütfen açıklama alanını gönderiniz'],
    },
    avgRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 1,
    },
    totalRating: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Lütfen title alanını gönderiniz'],
    },
    cover: {
      type: String,
      required: false,
    },
    images: {
      type: [String],
      required: false,
    },
    shortTitle: {
      type: String,
      required: true,
    },
    shortDesc: {
      type: String,
      required: true,
    },
    deliveryTime: {
      type: Number,
      required: true,
    },
    revisionNumber: {
      type: Number,
      required: true,
    },
    features: {
      type: [String],
      required: false,
    },
    sales: {
      type: Number,
      default: 0,
    },
  },
  // ayarlar
  //timestamp sayesinde mongoose oluşturulma ve güncellenme tarihi ekler
  { timestamps: true }
);

// model oluşturma
export default mongoose.model('Gig', gigSchema);
