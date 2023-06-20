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
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("./app");
const transactionlimits_1 = require("./contants/transactionlimits");
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY must be defined");
    }
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI must be defined");
    }
    try {
        mongoose_1.default.set('strictQuery', true);
        yield mongoose_1.default.connect(process.env.MONGO_URI, {});
        console.log("Connected to MongoDb");
        // Save all transaction limit instances to the database
        yield transactionlimits_1.customerLevel01Limit.save();
        yield transactionlimits_1.customerLevel02Limit.save();
        yield transactionlimits_1.merchantLevel01Limit.save();
        yield transactionlimits_1.merchantLevel02Limit.save();
        console.log('Transaction limits saved successfully');
    }
    catch (err) {
        console.error(err);
    }
    app_1.app.listen(3000, () => {
        console.log("Listening on port 3000!!!!!!!!");
    });
});
start();
