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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const uuid_1 = require("uuid");
const common_v2_1 = require("@cygnetops/common-v2");
const kafka_producer_1 = require("../events/kafka-producer");
const user_1 = require("../models/user");
const user_auth_events_1 = require("../events/user-auth-events");
const user_auth_publisher_1 = require("../events/publishers/user-auth-publisher");
const info_1 = require("../models/info");
const router = express_1.default.Router();
exports.signupRouter = router;
router.post("/api/user-auth/signup", [
    (0, express_validator_1.body)("firstName")
        .isString()
        .notEmpty()
        .withMessage("First Name is required"),
    (0, express_validator_1.body)("middleName")
        .isString()
        .withMessage("First Name is must be string"),
    (0, express_validator_1.body)("lastName")
        .isString()
        .notEmpty()
        .withMessage("Last Name is required"),
    (0, express_validator_1.body)("phoneNumber").isNumeric().withMessage("PhoneNumber must be valid"),
    (0, express_validator_1.body)("password")
        .trim()
        .isLength({ min: 4, max: 6 })
        .withMessage("Password must be between 4 and 6 characters"),
], common_v2_1.validateRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { firstName, middleName, lastName, phoneNumber, password } = req.body;
    console.log(`${firstName} ${middleName} ${lastName} is to be created with phonenumber ${phoneNumber} and password ${password}`);
    const existingUser = yield user_1.User.findOne({ phoneNumber });
    if (existingUser) {
        throw new common_v2_1.BadRequestError("User already exists");
    }
    const userId = (0, uuid_1.v4)();
    const user = user_1.User.build({ userId, phoneNumber, password });
    const userInfo = info_1.Info.build({ userId, firstName, middleName, lastName });
    try {
        yield user.save();
        yield userInfo.save();
        // Publish CreateUser event to Kafka topic 
        const kafkaProducer = new kafka_producer_1.KafkaProducer();
        const createUserEvent = new user_auth_events_1.CreateUserEvent({ userId: user.userId,
            phoneNumber: user.phoneNumber,
            firstName: userInfo.firstName,
            middleName: (_a = userInfo.middleName) !== null && _a !== void 0 ? _a : '',
            lastName: userInfo.lastName });
        const createUserPublisher = new user_auth_publisher_1.CreateUserPublisher(kafkaProducer);
        yield createUserPublisher.publish(createUserEvent);
        // Authenticate user with passport and JWT
        /*   req.login(user, { session: false }, async (error) => {
            if (error) {
              console.error("Error logging in user", error);
              return res.status(500).json({ message: "Server error" });
            }
    
            const token = jwt.sign({ userId: user.id }, process.env.JWT_KEY!);
            res.status(201).send({ user,userInfo,token });
          }); */
        res.status(201).send({ user, userInfo });
    }
    catch (err) {
        console.error("Error creating user", err);
        res.status(500).json({ message: "Server error" });
    }
}));
