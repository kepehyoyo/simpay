// routes/qr-code.routes.ts

import { Router, Request, Response } from 'express';
import { QRCode } from '../models/qrcode';
import { body } from 'express-validator';
import { validateRequest } from '@cygnetops/common-v2';


const router = Router();

// Delete QR code by ID
router.delete('/api/qrcode', [
    // Validate request body
    body('qrCodeId').isUUID().withMessage('Invalid QR code ID'),
  ],validateRequest,
   async (req: Request, res: Response) => {
  try {

    const qrCodeId = req.params.id;

    // Find QR code document by ID
    const qrCode = await QRCode.findOne({ qrCodeId });

    if (!qrCode) {
      return res.status(404).json({ message: 'QR code not found' });
    }

    // Delete QR code document
    await qrCode.delete();

    // Return success response
    res.status(200).json({ message: 'QR code deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
