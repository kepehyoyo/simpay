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
exports.getQRCodeRouter = void 0;
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const common_v2_1 = require("@cygnetops/common-v2");
const express_validator_1 = require("express-validator");
//import hmacAuthMiddleware from '../middlewares/hmac-auth.middleware';
const qrcode_service_1 = __importDefault(require("../services/qrcode-service"));
const router = (0, express_1.Router)();
exports.getQRCodeRouter = router;
const qrCodeService = new qrcode_service_1.default();
// Limit the API to 10 requests per 10 seconds per IP address
const rateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10000,
    max: 10,
    keyGenerator: (req) => req.ip,
});
router.get('/api/qrcode', [
    (0, express_validator_1.body)('qrCodeId').isUUID(),
], common_v2_1.validateRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { qrCodeId } = req.body;
        const qrCode = yield qrCodeService.getQRCodeById(qrCodeId);
        if (!qrCode) {
            return res.status(404).json({ message: 'QR code not found' });
        }
        res.status(200).json(qrCode);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}));
