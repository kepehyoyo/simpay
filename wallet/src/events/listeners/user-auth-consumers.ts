 


import { Kafka, Consumer, ConsumerConfig, EachMessagePayload } from 'kafkajs';
import {Transaction, TransactionDoc,TransactionType,TransactionStatus } from '../../models/transaction';
import { createWallet } from '../../services/wallet-service';
import { kafkaSingleton } from '../kafkaConfig' 
enum UserAuthTopic{
   USER_CREATED = 'user-created',
}


export class KafkaUserAuthConsumer {
  private kafka: Kafka;
  private consumer: Consumer;

  constructor() {
    this.kafka = kafkaSingleton;

    const consumerConfig: ConsumerConfig = {
      groupId: 'auth-wallet-service-group', 
    };
    

    this.consumer = this.kafka.consumer(consumerConfig);
  }

  public async start(): Promise<void> {
    await this.consumer.connect();

 
    // user auth consumers
    await this.consumer.subscribe({ topic:UserAuthTopic.USER_CREATED,fromBeginning:false });

    //await this.consumer.subscribe({ topic: TransactionTopic.PAYMENT_CONFIRMED ,fromBeginning:false });
   // await this.consumer.subscribe({ topic: TransactionTopic.PAYMENT_FAILED ,fromBeginning:false });
 

    await this.consumer.run({
      eachMessage: async ({ topic, message }: EachMessagePayload) => {
        if (message.value !== null) 
        switch (topic) {
        /*   case 'wallet-created':
            await this.handleWalletCreated(message.value.toString());
            break; 
         */
          case 'user-created':
            await this.handleUserCreatedEvent(message.value.toString());
            break;
          default:
            console.log(`Unknown topic: ${topic}`);
        }
      },
    });
  }
  private async handleUserCreatedEvent(eventPayload: string): Promise<void> {
    try {
      const { subject , data } = JSON.parse(eventPayload);
       const wallet = createWallet (data.userId,"XAF");
    //`  console.log(`new wallet created with subject ${subject} and Id ${data.walletId} status to PENDING`);
    } catch (error) {
      console.log(`Error updating transaction: ${error}`);
    }
  }
 
/* 
  private async handlePaymentConfirmedEvent(eventPayload: string): Promise<void> {
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
          );
          console.log(`Created transaction ${transactionId} status to newStatus}`);
          } catch (error) {
          console.log(`Error updating transaction: ${error}`);
          }
          }
          
          
 */        }
    
        
 

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