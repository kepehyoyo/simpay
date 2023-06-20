"use strict";
// routes/qr-code.routes.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const qrcode_1 = require("../models/qrcode");
const express_validator_1 = require("express-validator");
const common_v2_1 = require("@cygnetops/common-v2");
const router = (0, express_1.Router)();
// Delete QR code by ID
router.delete('/api/qrcode', [
    // Validate request body
    (0, express_validator_1.body)('qrCodeId').isUUID().withMessage('Invalid QR code ID'),
], common_v2_1.validateRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const qrCodeId = req.params.id;
        // Find QR code document by ID
        const qrCode = yield qrcode_1.QRCode.findOne({ qrCodeId });
        if (!qrCode) {
            return res.status(404).json({ message: 'QR code not found' });
        }
        // Delete QR code document
        yield qrCode.delete();
        // Return success response
        res.status(200).json({ message: 'QR code deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}));
exports.default = router;
