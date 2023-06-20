import { KafkaConfig,Kafka } from 'kafkajs';

const kafkaConfig: KafkaConfig = {
  clientId: 'payment-validator-service',
  brokers: ['my-cluster-kafka-bootstrap.kafka.svc:9092'],
};
 
const kafkaSingleton = new Kafka(kafkaConfig);
export { kafkaSingleton };
