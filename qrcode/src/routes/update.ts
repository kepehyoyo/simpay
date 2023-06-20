// routes/qr-code.routes.ts

import { Router, Request, Response } from 'express';
import { QRCode } from '../models/qrcode';
import { body } from 'express-validator';
import qrcode from 'qrcode';

const router = Router();

// Update a QR code
router.put('/api/qrcode', [
  body('qrCodeId').isUUID(),
  body('data').isString(),
], async (req: Request, res: Response) => {
  try {
    

    
    const { data,qrCodeId } = req.body;

    // Check if QR code exists
    const qrCode = await QRCode.findOne({ qrCodeId });
    if (!qrCode) {
      return res.status(404).json({ message: 'QR code not found' });
    }

    // Generate QR code image URL
    const qrCodeUrl = await qrcode.toDataURL(data);

    // Update QR code document
    qrCode.data = data;
    qrCode.qrCodeUrl = qrCodeUrl;
    await qrCode.save();

    // Return the updated QR code
    res.status(200).json(qrCode);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
