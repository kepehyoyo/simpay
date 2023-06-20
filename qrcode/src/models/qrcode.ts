import mongoose from 'mongoose';

 
// An interface that describes the properties
// that are requried to create a new QRCode
interface QRCodeAttrs {
  data: string;
  qrCodeId: string;
  qrCodeUrl: string;
}

// An interface that describes the properties
// that a QRCode Model has
interface QRCodeModel extends mongoose.Model<QRCodeDoc> {
  build(attrs: QRCodeAttrs): QRCodeDoc;
}

// An interface that describes the properties
// that a QRCode Document has
interface QRCodeDoc extends mongoose.Document {
  data: string;
  qrCodeId: string;
  qrCodeUrl: string;
}

const qRCodeSchema = new mongoose.Schema(
  {
    data: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 1000,
    },
    qrCodeId: {
      type: String,
      required: true,
      unique: true,
    },
    qrCodeUrl: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 1000,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id; 
        delete ret.__v;
      }
    }
  }
);

 
qRCodeSchema.statics.build = (attrs: QRCodeAttrs) => {
  return new QRCode(attrs);
};

const QRCode = mongoose.model<QRCodeDoc, QRCodeModel>('QRCode', qRCodeSchema);

export { QRCode ,QRCodeDoc};
