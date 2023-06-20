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
exports.KafkaConsumer = void 0;
const kafkajs_1 = require("kafkajs");
const kafkaConfig_1 = require("./kafkaConfig");
class KafkaConsumer {
    constructor(topic, callback) {
        this.topic = topic;
        this.callback = callback;
        const kafka = new kafkajs_1.Kafka(kafkaConfig_1.kafkaConfig);
        this.consumer = kafka.consumer({ groupId: 'wallet-service-group' });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.consumer.connect();
            yield this.consumer.subscribe({ topic: this.topic });
            yield this.consumer.run({
                eachMessage: ({ message }) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    this.callback(JSON.parse(((_a = message.value) === null || _a === void 0 ? void 0 : _a.toString()) || '{}'));
                }),
            });
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.consumer.disconnect();
        });
    }
}
exports.KafkaConsumer = KafkaConsumer;
/* import kafka from './kafkaConfig';
import { handlePaymentConfirmation } from '../controllers/walletController';

interface PaymentConfirmation {
  userId: string;
  paymentId: string;
  status: 'success' | 'failure';
}

const paymentConfirmationTopic = 'payment-confirmation';
const walletServiceGroupId = 'wallet-service-group';

export async function consumePaymentConfirmation(): Promise<void> {
  const consumer = kafka.consumer({ groupId: walletServiceGroupId });
  await consumer.connect();
  await consumer.subscribe({ topic: paymentConfirmationTopic, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const paymentConfirmation = JSON.parse(message.value?.toString() || '{}') as PaymentConfirmation;
      await handlePaymentConfirmation(paymentConfirmation);
    },
  });
}
 */ 
