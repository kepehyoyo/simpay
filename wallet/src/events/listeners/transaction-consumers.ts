 


import { Kafka, Consumer, ConsumerConfig, EachMessagePayload } from 'kafkajs';
import {Transaction, TransactionDoc,TransactionType,TransactionStatus } from '../../models/transaction';
import { kafkaSingleton } from '../kafkaConfig' 
import { getWallet } from '../../services/wallet-service';
import { KafkaProducer } from '../kafka-producer';
import { FundsAvailableEvent } from '../create-wallet-event';
import { FundsAvailablePublisher } from '../publishers/wallet-created-publisher';
enum TransactionTopic{
  PAYMENT_INITIATED = 'payment-initiated',
  PAYMENT_CONFIRMED = 'payment-confirmed',
  PAYMENT_FAILED    = 'payment-failed',


  CONFIRM_FUNDS     =   'confirm_funds',
  TRANSFER_INITIATED = 'transfer-initiated',
  TRANSFER_CONFIRMED = 'transfer-confirmed',
  TRANSFER_FAILED    = 'transfer-failed',
  

  REFUND_INITIATED = 'refund-initiated',
  REFUND_CONFIRMED = 'refund-confirmed',
  REFUND_FAILED    = 'refund-failed',

  TRANSACTION_UPDATED = 'transaction-updated',
  TRANSACTION_CREATED = 'transaction-created',
}

enum FundsAvailableStatus {
 AUTHORIZED = "authorized",
 FAILED   = "failed"
}


export class KafkaTransactionConsumer {
  private kafka: Kafka;
  private consumer: Consumer;

  constructor() {
    this.kafka = kafkaSingleton;

    const consumerConfig: ConsumerConfig = {
      groupId: 'transaction-wallet-service-group', 
    };
    

    this.consumer = this.kafka.consumer(consumerConfig);
  }

  public async start(): Promise<void> {
    await this.consumer.connect(); 
    // Payment consumers
    await this.consumer.subscribe({ topic:TransactionTopic.PAYMENT_INITIATED,fromBeginning:false });
    await this.consumer.subscribe({ topic: TransactionTopic.PAYMENT_CONFIRMED ,fromBeginning:false });
    await this.consumer.subscribe({ topic: TransactionTopic.PAYMENT_FAILED ,fromBeginning:false });
   
    //Funds confirmation
    await this.consumer.subscribe({ topic: TransactionTopic.CONFIRM_FUNDS ,fromBeginning:false });
    
    // Transfer consumers
    await this.consumer.subscribe({ topic: TransactionTopic.TRANSFER_INITIATED ,fromBeginning:false });
    await this.consumer.subscribe({ topic: TransactionTopic.PAYMENT_CONFIRMED ,fromBeginning:false });
    await this.consumer.subscribe({ topic: TransactionTopic.TRANSFER_FAILED ,fromBeginning:false });

    // Refund consumers
    await this.consumer.subscribe({ topic: TransactionTopic.REFUND_INITIATED ,fromBeginning:false });
    await this.consumer.subscribe({ topic: TransactionTopic.REFUND_CONFIRMED ,fromBeginning:false });
    await this.consumer.subscribe({ topic: TransactionTopic.REFUND_FAILED,fromBeginning:false  });

    // Transaction update consumer
    await this.consumer.subscribe({ topic: TransactionTopic.TRANSACTION_UPDATED ,fromBeginning:false });
    await this.consumer.subscribe({ topic: TransactionTopic.TRANSACTION_CREATED ,fromBeginning:false });

    await this.consumer.run({
      eachMessage: async ({ topic, message }: EachMessagePayload) => {
        if (message.value !== null) 
        switch (topic) {
          
          case 'confirm_funds':
            await this.handleConfirmFundsEvent(message.value.toString());
            break;
          case 'payment-initiated':
            await this.handlePaymentInitiatedEvent(message.value.toString());
            break;
          case 'payment-confirmed':
            await this.handlePaymentConfirmedEvent(message.value.toString());
            break;
          case 'payment-failed':
            await this.handlePaymentFailedEvent(message.value.toString());
            break;
          case 'transfer-initiated':
            await this.handleTransferInitiatedEvent(message.value.toString());
            break;
          case 'transfer-confirmed':
            await this.handleTransferConfirmedEvent(message.value.toString());
            break;
          case 'transfer-failed':
            await this.handleTransferFailedEvent(message.value.toString());
            break;
          case 'refund-initiated':
            await this.handleRefundInitiatedEvent(message.value.toString());
            break;
          case 'refund-confirmed':
            await this.handleRefundConfirmedEvent(message.value.toString());
            break;
          case 'refund-failed':
            await this.handleRefundFailedEvent(message.value.toString());
            break;
          case 'transaction-updated':
            await this.handleTransactionUpdatedEvent(message.value.toString());
            break;
          case 'transaction-created':
            await this.handleTransactionCreatedEvent(message.value.toString());
            break;
          default:
            console.log(`Unknown topic: ${topic}`);
        }
      },
    });
  }
  
