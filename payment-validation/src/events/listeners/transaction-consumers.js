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
const kafkaConfig_1 = require("../kafkaConfig");
const kafka_producer_1 = require("../kafka-producer");
const validation_service_1 = require("../../services/validation-service");
const validation_events_1 = require("../validation-events");
const validation_publisher_1 = require("../publishers/validation-publisher");
const wallet_service_1 = require("../../services/wallet-service");
const payment_amount_service_1 = require("../../services/payment-amount-service");
var TransactionTopic;
(function (TransactionTopic) {
    TransactionTopic["PaymentInitiated"] = "payment-initiated";
    TransactionTopic["PaymentConfirmed"] = "payment-confirmed";
})(TransactionTopic || (TransactionTopic = {}));
var ValidationStatus;
(function (ValidationStatus) {
    ValidationStatus["PAYMENT_VALIDATED"] = "validated";
    ValidationStatus["PAYMENT_FAILED"] = "failed";
})(ValidationStatus || (ValidationStatus = {}));
class KafkaTransactionConsumer {
    constructor() {
        this.kafka = kafkaConfig_1.kafkaSingleton;
        const consumerConfig = {
            groupId: 'transact-validation-service-group',
        };
        this.consumer = this.kafka.consumer(consumerConfig);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.consumer.connect();
            // Transaaction Status consumers
            yield this.consumer.subscribe({ topic: TransactionTopic.PaymentInitiated, fromBeginning: false });
            yield this.consumer.subscribe({ topic: TransactionTopic.PaymentConfirmed, fromBeginning: false });
            //   await this.consumer.subscribe({ topic:TransactionStatusTopic.LoggingUpdate,fromBeginning:false });
            yield this.consumer.run({
                eachMessage: ({ topic, message }) => __awaiter(this, void 0, void 0, function* () {
                    if (message.value !== null) {
                        const { data } = JSON.parse(message.value.toString());
                        const { transaction } = data;
                        const { transactionId, sourceWalletId, destinationWalletId, transactionAmount, transactionType } = transaction;
                        // console.log (transaction)
                        switch (topic) {
                            case 'payment-initiated':
                                console.log(`Payment valadiation: validation request of transaction ${transaction.transactionId} `);
                                // Handle  validation of an initiated payment
                                yield this.handlePaymentInitiated(transactionId, sourceWalletId, transactionAmount, destinationWalletId, transactionType);
                                break;
                            case 'payment-confirmed':
                                console.log(`Payment validation : payment confirmed for transaction ${transaction.transactionId} `);
                                // Handle  validation of an initiated payment
                                yield this.handlePaymentConfirmed(transactionId, sourceWalletId, transactionAmount, destinationWalletId, transactionType);
                                break;
                            default:
                                console.log(`Unknown topic: ${topic}`);
                        }
                    }
                }),
            });
        });
    }
    handlePaymentInitiated(transactionId, paymentSource, paymentAmount, paymentRecipient, paymentMethod) {
        return __awaiter(this, void 0, void 0, function* () {
            //async handlePaymentInitiated(transactionId:string,userId: string, paymentAmount: number,accountType:AccountType,verificationLevel:VerificationLevel, paymentRecipient: string, paymentMethod: string): Promise<boolean> {
            // Get sourceWallet  info 
            const sourceWallet = yield wallet_service_1.WalletService.getWallet(paymentSource);
            const destinationWallet = yield wallet_service_1.WalletService.getWallet(paymentRecipient);
            const isValidated = yield validation_service_1.ValidationService.validatePayment(paymentSource, paymentAmount, sourceWallet.accountType, sourceWallet.verificationLevel, paymentRecipient, paymentMethod);
            const status = isValidated ? ValidationStatus.PAYMENT_VALIDATED : ValidationStatus.PAYMENT_FAILED;
            console.log(`status is ${status}`);
            // Publish walletCreated event to Kafka topic 
            const kafkaProducer = new kafka_producer_1.KafkaProducer();
            const validatePaymentEvent = new validation_events_1.PaymentValidationEvent({ transactionId, status });
            const paymentValidationPublisher = new validation_publisher_1.InitiatePaymentPublisher(kafkaProducer);
            yield paymentValidationPublisher.publish(validatePaymentEvent);
        });
    }
    handlePaymentConfirmed(transactionId, paymentSource, paymentAmount, paymentRecipient, paymentMethod) {
        return __awaiter(this, void 0, void 0, function* () {
            const completionTime = new Date();
            try {
                const payment = yield payment_amount_service_1.PaymentAmountService.newPaymentAmount(paymentSource, completionTime, paymentAmount);
            }
            catch (error) {
                console.log('could not save payment amount');
            }
        });
    }
}
exports.KafkaTransactionConsumer = KafkaTransactionConsumer;
