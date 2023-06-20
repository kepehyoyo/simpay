import { KafkaProducer } from "../kafka-producer";
import {
   //InitiatePaymentEvent, 
  // UpdateTransactionEvent,
   CreateUserProfileEvent
  } from '../user-profile-events';
import { Subjects } from "../subjects";

export class CreateUserProfilePublisher {
  private producer: KafkaProducer;
  private topic: string = Subjects.USER_PROFILE_CREATED;

  constructor(producer: KafkaProducer) {
    this.producer = producer;
  }
  
  async publish(event: CreateUserProfileEvent): Promise<void> {
    await this.producer.connect();

    await this.producer.sendMessage(this.topic, JSON.stringify(event));

    await this.producer.disconnect();
  }
}
/* 
export class InitiateRefundPublisher {
  private producer: KafkaProducer;
  private topic: string = Subjects.REFUND_INITIATED;

  constructor(producer: KafkaProducer) {
    this.producer = producer;
  }
  
  async publish(event: InitiateRefundEvent): Promise<void> {
    await this.producer.connect();

    await this.producer.sendMessage(this.topic, JSON.stringify(event));

    await this.producer.disconnect();
  }
}

export class InitiateTransferPublisher {
  private producer: KafkaProducer;
  private topic: string = Subjects.TRANSFER_INITIATED;

  constructor(producer: KafkaProducer) {
    this.producer = producer;
  }
  
  async publish(event: InitiateTransferEvent): Promise<void> {
    await this.producer.connect();

    await this.producer.sendMessage(this.topic, JSON.stringify(event));

    await this.producer.disconnect();
  }
}

export class ConfirmPaymentPublisher {
  private producer: KafkaProducer;
  private topic: string = Subjects.PAYMENT_CONFIRMED;

  constructor(producer: KafkaProducer) {
    this.producer = producer;
  }
  
  async publish(event: ConfirmPaymentEvent): Promise<void> {
    await this.producer.connect();

    await this.producer.sendMessage(this.topic, JSON.stringify(event));

    await this.producer.disconnect();
  }
}

export class ConfirmTransferPublisher {
  private producer: KafkaProducer;
  private topic: string = Subjects.TRANSFER_CONFIRMED;

  constructor(producer: KafkaProducer) {
    this.producer = producer;
  }
  
  async publish(event: ConfirmTransferEvent): Promise<void> {
    await this.producer.connect();

    await this.producer.sendMessage(this.topic, JSON.stringify(event));

    await this.producer.disconnect();
  }
}

export class ConfirmRefundPublisher {
  private producer: KafkaProducer;
  private topic: string = Subjects.REFUND_CONFIRMED;

  constructor(producer: KafkaProducer) {
    this.producer = producer;
  }
  
  async publish(event: ConfirmRefundEvent): Promise<void> {
    await this.producer.connect();

    await this.producer.sendMessage(this.topic, JSON.stringify(event));

    await this.producer.disconnect();
  }
}
export class FailPaymentPublisher {
  private producer: KafkaProducer;
  private topic: string = Subjects.PAYMENT_FAILED;

  constructor(producer: KafkaProducer) {
    this.producer = producer;
  }
  
  async publish(event: FailPaymentEvent): Promise<void> {
    await this.producer.connect();

    await this.producer.sendMessage(this.topic, JSON.stringify(event));

    await this.producer.disconnect();
  }
}
export class FailTransferPublisher {
  private producer: KafkaProducer;
  private topic: string = Subjects.TRANSFER_FAILED;

  constructor(producer: KafkaProducer) {
    this.producer = producer;
  }
  
  async publish(event: FailTransferEvent): Promise<void> {
    await this.producer.connect();

    await this.producer.sendMessage(this.topic, JSON.stringify(event));

    await this.producer.disconnect();
  }
}

export class FailRefundPublisher {
  private producer: KafkaProducer;
  private topic: string = Subjects.REFUND_FAILED;

  constructor(producer: KafkaProducer) {
    this.producer = producer;
  }
  
  async publish(event: FailRefundEvent): Promise<void> {
    await this.producer.connect();

    await this.producer.sendMessage(this.topic, JSON.stringify(event));

    await this.producer.disconnect();
  }
}

export class CreateTransactionPublisher {
  private producer: KafkaProducer;
  private topic: string = Subjects.TRANSACTION_CREATED;

  constructor(producer: KafkaProducer) {
    this.producer = producer;
  }
  
  async publish(event: CreateTransactionEvent): Promise<void> {
    await this.producer.connect();

    await this.producer.sendMessage(this.topic, JSON.stringify(event));

    await this.producer.disconnect();
  }
}
 */