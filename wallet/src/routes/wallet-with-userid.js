"use strict";
// Checking wallet balance (GET)
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
exports.checkWalletIDforUserRouter = void 0;
/* Get Wallet Balance: This API endpoint retrieves the current balance of the user's digital wallet.
Endpoint: /api/wallet/balance
Method: GET
Request Body: { "walletId": "wallet123" }
Response Body: { "walletId": "wallet123", "balance": 500 } */
const express_1 = __importDefault(require("express"));
const wallet_1 = require("../models/wallet");
const router = express_1.default.Router();
exports.checkWalletIDforUserRouter = router;
router.get("/api/wallet/user/:userId/wallet", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*  await check('wallet_id').isUUID().run(req);
   
     const errors = validationResult(req);
   
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }
    */
    const { userId } = req.params;
    try {
        const wallet = yield wallet_1.Wallet.findOne({ userId });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }
        return res.status(200).json({ wallet });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}));
