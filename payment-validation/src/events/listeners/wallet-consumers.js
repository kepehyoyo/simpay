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
exports.KafkaWalletConsumer = void 0;
const trasanctionLimit_1 = require("../../models/trasanctionLimit");
const wallet_1 = require("../../models/wallet");
const wallet_service_1 = require("../../services/wallet-service");
const kafkaConfig_1 = require("../kafkaConfig");
var WalletTopic;
(function (WalletTopic) {
    WalletTopic["WalletCreated"] = "wallet-created";
    WalletTopic["WalletUpdated"] = "wallet-updated";
    WalletTopic["WalletDeleted"] = "wallet-deleted";
})(WalletTopic || (WalletTopic = {}));
class KafkaWalletConsumer {
    constructor() {
        this.kafka = kafkaConfig_1.kafkaSingleton;
        const consumerConfig = {
            groupId: 'wallet-validation-service-group',
        };
        this.consumer = this.kafka.consumer(consumerConfig);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.consumer.connect();
            // Wallet consumers
            yield this.consumer.subscribe({ topic: WalletTopic.WalletCreated, fromBeginning: false });
            yield this.consumer.subscribe({ topic: WalletTopic.WalletUpdated, fromBeginning: false });
            yield this.consumer.subscribe({ topic: WalletTopic.WalletDeleted, fromBeginning: false });
            yield this.consumer.run({
                eachMessage: ({ topic, message }) => __awaiter(this, void 0, void 0, function* () {
                    if (message.value !== null)
                        switch (topic) {
                            case 'wallet-created':
                                yield this.handleWalletCreated(message.value.toString());
                                break;
                            case 'wallet-updated':
                                yield this.handleWalletUpdated(message.value.toString());
                                break;
                            case 'wallet-deleted':
                                yield this.handleWalletDeleted(message.value.toString());
                                break;
                            default:
                                console.log(`Unknown topic: ${topic}`);
                        }
                }),
            });
        });
    }
    handleWalletCreated(eventPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { subject, data } = JSON.parse(eventPayload);
                const { walletId, balance, currency } = data;
                const wallet = wallet_service_1.WalletService.createWallet(walletId, balance, currency, trasanctionLimit_1.AccountType.CUSTOMER, trasanctionLimit_1.VerificationLevel.LEVEL_1);
                console.log(`Payment Validation:new wallet created with subject ${subject} and wallet info ${JSON.stringify(wallet)}`);
            }
            catch (error) {
                console.log(`Error updating wallet: ${error}`);
            }
        });
    }
    handleWalletUpdated(eventPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { subject, data } = JSON.parse(eventPayload);
                const { walletId } = data;
                const wallet = yield wallet_1.Wallet.findOneAndUpdate({ walletId }, { new: true });
                console.log(`Updated wallet ${walletId} status to PENDING`);
            }
            catch (error) {
                console.log(`Error updating wallet: ${error}`);
            }
        });
    }
    handleWalletDeleted(eventPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { subject, data } = JSON.parse(eventPayload);
                const { walletId } = data;
                const wallet = yield wallet_1.Wallet.findOneAndUpdate({ walletId }, { new: true });
                console.log(`Updated wallet ${walletId} status to PENDING`);
            }
            catch (error) {
                console.log(`Error updating wallet: ${error}`);
            }
        });
    }
}
exports.KafkaWalletConsumer = KafkaWalletConsumer;
