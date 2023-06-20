import { KafkaConfig,Kafka } from 'kafkajs';

const kafkaConfig: KafkaConfig = {
  clientId: 'transaction-service',
  brokers: ['my-cluster-kafka-bootstrap.kafka.svc:9092'],
};
 
const kafkaSingleton = new Kafka(kafkaConfig);
export { kafkaSingleton };
