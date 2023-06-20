import { Kafka, Producer } from 'kafkajs';
import {  kafkaSingleton } from './kafkaConfig'

class KafkaProducer {
  private producer: Producer;

  constructor() {
    const kafka = kafkaSingleton;
    this.producer = kafka.producer();
  }

  async connect(): Promise<void> {
    await this.producer.connect();
  }

  async disconnect(): Promise<void> {
    await this.producer.disconnect();
  }

  async sendMessage(topic: string, message: string): Promise<void> {
    await this.producer.send({
      topic,
      messages: [
        { value: message },
      ],
    });
 //   console.log(`event published :${topic} message:${message}`);
  }
}

export { KafkaProducer };
