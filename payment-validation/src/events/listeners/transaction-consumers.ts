import { Kafka, Consumer, ConsumerConfig, EachMessagePayload } from 'kafkajs';   
import { kafkaSingleton } from '../kafkaConfig'   
import { KafkaProducer } from '../kafka-producer'; 
import { ValidationService } from '../../services/validation-service';
import { AccountType, VerificationLevel } from '../../models/trasanctionLimit';
import { PaymentValidationEvent } from '../validation-events';
import { InitiatePaymentPublisher } from '../publishers/validation-publisher';
import { WalletService } from '../../services/wallet-service';
import { PaymentAmountService } from '../../services/payment-amount-service';

enum TransactionTopic{
  PaymentInitiated = 'payment-initiated', 
  PaymentConfirmed = 'payment-confirmed', 
}
enum ValidationStatus {
   PAYMENT_VALIDATED = "validated",
   PAYMENT_FAILED   = "failed"
}

export class KafkaTransactionConsumer {
  private kafka: Kafka;
  private consumer: Consumer; 

  constructor() {
    this.kafka = kafkaSingleton;

    const consumerConfig: ConsumerConfig = {
      groupId: 'transact-validation-service-group', 
    };
    

    this.consumer = this.kafka.consumer(consumerConfig);
  }

  public async start(): Promise<void> {
    await this.consumer.connect();
    
      // Transaaction Status consumers
      await this.consumer.subscribe({ topic: TransactionTopic.PaymentInitiated,fromBeginning:false });
      await this.consumer.subscribe({ topic: TransactionTopic.PaymentConfirmed,fromBeginning:false });
   //   await this.consumer.subscribe({ topic:TransactionStatusTopic.LoggingUpdate,fromBeginning:false });
   

      await this.consumer.run({
        eachMessage: async ({ topic, message }: EachMessagePayload) => {
         if (message.value !== null) {
         const { data } = JSON.parse(message.value.toString());
         const {transaction} = data
         const {transactionId,sourceWalletId,destinationWalletId,transactionAmount,transactionType} = transaction;

        // console.log (transaction)
          switch (topic) {
            case 'payment-initiated':
               console.log(`Payment valadiation: validation request of transaction ${transaction.transactionId} `)
              
               // Handle  validation of an initiated payment
              await this.handlePaymentInitiated(transactionId,sourceWalletId,transactionAmount,destinationWalletId,transactionType) ;

              break;
           case 'payment-confirmed':
               console.log(`Payment validation : payment confirmed for transaction ${transaction.transactionId} `)
              
               // Handle  validation of an initiated payment
              await this.handlePaymentConfirmed(transactionId,sourceWalletId,transactionAmount,destinationWalletId,transactionType) ;

              break;
            default:
              console.log(`Unknown topic: ${topic}`);
          }
        }
        },
      });
    }


async handlePaymentInitiated(transactionId:string,paymentSource: string, paymentAmount: number, paymentRecipient: string, paymentMethod: string): Promise<void> {
  
    
//async handlePaymentInitiated(transactionId:string,userId: string, paymentAmount: number,accountType:AccountType,verificationLevel:VerificationLevel, paymentRecipient: string, paymentMethod: string): Promise<boolean> {
  
// Get sourceWallet  info 
    const sourceWallet = await WalletService.getWallet(paymentSource);

    const destinationWallet = await WalletService.getWallet(paymentRecipient);

    const isValidated =  await ValidationService.validatePayment(paymentSource, paymentAmount,sourceWallet.accountType,sourceWallet.verificationLevel, paymentRecipient, paymentMethod)
      
    const status = isValidated? ValidationStatus.PAYMENT_VALIDATED: ValidationStatus.PAYMENT_FAILED ;

         console.log(`status is ${status}`);
        // Publish walletCreated event to Kafka topic 
        const kafkaProducer = new KafkaProducer(); 
        const validatePaymentEvent = new PaymentValidationEvent({transactionId,status});
        const paymentValidationPublisher = new InitiatePaymentPublisher(kafkaProducer);
        await paymentValidationPublisher.publish(validatePaymentEvent); 

  }

  async handlePaymentConfirmed(transactionId:string,paymentSource: string, paymentAmount: number, paymentRecipient: string, paymentMethod: string): Promise<void> {
   
    const completionTime = new Date();
    try{
    const payment = await PaymentAmountService.newPaymentAmount(paymentSource,completionTime,paymentAmount );
    }catch(error){
      console.log('could not save payment amount')
    }
    
   }
}
 