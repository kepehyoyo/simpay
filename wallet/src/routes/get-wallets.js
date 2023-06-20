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
exports.fetchAllWalletsRouter = void 0;
const express_1 = __importDefault(require("express"));
const wallet_1 = require("../models/wallet");
const router = express_1.default.Router();
exports.fetchAllWalletsRouter = router;
router.get('/api/wallets', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve all wallets from the database
        const wallets = yield wallet_1.Wallet.find();
        // Send the wallets as a JSON response
        res.json(wallets);
    }
    catch (error) {
        // Handle any errors that occur during the database query
        console.error('Failed to retrieve wallets:', error);
        res.status(500).json({ error: 'Failed to retrieve wallets' });
    }
}));
