import { Kafka } from "kafkajs";
import { TransactionDoc,TransactionStatus } from "../models/transaction";

class PaymentService {
  private kafka: Kafka;

  constructor(kafka: Kafka) {
    this.kafka = kafka;
  }

  async processPayment(
    phoneNumber: string,
    amount: number
  ): Promise<TransactionDoc | null> {
    // code to process payment

    const transaction: TransactionDoc = {
      phoneNumber,
      amount,
      timestamp: new Date(),
      status: TransactionStatus.SUCCESSFUL,
      transactionId: Math.random().toString(36).substr(2, 9),
    };

    // publish payment event to Kafka
    await this.kafka.producer().send({
      topic: "payment_events",
      messages: [
        {
          key: phoneNumber,
          value: JSON.stringify({
            type: "payment",
            payload: transaction,
          }),
        },
      ],
    });

    return transaction;
  }
}

export default PaymentService;
