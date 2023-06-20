 


import { Kafka, Consumer, ConsumerConfig, EachMessagePayload } from 'kafkajs';
import { UserProfile,UserProfileAttrs } from '../../models/profile';
import { UserProfileService } from '../../services/user-profile-service';
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
      groupId: 'auth-userprofile-service-group', 
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
    const userProfileservice = new UserProfileService()
    try {
      const { subject , data } = JSON.parse(eventPayload);
       const userProfile = await userProfileservice.createProfile(data.userId ,data.phoneNumber,data.firstName,data.middleName,data.lastName)
    } catch (error) {
      console.log(`Error updating profile: ${error}`);
    }
  }
}