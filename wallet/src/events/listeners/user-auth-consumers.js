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
exports.KafkaUserAuthConsumer = void 0;
const wallet_service_1 = require("../../services/wallet-service");
const kafkaConfig_1 = require("../kafkaConfig");
var UserAuthTopic;
(function (UserAuthTopic) {
    UserAuthTopic["USER_CREATED"] = "user-created";
})(UserAuthTopic || (UserAuthTopic = {}));
class KafkaUserAuthConsumer {
    constructor() {
        this.kafka = kafkaConfig_1.kafkaSingleton;
        const consumerConfig = {
            groupId: 'auth-wallet-service-group',
        };
        this.consumer = this.kafka.consumer(consumerConfig);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.consumer.connect();
            // user auth consumers
            yield this.consumer.subscribe({ topic: UserAuthTopic.USER_CREATED, fromBeginning: false });
            //await this.consumer.subscribe({ topic: TransactionTopic.PAYMENT_CONFIRMED ,fromBeginning:false });
            // await this.consumer.subscribe({ topic: TransactionTopic.PAYMENT_FAILED ,fromBeginning:false });
            yield this.consumer.run({
                eachMessage: ({ topic, message }) => __awaiter(this, void 0, void 0, function* () {
                    if (message.value !== null)
                        switch (topic) {
                            /*   case 'wallet-created':
                                await this.handleWalletCreated(message.value.toString());
                                break;
                             */
                            case 'user-created':
                                yield this.handleUserCreatedEvent(message.value.toString());
                                break;
                            default:
                                console.log(`Unknown topic: ${topic}`);
                        }
                }),
            });
        });
    }
    handleUserCreatedEvent(eventPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { subject, data } = JSON.parse(eventPayload);
                const wallet = (0, wallet_service_1.createWallet)(data.userId, "XAF");
                //`  console.log(`new wallet created with subject ${subject} and Id ${data.walletId} status to PENDING`);
            }
            catch (error) {
                console.log(`Error updating transaction: ${error}`);
            }
        });
    }
}
exports.KafkaUserAuthConsumer = KafkaUserAuthConsumer;
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
