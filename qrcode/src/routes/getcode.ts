
import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { validateRequest } from '@cygnetops/common-v2';
import { body } from 'express-validator';
//import hmacAuthMiddleware from '../middlewares/hmac-auth.middleware';
import QRCodeService from '../services/qrcode-service';

const router = Router();
const qrCodeService = new QRCodeService();

// Limit the API to 10 requests per 10 seconds per IP address
const rateLimiter = rateLimit({
  windowMs: 10000,
  max: 10,
  keyGenerator: (req) => req.ip,
});


router.get('/api/qrcode',[
        body('qrCodeId').isUUID(), 
    ],
    validateRequest, 
    async (req: Request, res: Response) => {
    try {
      const {qrCodeId} = req.body;
      const qrCode = await qrCodeService.getQRCodeById(qrCodeId);
      if (!qrCode) {
        return res.status(404).json({ message: 'QR code not found' });
      }
      res.status(200).json(qrCode);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  export {router as getQRCodeRouter};