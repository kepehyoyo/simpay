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
exports.KafkaTransactionStatusConsumer = void 0;
const transaction_1 = require("../../models/transaction");
const kafkaConfig_1 = require("../kafkaConfig");
const transaction_service_1 = require("../../service/transaction-service");
const wallet_service_1 = require("../../service/wallet-service");
const kafka_producer_1 = require("../kafka-producer");
const transaction_events_1 = require("../transaction-events");
const transaction_publisher_1 = require("../publishers/transaction-publisher");
const status_statemachine_1 = require("../../service/status-statemachine");
const xstate_1 = require("xstate");
//import { transactionStateService } from '../../service/status-statemachine';
var TransactionStatusTopic;
(function (TransactionStatusTopic) {
    TransactionStatusTopic["WalletBalanceUpdated"] = "funds-available";
    TransactionStatusTopic["PaymentValidationUpdate"] = "payment-validation-update";
    TransactionStatusTopic["PaymenetAuthorizationUpdate"] = "payment-authorization-update";
    TransactionStatusTopic["LoggingUpdate"] = "transaction-logging-update";
})(TransactionStatusTopic || (TransactionStatusTopic = {}));
class KafkaTransactionStatusConsumer {
    constructor() {
        this.kafka = kafkaConfig_1.kafkaSingleton;
        const consumerConfig = {
            groupId: 'transation-status-service-group',
        };
        this.consumer = this.kafka.consumer(consumerConfig);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.consumer.connect();
            // Transaaction Status consumers
            yield this.consumer.subscribe({ topic: TransactionStatusTopic.PaymenetAuthorizationUpdate, fromBeginning: false });
            yield this.consumer.subscribe({ topic: TransactionStatusTopic.PaymentValidationUpdate, fromBeginning: false });
            yield this.consumer.subscribe({ topic: TransactionStatusTopic.WalletBalanceUpdated, fromBeginning: false });
            yield this.consumer.subscribe({ topic: TransactionStatusTopic.LoggingUpdate, fromBeginning: false });
            yield this.consumer.run({
                eachMessage: ({ topic, message }) => __awaiter(this, void 0, void 0, function* () {
                    if (message.value !== null) {
                        const { subject, data } = JSON.parse(message.value.toString());
                        const { transactionId, status } = data;
                        switch (topic) {
                            case 'funds-available':
                                yield this.handleWalletUpdate(transactionId, status);
                                break;
                            case 'payment-validation-update':
                                console.log(`transaction ${transactionId} just recieved validation status ${status}`);
                                yield this.handlePaymentValidationUpdate(transactionId, status);
                                break;
                            case 'payment-authorization-update':
                                yield this.handleAuthenticationUpdate(transactionId, status);
                                break;
                            case 'transaction-logging-update':
                                yield this.handleTransactionCompleted(transactionId, status);
                                break;
                            default:
                                console.log(`Unknown topic: ${topic}`);
                        }
                    }
                }),
            });
        });
    }
    handlePaymentValidationUpdate(transactionId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (status) {
                case transaction_1.TransactionStatus.VALIDATED:
                    const completionTime = new Date();
                    try {
                        yield transaction_service_1.TransactionService.updateTransactionStatus(transactionId, transaction_1.TransactionStatus.VALIDATED, completionTime);
                        const transaction = yield transaction_service_1.TransactionService.findTransactionById(transactionId);
                        // Publish ConfirmPayment  event to Kafka topic 
                        const kafkaProducer = new kafka_producer_1.KafkaProducer();
                        const confirmFundsEvent = new transaction_events_1.ConfirmFundsevent({ transaction });
                        const confirmFundsPublisher = new transaction_publisher_1.ConfirmFundsPublisher(kafkaProducer);
                        yield confirmFundsPublisher.publish(confirmFundsEvent);
                    }
                    catch (err) {
                        console.error("Error creating transaction:", err);
                        throw new Error("Server error");
                    }
                    break;
                case transaction_1.TransactionStatus.FAILED:
                    // Handle failed payment validation
                    this.handleTransactionFailed(transactionId, "Can not be validated");
                    break;
                default:
                    console.log(`Received unknown payment validation status ${status}`);
            }
        });
    }
    handleWalletUpdate(transactionId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (status) {
                case transaction_1.TransactionStatus.AUTHORIZED:
                    // update status to Authorised
                    const completionTime = new Date();
                    yield transaction_service_1.TransactionService.updateTransactionStatus(transactionId, transaction_1.TransactionStatus.AUTHORIZED, completionTime);
                    try {
                        const transactionDetails = yield transaction_service_1.TransactionService.findTransactionById(transactionId);
                        // Update sender's wallet balance by deducting the transaction amount
                        const sourceId = transactionDetails.sourceWalletId;
                        yield wallet_service_1.WalletService.debitWalletBalance(sourceId, transactionDetails.transactionAmount);
                        // Update recipient's wallet balance by adding the transaction amount
                        const recipientId = transactionDetails.destinationWalletId;
                        yield wallet_service_1.WalletService.creditWalletBalance(recipientId, transactionDetails.transactionAmount);
                        // Update transaction record with status and completion time
                        const transactionStatus = transaction_1.TransactionStatus.COMPLETED;
                        const completionTime = new Date();
                        yield transaction_service_1.TransactionService.updateTransactionStatus(transactionId, transactionStatus, completionTime);
                        yield transactionDetails.save();
                        yield this.handleTransactionCompleted(transactionId, transaction_1.TransactionStatus.COMPLETED);
                    }
                    catch (error) {
                        this.handleTransactionFailed(transactionId, "Authorisation failed");
                        throw new Error('Transaction failed');
                    }
                    break;
                case transaction_1.TransactionStatus.FAILED:
                    // Handle failed wallet balance
                    this.handleTransactionFailed(transactionId, "You do not have sufficient funds");
                    break;
                default:
                    console.log(`Received unknown wallet status ${status}`);
            }
        });
    }
    handleAuthenticationUpdate(transactionId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (status) {
                case transaction_1.TransactionStatus.AUTHORIZED:
                    // Handle authorized user
                    // Handle validated payment
                    const transactionStateMachine = (0, status_statemachine_1.getTransactionStateMachine)(transactionId);
                    // send an event to the state machine
                    const transactionstateService = (0, xstate_1.interpret)(transactionStateMachine)
                        .onTransition((state) => console.log(`still testing ${state.value}`))
                        .start();
                    transactionstateService.send({ type: 'VALIDATED' });
                    // Start in 'pending' state
                    /*     let currentState = transactionStateMachine.initialState;
          
                        console.log(currentState.value)
                        // Transition to 'authorized' state after payment is validated
                        currentState = transactionStateMachine.transition(currentState, { type: 'VALIDATED' });
                        console.log(currentState.value) */
                    break;
                case transaction_1.TransactionStatus.FAILED:
                    // Handle unauthorized user
                    this.handleTransactionFailed(transactionId, "Can not be authorized");
                    break;
                default:
                    console.log(`Received unknown authentication status ${status}`);
            }
        });
    }
    handleTransactionCompleted(transactionId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (status) {
                case transaction_1.TransactionStatus.COMPLETED:
                    // Handle transaction completed
                    /*  const currentState = transactionStateMachine.transition('authorized', { type: 'COMPLETED' });
                  
                      console.log(currentState.value) */
                    try {
                        // Publish ConfirmPayment  event to Kafka topic 
                        const transaction = yield transaction_service_1.TransactionService.findTransactionById(transactionId);
                        const kafkaProducer = new kafka_producer_1.KafkaProducer();
                        const confirmedTransactionEvent = new transaction_events_1.ConfirmPaymentEvent({ transaction });
                        const confirmTransactionPublisher = new transaction_publisher_1.ConfirmPaymentPublisher(kafkaProducer);
                        yield confirmTransactionPublisher.publish(confirmedTransactionEvent);
                    }
                    catch (err) {
                        console.error("Error creating transaction:", err);
                        throw new Error("Server error");
                    }
                    break;
                case transaction_1.TransactionStatus.FAILED:
                    // Handle transaction failed
                    this.handleTransactionFailed(transactionId, "Can not be logged");
                    break;
                default:
                    console.log(`Received unknown authentication status ${status}`);
            }
        });
    }
    handleTransactionFailed(transactionId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            //  handle resaon
            const transactionStateMachine = (0, status_statemachine_1.getTransactionStateMachine)(transactionId);
            // send an event to the state machine
            console.log(`transaction id ${transactionId} has failed because ${reason}`);
        });
    }
}
exports.KafkaTransactionStatusConsumer = KafkaTransactionStatusConsumer;
