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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const wallet_1 = require("../models/wallet");
const common_v2_1 = require("@cygnetops/common-v2");
class WalletService {
    static createWallet(walletId, balance, currency, accountType, verificationLevel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Create a new wallet in the database
                const existingWallet = yield wallet_1.Wallet.findOne({ walletId });
                if (existingWallet) {
                    throw new common_v2_1.BadRequestError('wallet already exist');
                }
                const newWallet = wallet_1.Wallet.build({ walletId, balance, currency, accountType, verificationLevel });
                yield newWallet.save();
                console.log(JSON.stringify(newWallet));
                return newWallet;
            }
            catch (error) {
                console.error(error);
                throw new Error('Error creating wallet');
            }
        });
    }
    static getWallet(walletId) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = yield wallet_1.Wallet.findOne({ walletId });
            if (!wallet) {
                throw new Error(`Wallet with ID ${walletId} not found`);
            }
            return wallet;
        });
    }
}
exports.WalletService = WalletService;
