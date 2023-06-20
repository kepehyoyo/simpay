import { KafkaProducer } from "../kafka-producer";
import {
   PaymentValidationEvent, 
  } from '../validation-events';
import { Subjects } from "../subjects";

export class InitiatePaymentPublisher {
  private producer: KafkaProducer;
  private topic: string = Subjects.PAYMENT_VALIDATION;

  constructor(producer: KafkaProducer) {
    this.producer = producer;
  }
  
  async publish(event: PaymentValidationEvent): Promise<void> {
    await this.producer.connect();

    await this.producer.sendMessage(this.topic, JSON.stringify(event));

    await this.producer.disconnect();
  }
} 