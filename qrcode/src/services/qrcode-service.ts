import { v4 as uuidv4 } from 'uuid';
import qrcode from 'qrcode';
import { QRCode,QRCodeDoc } from '../models/qrcode';

class QRCodeService {
  async createQRCode(data: string): Promise<QRCodeDoc> {
    // Generate QR code image URL
    const qrCodeUrl = await qrcode.toDataURL(data);

    // Generate a random QR code ID using UUID v4
    const qrCodeId = uuidv4();

    // Create a new QRCode document
    const qrCode =  QRCode.build({ data, qrCodeId, qrCodeUrl });
    await qrCode.save();

    return qrCode;
  }

  async getQRCodeById(qrCodeId: string): Promise<QRCodeDoc | null> {
    return QRCode.findOne({ qrCodeId });
  }
}

export default QRCodeService;
