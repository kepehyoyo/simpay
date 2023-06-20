"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kafkaSingleton = void 0;
const kafkajs_1 = require("kafkajs");
const kafkaConfig = {
    clientId: 'payment-validator-service',
    brokers: ['my-cluster-kafka-bootstrap.kafka.svc:9092'],
};
const kafkaSingleton = new kafkajs_1.Kafka(kafkaConfig);
exports.kafkaSingleton = kafkaSingleton;
