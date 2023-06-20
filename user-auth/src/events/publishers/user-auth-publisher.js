"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserPublisher = void 0;
const subjects_1 = require("../subjects");
class CreateUserPublisher {
    constructor(producer) {
        this.topic = subjects_1.Subjects.USER_CREATED;
        this.producer = producer;
    }
    publish(event) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.producer.connect();
            yield this.producer.sendMessage(this.topic, JSON.stringify(event));
            yield this.producer.disconnect();
        });
    }
}
exports.CreateUserPublisher = CreateUserPublisher;
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
