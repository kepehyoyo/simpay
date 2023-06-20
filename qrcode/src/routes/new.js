"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQRCodeRouter = void 0;
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const uuid_1 = require("uuid");
const qrcode_1 = __importDefault(require("qrcode"));
const jimp_1 = __importDefault(require("jimp"));
const router = (0, express_1.Router)();
exports.createQRCodeRouter = router;
// Limit the API to 10 requests per 10 seconds per IP address
const rateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10000,
    max: 10,
    keyGenerator: (req) => req.ip,
});
router.post('/api/qrcode', rateLimiter, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.body;
        const dataString = JSON.stringify(data);
        // Validate input
        if (!data) {
            return res.status(400).json({ message: 'Missing data parameter' });
        }
        const options = {
            errorCorrectionLevel: 'M',
        };
        // Generate QR code image URL
        const qrCodeUrl = yield qrcode_1.default.toDataURL(dataString, options);
        // Generate a random QR code ID using UUID v4
        const qrCodeId = (0, uuid_1.v4)();
        const image = yield jimp_1.default.read('src/images/sim-qrcode.png');
        const imageSize = 100; // Adjust the size as needed
        image.resize(imageSize, imageSize);
        const qrCodeSize = 225; // Adjust the size according to your QR code size
        const xPos = (qrCodeSize - imageSize) / 2;
        const yPos = (qrCodeSize - imageSize) / 2;
        const qrCodeBuffer = Buffer.from(qrCodeUrl.split(',')[1], 'base64');
        const qrCodeWithImage = yield jimp_1.default.read(qrCodeBuffer);
        qrCodeWithImage.composite(image, xPos, yPos);
        const base64Image = yield qrCodeWithImage.getBase64Async(jimp_1.default.MIME_PNG);
        // Create a new QRCode document
        // const qrCode = QRCode.build({ data, qrCodeId, qrCodeUrl });
        // await qrCode.save();
        // Return the QR code ID and URL
        res.status(201).json({ qrCodeId: qrCodeId, qrCodeUrl: base64Image });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}));
