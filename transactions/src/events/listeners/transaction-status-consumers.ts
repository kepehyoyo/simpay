import { Kafka, Consumer, ConsumerConfig, EachMessagePayload } from 'kafkajs';  
import { Transaction, TransactionStatus } from '../../models/transaction';
import { kafkaSingleton } from '../kafkaConfig' 
import { TransactionService } from '../../service/transaction-service';
import { WalletService } from '../../service/wallet-service';
import { KafkaProducer } from '../kafka-producer';
import { ConfirmFundsevent, ConfirmPaymentEvent } from '../transaction-events';
import { ConfirmFundsPublisher, ConfirmPaymentPublisher } from '../publishers/transaction-publisher';
 import { getTransactionStateMachine } from '../../service/status-statemachine';
import { State, StateMachine, interpret } from 'xstate';
//import { transactionStateService } from '../../service/status-statemachine';

enum TransactionStatusTopic{
  WalletBalanceUpdated = 'funds-available',
  PaymentValidationUpdate =  'payment-validation-update',
  PaymenetAuthorizationUpdate = 'payment-authorization-update',
  LoggingUpdate   = 'transaction-logging-update'
}


export class KafkaTransactionStatusConsumer {
  private kafka: Kafka;
  private consumer: Consumer; 

  constructor() {
    this.kafka = kafkaSingleton;

    const consumerConfig: ConsumerConfig = {
      groupId: 'transation-status-service-group', 
    };
    

    this.consumer = this.kafka.consumer(consumerConfig);
  }

