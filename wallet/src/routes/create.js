"use strict";
/* Create Wallet: This API endpoint creates a digital wallet for the user to store and manage their digital money.
Endpoint: /api/wallet/create
Method: POST
Request Body: { "userId": "user123" }
Response Body: { "walletId": "wallet123", "userId": "user123" } */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWalletRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const common_v2_1 = require("@cygnetops/common-v2");
const uuid_1 = require("uuid");
const wallet_created_publisher_1 = require("../events/publishers/wallet-created-publisher");
const kafka_producer_1 = require("../events/kafka-producer");
const create_wallet_event_1 = require("../events/create-wallet-event");
const wallet_service_1 = require("../services/wallet-service");
const router = express_1.default.Router();
exports.createWalletRouter = router;
router.post("/api/wallet/create", [
    //Validate the user id parameter
    (0, express_validator_1.body)("user_id").notEmpty().withMessage("User ID is required"),
    (0, express_validator_1.body)("currency")
        .notEmpty()
        .isIn(["XAF", "EUR", "GBP", "USD"])
        .withMessage("Invalid currency"),
], common_v2_1.validateRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract user ID from JWT
    /* const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    const decodedToken = jwt.decode(token!);
    const userId = decodedToken?.sub; */
    const { user_id, currency } = req.body;
    /*     const existingWallet = await Wallet.findOne({user_id})

         if(existingWallet){
           throw new BadRequestError('user already has wallet')
         }
*/
    // Create a new wallet with default balance of 0
    const wallet_id = (0, uuid_1.v4)();
    //  const wallet =  Wallet.build({wallet_id,user_id,balance:0 ,currency})
    try {
        //  const token = jwt.sign({ wallet_id }, process.env.JWT_KEY!);
        const wallet = yield (0, wallet_service_1.createWalletwithId)(wallet_id, user_id, 1000, currency);
        // Publish walletCreated event to Kafka topic 
        const kafkaProducer = new kafka_producer_1.KafkaProducer();
        const createWalletEvent = new create_wallet_event_1.CreateWalletEvent({ walletId: wallet_id, balance: wallet.balance, currency });
        const createWalletPublisher = new wallet_created_publisher_1.CreateWalletPublisher(kafkaProducer);
        yield createWalletPublisher.publish(createWalletEvent);
        // res.status(201).json({ wallet_id, balance: 0, token });
        res.status(201).json({ wallet_id, balance: 0 });
    }
    catch (err) {
        console.error("Error creating wallet:", err);
        res.status(500).json({ message: "Server error" });
    }
    //  res.status(201).send(wallet);
}));
