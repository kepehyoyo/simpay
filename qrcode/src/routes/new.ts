import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';
import qrcode from 'qrcode';
import Jimp from 'jimp'
import { QRCode, QRCodeDoc } from '../models/qrcode';

const router = Router();

// Limit the API to 10 requests per 10 seconds per IP address
const rateLimiter = rateLimit({
  windowMs: 10000,
  max: 10,
  keyGenerator: (req) => req.ip,
});

router.post('/api/qrcode', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
  
      const dataString = JSON.stringify(data);
    // Validate input
    if (!data) {
      return res.status(400).json({ message: 'Missing data parameter' });
    }

    const options: qrcode.QRCodeToDataURLOptions = {
      errorCorrectionLevel: 'M',
    };

  // Generate QR code image URL
      const qrCodeUrl = await qrcode.toDataURL(dataString, options);
  
       // Generate a random QR code ID using UUID v4
      const qrCodeId = uuidv4();
      
      const image = await Jimp.read('src/images/sim-qrcode.png');
      
      const imageSize = 100; // Adjust the size as needed
        image.resize(imageSize, imageSize);

        const qrCodeSize = 225; // Adjust the size according to your QR code size
        const xPos = (qrCodeSize - imageSize) / 2;
        const yPos = (qrCodeSize - imageSize) / 2;
        
       
        
        const qrCodeBuffer = Buffer.from(qrCodeUrl.split(',')[1], 'base64');
        const qrCodeWithImage = await Jimp.read(qrCodeBuffer);
        qrCodeWithImage.composite(image, xPos, yPos);
        
        const base64Image = await qrCodeWithImage.getBase64Async(Jimp.MIME_PNG); 

    // Create a new QRCode document
   // const qrCode = QRCode.build({ data, qrCodeId, qrCodeUrl });
   // await qrCode.save();

    // Return the QR code ID and URL
    res.status(201).json({ qrCodeId: qrCodeId, qrCodeUrl: base64Image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export { router as createQRCodeRouter };
