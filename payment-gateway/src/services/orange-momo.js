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
const axios_1 = __importDefault(require("axios"));
// Function to request a top-up using the Orange Mobile Money API
function requestTopUp(phoneNumber, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiUrl = 'https://api.orange.com/orange-money-webpay';
        try {
            // Make an HTTP POST request to the top-up endpoint
            const response = yield axios_1.default.post(`${apiUrl}/api/v1/request-top-up`, {
                phoneNumber,
                amount,
                currency: 'XAF' // Adjust the currency as per your requirements
            }, {
                headers: {
                    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
                    'Content-Type': 'application/json'
                }
            });
            // Handle the response from the Orange Mobile Money API
            if (response.status === 200) {
                console.log('Top-up request successful');
            }
            else {
                console.log('Top-up request failed');
            }
        }
        catch (error) {
            console.error('Error requesting top-up:', error);
        }
    });
}
// Example usage
requestTopUp('237690000001', 5000);