  private async handleConfirmFundsEvent(eventPayload: string): Promise<void> {
    console.log("I am in the wallet");
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
    }
  }
  private async handlePaymentInitiatedEvent(eventPayload: string): Promise<void> {
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
  }

  private async handlePaymentConfirmedEvent(eventPayload: string): Promise<void> {
    try {
      const { transactionId } = JSON.parse(eventPayload);
   /*    const transaction = await Transaction.findOneAndUpdate(
        { transactionId },
        { transactionStatus: TransactionStatus.SUCCESSFUL },
        { new: true }
      ); */
      console.log(`Updated transaction ${transactionId} status to SUCCESSFUL`);
    } catch (error) {
      console.log(`Error updating transaction: ${error}`);
    }
  }
  private async handlePaymentFailedEvent(eventPayload: string): Promise<void> {
    try {
      const { transactionId } = JSON.parse(eventPayload);
      const transaction = await Transaction.findOneAndUpdate(
        { transactionId },
        { transactionStatus: TransactionStatus.FAILED },
        { new: true }
      );
      console.log(`Updated transaction ${transactionId} status to FAILED`);
    } catch (error) {
      console.log(`Error updating transaction: ${error}`);
    }
  }
  
  private async handleTransferInitiatedEvent(eventPayload: string): Promise<void> {
    try {
      const { transactionId } = JSON.parse(eventPayload);
      const transaction = await Transaction.findOneAndUpdate(
        { transactionId },
        { transactionStatus: TransactionStatus.PENDING },
        { new: true }
      );
      console.log(`Updated transaction ${transactionId} status to PENDING`);
    } catch (error) {
      console.log(`Error updating transaction: ${error}`);
    }
  }
  
  private async handleTransferConfirmedEvent(eventPayload: string): Promise<void> {
    try {
      const { transactionId } = JSON.parse(eventPayload);
      const transaction = await Transaction.findOneAndUpdate(
        { transactionId },
        { transactionStatus: TransactionStatus.SUCCESSFUL },
        { new: true }
      );
      console.log(`Updated transaction ${transactionId} status to SUCCESSFUL`);
    } catch (error) {
      console.log(`Error updating transaction: ${error}`);
    }
  }
  
  private async handleTransferFailedEvent(eventPayload: string): Promise<void> {
    try {
      const { transactionId } = JSON.parse(eventPayload);
      const transaction = await Transaction.findOneAndUpdate(
        { transactionId },
        { transactionStatus: TransactionStatus.FAILED },
        { new: true }
      );
      console.log(`Updated transaction ${transactionId} status to FAILED`);
    } catch (error) {
      console.log(`Error updating transaction: ${error}`);
    }
  }
  
  private async handleRefundInitiatedEvent(eventPayload: string): Promise<void> {
    try {
      const { transactionId } = JSON.parse(eventPayload);
      const transaction = await Transaction.findOneAndUpdate(
        { transactionId },
        { transactionStatus: TransactionStatus.PENDING },
        { new: true }
      );
      console.log(`Updated transaction ${transactionId} status to PENDING`);
    } catch (error) {
      console.log(`Error updating transaction: ${error}`);
    }
  }
  
  private async handleRefundConfirmedEvent(eventPayload: string): Promise<void> {
    try {
      const { transactionId } = JSON.parse(eventPayload);
      const transaction = await Transaction.findOneAndUpdate(
        { transactionId },
        { transactionStatus: TransactionStatus.SUCCESSFUL },
        { new: true }
      );
      console.log(`Updated transaction ${transactionId} status to SUCCESSFUL`);
    } catch (error) {
      console.log(`Error updating transaction: ${error}`);
    }
  }
  

      private async handleRefundFailedEvent(eventPayload: string): Promise<void> {
        try {
        const { transactionId } = JSON.parse(eventPayload);
        const transaction = await Transaction.findOneAndUpdate(
        { transactionId },
        { transactionStatus: TransactionStatus.FAILED },
        { new: true }
        );
        console.log(`Updated transaction ${transactionId} status to FAILED`);
        } catch (error) {
        console.log(`Error updating transaction: ${error}`);
        }
        }
        
        private async handleTransactionUpdatedEvent(eventPayload: string): Promise<void> {
        try {
        const { transactionId, newStatus } = JSON.parse(eventPayload);
        const transaction = await Transaction.findOneAndUpdate(
        { transactionId },
        { transactionStatus: newStatus },
        { new: true }
        );
        console.log(`Updated transaction ${transactionId} status to ${newStatus}`);
        } catch (error) {
        console.log(`Error updating transaction: ${error}`);
        }
        }

        private async handleTransactionCreatedEvent(eventPayload: string): Promise<void> {
          try {
          const { subject, data} = JSON.parse(eventPayload);
          const {transactionId} = data
          /* const transaction = await Transaction.findOneAndUpdate(
          { transactionId },
          { transactionStatus: newStatus },
          { new: true } 
          );*/
          console.log(`Created transaction ${transactionId} status to newStatus}`);
          } catch (error) {
          console.log(`Error updating transaction: ${error}`);
          }
          }
          
          
        }
    
        
 

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