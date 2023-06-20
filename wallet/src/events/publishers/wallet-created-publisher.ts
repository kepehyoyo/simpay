

import { KafkaProducer } from "../kafka-producer";
import { CreateWalletEvent, FundsAvailableEvent } from '../create-wallet-event';
import { Subjects } from "../subjects";

export class CreateWalletPublisher {
  private producer: KafkaProducer;
  private topic: string = 'wallet-created';

  constructor(producer: KafkaProducer) {
    this.producer = producer;
  }
  
  async publish(event: CreateWalletEvent): Promise<void> {
    await this.producer.connect();

    await this.producer.sendMessage(this.topic, JSON.stringify(event));

    await this.producer.disconnect();
  }
}


export class FundsAvailablePublisher {
  private producer: KafkaProducer;
  private topic: string = Subjects.FundsAvailable;

  constructor(producer: KafkaProducer) {
    this.producer = producer;
  }
  
  async publish(event: FundsAvailableEvent): Promise<void> {
    await this.producer.connect();

    await this.producer.sendMessage(this.topic, JSON.stringify(event));

    await this.producer.disconnect();
  }
}