  public async start(): Promise<void> {
    await this.consumer.connect();
    
      // Transaaction Status consumers
      await this.consumer.subscribe({ topic: TransactionStatusTopic.PaymenetAuthorizationUpdate,fromBeginning:false });
      await this.consumer.subscribe({ topic:TransactionStatusTopic.PaymentValidationUpdate ,fromBeginning:false });
      await this.consumer.subscribe({ topic:TransactionStatusTopic.WalletBalanceUpdated,fromBeginning:false });
      await this.consumer.subscribe({ topic:TransactionStatusTopic.LoggingUpdate,fromBeginning:false });
   

      await this.consumer.run({
        eachMessage: async ({ topic, message }: EachMessagePayload) => {
         if (message.value !== null) {
         const { subject, data } = JSON.parse(message.value.toString());
         const {transactionId,status} = data;
        
          switch (topic) {
            case 'funds-available':
              await this.handleWalletUpdate(transactionId, status) ;
              break;
            case 'payment-validation-update':
              console.log(`transaction ${transactionId} just recieved validation status ${status}`)
              await this.handlePaymentValidationUpdate(transactionId, status);
              break;
            case 'payment-authorization-update':
              await this.handleAuthenticationUpdate(transactionId, status) ;
              break;
              case 'transaction-logging-update':
                await this.handleTransactionCompleted(transactionId, status) ;
                break;
            default:
              console.log(`Unknown topic: ${topic}`);
          }
        }
        },
      });
    }



async handlePaymentValidationUpdate(transactionId:string, status:TransactionStatus) {
          switch (status) {
            case TransactionStatus.VALIDATED:
              
                const completionTime = new Date();
                try {
                await  TransactionService.updateTransactionStatus(transactionId, TransactionStatus.VALIDATED,completionTime);

                  const transaction = await TransactionService.findTransactionById(transactionId);
                 
                  // Publish ConfirmPayment  event to Kafka topic 
                  const kafkaProducer = new KafkaProducer(); 
                  const confirmFundsEvent = new ConfirmFundsevent({transaction});
                  const confirmFundsPublisher = new ConfirmFundsPublisher(kafkaProducer)
                  await confirmFundsPublisher.publish(confirmFundsEvent); 
    
                } catch (err) {
                  console.error("Error creating transaction:", err);
                throw new Error( "Server error" );
                }
                break;

            case TransactionStatus.FAILED:
              // Handle failed payment validation
              this.handleTransactionFailed(transactionId,"Can not be validated")
              break;
            default:
              console.log(`Received unknown payment validation status ${status}`);
          }
}

async handleWalletUpdate(transactionId:string, status:TransactionStatus){
            switch (status) {
              case TransactionStatus.AUTHORIZED: 
           
            // update status to Authorised
           
              const completionTime = new Date();
              await  TransactionService.updateTransactionStatus(transactionId, TransactionStatus.AUTHORIZED,completionTime);
                    try{
                      const transactionDetails = await TransactionService.findTransactionById(transactionId);

                      // Update sender's wallet balance by deducting the transaction amount
                      const sourceId = transactionDetails.sourceWalletId; 
                      await WalletService.debitWalletBalance(sourceId,transactionDetails.transactionAmount)
                    
                      // Update recipient's wallet balance by adding the transaction amount
                      const recipientId = transactionDetails.destinationWalletId; 
                      await WalletService.creditWalletBalance(recipientId,transactionDetails.transactionAmount);
                    
                      // Update transaction record with status and completion time
                      const transactionStatus = TransactionStatus.COMPLETED;
                      const completionTime = new Date();

                      
                      await TransactionService.updateTransactionStatus(transactionId, transactionStatus, completionTime);
                    
                      await transactionDetails.save();

                      await this.handleTransactionCompleted(transactionId,TransactionStatus.COMPLETED);
                    } catch(error){
                      this.handleTransactionFailed(transactionId,"Authorisation failed")
                      throw new Error('Transaction failed')
                    }
              break;
              case TransactionStatus.FAILED:
                // Handle failed wallet balance
                this.handleTransactionFailed(transactionId,"You do not have sufficient funds")
                break;
              default:
                console.log(`Received unknown wallet status ${status}`);
            }
}

async handleAuthenticationUpdate(transactionId:string, status:TransactionStatus) {
          switch (status) {
            case TransactionStatus.AUTHORIZED:
              // Handle authorized user
              // Handle validated payment
              const transactionStateMachine = getTransactionStateMachine(transactionId);
              // send an event to the state machine
              

              const transactionstateService = interpret(transactionStateMachine)
              .onTransition((state) => console.log(`still testing ${state.value}`))
              .start();
            
              transactionstateService.send({ type: 'VALIDATED' })
              // Start in 'pending' state
          /*     let currentState = transactionStateMachine.initialState;

              console.log(currentState.value)
              // Transition to 'authorized' state after payment is validated
              currentState = transactionStateMachine.transition(currentState, { type: 'VALIDATED' });
              console.log(currentState.value) */
              break;
            case TransactionStatus.FAILED:
              // Handle unauthorized user
              this.handleTransactionFailed(transactionId,"Can not be authorized")
              break;
            default:
              console.log(`Received unknown authentication status ${status}`);
          }
}

async handleTransactionCompleted(transactionId:string, status:TransactionStatus) {
            switch (status) {
              case TransactionStatus.COMPLETED:
                // Handle transaction completed
              
              /*  const currentState = transactionStateMachine.transition('authorized', { type: 'COMPLETED' });
            
                console.log(currentState.value) */
            try {
              // Publish ConfirmPayment  event to Kafka topic 
              const transaction = await TransactionService.findTransactionById(transactionId)
              const kafkaProducer = new KafkaProducer(); 
              const confirmedTransactionEvent = new ConfirmPaymentEvent({transaction});
              const confirmTransactionPublisher = new ConfirmPaymentPublisher(kafkaProducer)
              await confirmTransactionPublisher.publish(confirmedTransactionEvent); 

            } catch (err) {
              console.error("Error creating transaction:", err);
            throw new Error( "Server error" );
            }
                break;
          case TransactionStatus.FAILED:
                // Handle transaction failed
                this.handleTransactionFailed(transactionId,"Can not be logged")
                break;
              default:
                console.log(`Received unknown authentication status ${status}`);
            }
}
 async handleTransactionFailed(transactionId:string, reason:string) {
        //  handle resaon
        const transactionStateMachine = getTransactionStateMachine(transactionId);
        // send an event to the state machine
    
        console.log(`transaction id ${transactionId} has failed because ${reason}`)
          
        }
}

  