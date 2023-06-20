

export class UssdService {

  static async registerUser(name:string, email:string , password: string):Promise<any>{
    const userInfo = {message:` new user:${name}, with email:${email} has been register with password:${password}`};
    console.log (` new user:${name}, with email:${email} has been register with password:${password}` );
    return userInfo;
  }
    static async loginUser (email:string , password: string):Promise<any>{
        const userInfo = {message:`login user with email:${email} has been register with password:${password}` };
        console.log (`login user with email:${email} has been register with password:${password}` );
        return userInfo;
      
  }
}
/* 

import { Kafka } from 'kafkajs';
import { PaymentService } from './payment-service';
import { AuthService } from './auth-service';
import { NotificationService } from './notification-service';

export class UssdService {
  private paymentService: PaymentService;
  private authService: AuthService;
  private notificationService: NotificationService;
  // other service dependencies

  constructor(kafka: Kafka) {
    this.paymentService = new PaymentService(kafka);
    this.authService = new AuthService(kafka);
    this.notificationService = new NotificationService(kafka);
    // other service dependency initialization
  }

  async handleRequest(request: UssdRequest): Promise<UssdResponse> {
    // handle the request and send it to the appropriate service
    if (request.type === 'payment') {
      return this.paymentService.processPayment(request);
    } else if (request.type === 'auth') {
      return this.authService.authenticateUser(request);
    } else if (request.type === 'notification') {
      return this.notificationService.sendNotification(request);
    } else {
      throw new Error('Invalid request type');
    }
  }

  // other methods for handling USSD requests and interacting with other microservices
}
 */

/* import { Kafka, Producer, Consumer } from 'kafkajs';
import { UssdRequest, UssdResponse } from './types';

export class PaymentService {
  private producer: Producer;
  private consumer: Consumer;

  constructor(private kafka: Kafka) {
    this.producer = kafka.producer();
    this.consumer = kafka.consumer({ groupId: 'payment-group' });
  }

  async processPayment(request: UssdRequest): Promise<UssdResponse> {
    // validate the payment request
    if (!request.amount || request.amount <= 0) {
      throw new Error('Invalid payment amount');
    }

    // send the payment request to the payment microservice through Kafka
    await this.producer.send({
      topic: 'payment-request',
      messages: [{ key: request.phoneNumber, value: JSON.stringify(request) }],
    });

    // wait for the payment microservice to send a response
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'payment-response' });

    const { message } = await this.consumer.run({
      eachMessage: async ({ message }) => {
        if (message.key === request.phoneNumber) {
          // return the payment response to the USSD microservice
          return JSON.parse(message.value) as UssdResponse;
        }
      },
    });

    // close the Kafka consumer
    await this.consumer.disconnect();

    throw new Error('Payment response not received');
  }
} */
