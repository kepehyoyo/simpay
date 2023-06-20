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
exports.StripePaymentIntentRouter = void 0;
const express_1 = __importDefault(require("express"));
const stripe_1 = __importDefault(require("stripe"));
const router = express_1.default.Router();
exports.StripePaymentIntentRouter = router;
// This is your test secret API key.
const stripe = new stripe_1.default('sk_test_51MiIzxEcj1TJHYYdXrPwVJA1ZUoJkNLkevtKPlAFyv35qyArNqzTsONqMxj4NWGUJGD4EA37iH6oaKIpYLQm2Vcz00alJ7EjHe', {
    apiVersion: '2022-11-15',
});
const calculateOrderAmount = (items) => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return 1400;
};
router.post("/create-payment-intent", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { items } = req.body;
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = yield stripe.paymentIntents.create({
        amount: calculateOrderAmount(items),
        currency: "usd",
        payment_method_types: ['card'],
    });
    res.send({
        clientSecret: paymentIntent.client_secret,
    });
}));
