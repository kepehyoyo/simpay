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
exports.KafkaProducer = void 0;
const kafkaConfig_1 = require("./kafkaConfig");
class KafkaProducer {
    constructor() {
        const kafka = kafkaConfig_1.kafkaSingleton;
        this.producer = kafka.producer();
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.producer.connect();
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.producer.disconnect();
        });
    }
    sendMessage(topic, message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.producer.send({
                topic,
                messages: [
                    { value: message },
                ],
            });
            //   console.log(`event published :${topic} message:${message}`);
        });
    }
}
exports.KafkaProducer = KafkaProducer;
