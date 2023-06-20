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
exports.KafkaTransactionConsumer = void 0;
const transaction_1 = require("../../models/transaction");
const kafkaConfig_1 = require("../kafkaConfig");
const wallet_service_1 = require("../../services/wallet-service");
const kafka_producer_1 = require("../kafka-producer");
const create_wallet_event_1 = require("../create-wallet-event");
const wallet_created_publisher_1 = require("../publishers/wallet-created-publisher");
var TransactionTopic;
(function (TransactionTopic) {
    TransactionTopic["PAYMENT_INITIATED"] = "payment-initiated";
    TransactionTopic["PAYMENT_CONFIRMED"] = "payment-confirmed";
    TransactionTopic["PAYMENT_FAILED"] = "payment-failed";
    TransactionTopic["CONFIRM_FUNDS"] = "confirm_funds";
    TransactionTopic["TRANSFER_INITIATED"] = "transfer-initiated";
    TransactionTopic["TRANSFER_CONFIRMED"] = "transfer-confirmed";
    TransactionTopic["TRANSFER_FAILED"] = "transfer-failed";
    TransactionTopic["REFUND_INITIATED"] = "refund-initiated";
    TransactionTopic["REFUND_CONFIRMED"] = "refund-confirmed";
    TransactionTopic["REFUND_FAILED"] = "refund-failed";
    TransactionTopic["TRANSACTION_UPDATED"] = "transaction-updated";
    TransactionTopic["TRANSACTION_CREATED"] = "transaction-created";
})(TransactionTopic || (TransactionTopic = {}));
var FundsAvailableStatus;
(function (FundsAvailableStatus) {
    FundsAvailableStatus["AUTHORIZED"] = "authorized";
    FundsAvailableStatus["FAILED"] = "failed";
})(FundsAvailableStatus || (FundsAvailableStatus = {}));
class KafkaTransactionConsumer {
    constructor() {
        this.kafka = kafkaConfig_1.kafkaSingleton;
        const consumerConfig = {
            groupId: 'transaction-wallet-service-group',
        };
        this.consumer = this.kafka.consumer(consumerConfig);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.consumer.connect();
            // Payment consumers
            yield this.consumer.subscribe({ topic: TransactionTopic.PAYMENT_INITIATED, fromBeginning: false });
            yield this.consumer.subscribe({ topic: TransactionTopic.PAYMENT_CONFIRMED, fromBeginning: false });
            yield this.consumer.subscribe({ topic: TransactionTopic.PAYMENT_FAILED, fromBeginning: false });
            //Funds confirmation
            yield this.consumer.subscribe({ topic: TransactionTopic.CONFIRM_FUNDS, fromBeginning: false });
            // Transfer consumers
            yield this.consumer.subscribe({ topic: TransactionTopic.TRANSFER_INITIATED, fromBeginning: false });
            yield this.consumer.subscribe({ topic: TransactionTopic.PAYMENT_CONFIRMED, fromBeginning: false });
            yield this.consumer.subscribe({ topic: TransactionTopic.TRANSFER_FAILED, fromBeginning: false });
            // Refund consumers
            yield this.consumer.subscribe({ topic: TransactionTopic.REFUND_INITIATED, fromBeginning: false });
            yield this.consumer.subscribe({ topic: TransactionTopic.REFUND_CONFIRMED, fromBeginning: false });
            yield this.consumer.subscribe({ topic: TransactionTopic.REFUND_FAILED, fromBeginning: false });
            // Transaction update consumer
            yield this.consumer.subscribe({ topic: TransactionTopic.TRANSACTION_UPDATED, fromBeginning: false });
            yield this.consumer.subscribe({ topic: TransactionTopic.TRANSACTION_CREATED, fromBeginning: false });
            yield this.consumer.run({
                eachMessage: ({ topic, message }) => __awaiter(this, void 0, void 0, function* () {
                    if (message.value !== null)
                        switch (topic) {
                            case 'confirm_funds':
                                yield this.handleConfirmFundsEvent(message.value.toString());
                                break;
                            case 'payment-initiated':
                                yield this.handlePaymentInitiatedEvent(message.value.toString());
                                break;
                            case 'payment-confirmed':
                                yield this.handlePaymentConfirmedEvent(message.value.toString());
                                break;
                            case 'payment-failed':
                                yield this.handlePaymentFailedEvent(message.value.toString());
                                break;
                            case 'transfer-initiated':
                                yield this.handleTransferInitiatedEvent(message.value.toString());
                                break;
                            case 'transfer-confirmed':
                                yield this.handleTransferConfirmedEvent(message.value.toString());
                                break;
                            case 'transfer-failed':
                                yield this.handleTransferFailedEvent(message.value.toString());
                                break;
                            case 'refund-initiated':
                                yield this.handleRefundInitiatedEvent(message.value.toString());
                                break;
                            case 'refund-confirmed':
                                yield this.handleRefundConfirmedEvent(message.value.toString());
                                break;
                            case 'refund-failed':
                                yield this.handleRefundFailedEvent(message.value.toString());
                                break;
                            case 'transaction-updated':
                                yield this.handleTransactionUpdatedEvent(message.value.toString());
                                break;
                            case 'transaction-created':
                                yield this.handleTransactionCreatedEvent(message.value.toString());
                                break;
                            default:
                                console.log(`Unknown topic: ${topic}`);
                        }
                }),
            });
        });
    }
    handleConfirmFundsEvent(eventPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("I am in the wallet");
            try {
                const { subject, data } = JSON.parse(eventPayload);
                const { transaction } = data;
                const { transactionId, sourceWalletId, transactionAmount, transactionFee } = transaction;
                // verify is sourceWallet.balance  >= transationAmount + transactionFee
                const sourceWallet = yield (0, wallet_service_1.getWallet)(sourceWalletId);
                const kafkaProducer = new kafka_producer_1.KafkaProducer();
                if (sourceWallet.balance - (transactionAmount + transactionFee) > 0) {
                    console.log(`source wallet ballance is ${sourceWallet.balance} and transaction amount is ${transactionAmount}`);
                    // Publish walletCreated event to Kafka topic 
                    const fundsAvailableEvent = new create_wallet_event_1.FundsAvailableEvent({ transactionId, status: FundsAvailableStatus.AUTHORIZED, balance: sourceWallet.balance });
                    const fundsAvailablePublisher = new wallet_created_publisher_1.FundsAvailablePublisher(kafkaProducer);
                    yield fundsAvailablePublisher.publish(fundsAvailableEvent);
                    console.log(`Updated transaction ${transactionId} status to Funds is available`);
                }
                else {
                    // Publish walletCreated event to Kafka topic 
                    const fundsAvailableEvent = new create_wallet_event_1.FundsAvailableEvent({ transactionId, status: FundsAvailableStatus.FAILED, balance: sourceWallet.balance });
                    const fundsAvailablePublisher = new wallet_created_publisher_1.FundsAvailablePublisher(kafkaProducer);
                    yield fundsAvailablePublisher.publish(fundsAvailableEvent);
                    console.log(`Updated transaction ${transactionId} status to Not Available`);
                }
            }
            catch (error) {
                console.log(`Error updating transaction: ${error}`);
            }
        });
    }
    handlePaymentInitiatedEvent(eventPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            /*  console.log("I am in the wallet");
             try {
               const { subject,data } = JSON.parse(eventPayload);
               const { transaction } = data;
               const {transactionId,sourceWalletId, transactionAmount,transactionFee} = transaction
              
         // verify is sourceWallet.balance  >= transationAmount + transactionFee
              
             const sourceWallet = await getWallet(sourceWalletId);
             const kafkaProducer = new KafkaProducer();
               if (sourceWallet.balance - (transactionAmount + transactionFee) > 0){
                  console.log(`source wallet ballance is ${sourceWallet.balance} and transaction amount is ${transactionAmount}`)
                   // Publish walletCreated event to Kafka topic
                   const fundsAvailableEvent = new FundsAvailableEvent({transactionId,status:FundsAvailableStatus.AUTHORIZED,balance:sourceWallet.balance})
                   const fundsAvailablePublisher = new FundsAvailablePublisher(kafkaProducer);
                   await fundsAvailablePublisher.publish(fundsAvailableEvent);
                   console.log(`Updated transaction ${transactionId} status to Funds is available`);
               }else{
                  // Publish walletCreated event to Kafka topic
                  const fundsAvailableEvent = new FundsAvailableEvent({transactionId,status:FundsAvailableStatus.FAILED,balance:sourceWallet.balance})
                  const fundsAvailablePublisher = new FundsAvailablePublisher(kafkaProducer);
                  await fundsAvailablePublisher.publish(fundsAvailableEvent);
          
                 console.log(`Updated transaction ${transactionId} status to Not Available`);
               }
              
             } catch (error) {
               console.log(`Error updating transaction: ${error}`);
             } */
        });
    }
    handlePaymentConfirmedEvent(eventPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { transactionId } = JSON.parse(eventPayload);
                /*    const transaction = await Transaction.findOneAndUpdate(
                     { transactionId },
                     { transactionStatus: TransactionStatus.SUCCESSFUL },
                     { new: true }
                   ); */
                console.log(`Updated transaction ${transactionId} status to SUCCESSFUL`);
            }
            catch (error) {
                console.log(`Error updating transaction: ${error}`);
            }
        });
    }
    handlePaymentFailedEvent(eventPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { transactionId } = JSON.parse(eventPayload);
                const transaction = yield transaction_1.Transaction.findOneAndUpdate({ transactionId }, { transactionStatus: transaction_1.TransactionStatus.FAILED }, { new: true });
                console.log(`Updated transaction ${transactionId} status to FAILED`);
            }
            catch (error) {
                console.log(`Error updating transaction: ${error}`);
            }
        });
    }
    handleTransferInitiatedEvent(eventPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { transactionId } = JSON.parse(eventPayload);
                const transaction = yield transaction_1.Transaction.findOneAndUpdate({ transactionId }, { transactionStatus: transaction_1.TransactionStatus.PENDING }, { new: true });
                console.log(`Updated transaction ${transactionId} status to PENDING`);
            }
            catch (error) {
                console.log(`Error updating transaction: ${error}`);
            }
        });
    }
    handleTransferConfirmedEvent(eventPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { transactionId } = JSON.parse(eventPayload);
                const transaction = yield transaction_1.Transaction.findOneAndUpdate({ transactionId }, { transactionStatus: transaction_1.TransactionStatus.SUCCESSFUL }, { new: true });
                console.log(`Updated transaction ${transactionId} status to SUCCESSFUL`);
            }
            catch (error) {
                console.log(`Error updating transaction: ${error}`);
            }
        });
    }
    handleTransferFailedEvent(eventPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { transactionId } = JSON.parse(eventPayload);
                const transaction = yield transaction_1.Transaction.findOneAndUpdate({ transactionId }, { transactionStatus: transaction_1.TransactionStatus.FAILED }, { new: true });
                console.log(`Updated transaction ${transactionId} status to FAILED`);
            }
            catch (error) {
                console.log(`Error updating transaction: ${error}`);
            }
        });
    }
    handleRefundInitiatedEvent(eventPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { transactionId } = JSON.parse(eventPayload);
                const transaction = yield transaction_1.Transaction.findOneAndUpdate({ transactionId }, { transactionStatus: transaction_1.TransactionStatus.PENDING }, { new: true });
                console.log(`Updated transaction ${transactionId} status to PENDING`);
            }
            catch (error) {
                console.log(`Error updating transaction: ${error}`);
            }
        });
    }
    handleRefundConfirmedEvent(eventPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { transactionId } = JSON.parse(eventPayload);
                const transaction = yield transaction_1.Transaction.findOneAndUpdate({ transactionId }, { transactionStatus: transaction_1.TransactionStatus.SUCCESSFUL }, { new: true });
                console.log(`Updated transaction ${transactionId} status to SUCCESSFUL`);
            }
            catch (error) {
                console.log(`Error updating transaction: ${error}`);
            }
        });
    }
    handleRefundFailedEvent(eventPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { transactionId } = JSON.parse(eventPayload);
                const transaction = yield transaction_1.Transaction.findOneAndUpdate({ transactionId }, { transactionStatus: transaction_1.TransactionStatus.FAILED }, { new: true });
                console.log(`Updated transaction ${transactionId} status to FAILED`);
            }
            catch (error) {
                console.log(`Error updating transaction: ${error}`);
            }
        });
    }
    handleTransactionUpdatedEvent(eventPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { transactionId, newStatus } = JSON.parse(eventPayload);
                const transaction = yield transaction_1.Transaction.findOneAndUpdate({ transactionId }, { transactionStatus: newStatus }, { new: true });
                console.log(`Updated transaction ${transactionId} status to ${newStatus}`);
            }
            catch (error) {
                console.log(`Error updating transaction: ${error}`);
            }
        });
    }
    handleTransactionCreatedEvent(eventPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { subject, data } = JSON.parse(eventPayload);
                const { transactionId } = data;
                /* const transaction = await Transaction.findOneAndUpdate(
                { transactionId },
                { transactionStatus: newStatus },
                { new: true }
                );*/
                console.log(`Created transaction ${transactionId} status to newStatus}`);
            }
            catch (error) {
                console.log(`Error updating transaction: ${error}`);
            }
        });
    }
}
exports.KafkaTransactionConsumer = KafkaTransactionConsumer;
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
