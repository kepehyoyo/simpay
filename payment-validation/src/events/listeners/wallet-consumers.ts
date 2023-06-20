 import { Kafka, Consumer, ConsumerConfig, EachMessagePayload } from 'kafkajs'; 
import { AccountType, VerificationLevel } from '../../models/trasanctionLimit';
import { Wallet } from '../../models/wallet';
import { WalletService } from '../../services/wallet-service';
import { kafkaSingleton } from '../kafkaConfig' 

enum WalletTopic{
  
  WalletCreated = 'wallet-created',
  WalletUpdated = 'wallet-updated',
  WalletDeleted = 'wallet-deleted'
}


export class KafkaWalletConsumer {
  private kafka: Kafka;
  private consumer: Consumer;

  constructor() {
    this.kafka = kafkaSingleton;

    const consumerConfig: ConsumerConfig = {
      groupId: 'wallet-validation-service-group', 
    };
    

    this.consumer = this.kafka.consumer(consumerConfig);
  }

  public async start(): Promise<void> {
    await this.consumer.connect();

 
    // Wallet consumers
    await this.consumer.subscribe({ topic:WalletTopic.WalletCreated,fromBeginning:false });
    await this.consumer.subscribe({ topic:WalletTopic.WalletUpdated ,fromBeginning:false });
    await this.consumer.subscribe({ topic: WalletTopic.WalletDeleted ,fromBeginning:false });
 

    await this.consumer.run({
      eachMessage: async ({ topic, message }: EachMessagePayload) => {
        if (message.value !== null) 
        switch (topic) {
          case 'wallet-created':
            await this.handleWalletCreated(message.value.toString());
            break;
          case 'wallet-updated':
            await this.handleWalletUpdated(message.value.toString());
            break;
          case 'wallet-deleted':
            await this.handleWalletDeleted(message.value.toString());
            break;
          default:
            console.log(`Unknown topic: ${topic}`);
        }
      },
    });
  }
  private async handleWalletCreated(eventPayload: string): Promise<void> {
    try {
      const { subject , data } = JSON.parse(eventPayload);
      const {walletId,balance,currency} = data;
      const wallet = WalletService.createWallet(walletId,balance,currency,AccountType.CUSTOMER,VerificationLevel.LEVEL_1);

      console.log(`Payment Validation:new wallet created with subject ${subject} and wallet info ${JSON.stringify(wallet)}`);
    } catch (error) {
      console.log(`Error updating wallet: ${error}`);
    }
  }

  private async handleWalletUpdated(eventPayload: string): Promise<void> {
    try {
      const { subject, data } = JSON.parse(eventPayload);
      const {walletId} = data;
      const wallet = await Wallet.findOneAndUpdate(
        { walletId }, 
        { new: true }
      );
      console.log(`Updated wallet ${walletId} status to PENDING`);
    } catch (error) {
      console.log(`Error updating wallet: ${error}`);
    }
  }

  private async handleWalletDeleted(eventPayload: string): Promise<void> {
    try {
      const { subject, data } = JSON.parse(eventPayload);
      const {walletId} = data;
      const wallet = await Wallet.findOneAndUpdate(
        { walletId },
        { new: true }
      );
      console.log(`Updated wallet ${walletId} status to PENDING`);
    } catch (error) {
      console.log(`Error updating wallet: ${error}`);
    }
  }

}
        
        
 
