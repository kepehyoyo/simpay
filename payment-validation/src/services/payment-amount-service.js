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
exports.PaymentAmountService = void 0;
const payment_amount_1 = require("../models/payment-amount");
class PaymentAmountService {
    static getDailyPaymentAmount(walletId, currentDate) {
        return __awaiter(this, void 0, void 0, function* () {
            // Query the database to get the sum of payments made by the user on the current Day
            const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
            console.log(`start day is ${startOfDay}`);
            const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
            console.log(`endDay i is ${endOfDay}`);
            const dailyPayments = yield payment_amount_1.PaymentAmount.find({
                walletId: walletId,
                date: {
                    $gte: startOfDay,
                    $lte: endOfDay,
                },
            });
            const dailyAmount = dailyPayments.reduce((acc, payment) => acc + payment.amount, 0);
            console.log(`daily amount stands at ${dailyAmount}`);
            return dailyAmount;
        });
    }
    static getWeeklyPaymentAmount(walletId, currentDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
            const endOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 6);
            const weeklyPayments = yield payment_amount_1.PaymentAmount.find({
                walletId: walletId,
                date: {
                    $gte: startOfWeek,
                    $lte: endOfWeek,
                },
            });
            const weeklyAmount = weeklyPayments.reduce((acc, payment) => acc + payment.amount, 0);
            console.log(`weekly amount stands at ${weeklyAmount}`);
            return weeklyAmount;
        });
    }
    static getMonthlyPaymentAmount(walletId, currentDate) {
        return __awaiter(this, void 0, void 0, function* () {
            // Calculate the start and end dates of the current month
            const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            // Query the database to get the sum of payments made by the user in the current month
            const payments = yield payment_amount_1.PaymentAmount.find({ walletId, createdAt: { $gte: startDate, $lte: endDate } }).select('amount');
            const monthlyAmount = payments.reduce((total, payment) => total + payment.amount, 0);
            console.log(`monthly amount stands at ${monthlyAmount}`);
            return monthlyAmount;
        });
    }
    static newPaymentAmount(walletId, date, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create a new PaymentAmount document
            console.log(`I am saving trasaction on date ${date}`);
            const paymentAmount = payment_amount_1.PaymentAmount.build({ walletId, date, amount });
            // Save the new document to the database
            yield paymentAmount.save();
            return paymentAmount;
        });
    }
}
exports.PaymentAmountService = PaymentAmountService;
