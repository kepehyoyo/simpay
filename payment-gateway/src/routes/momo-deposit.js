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
exports.momoAddRouter = void 0;
const express_1 = __importDefault(require("express"));
const mtn_momo_1 = require("../services/mtn-momo");
const router = express_1.default.Router();
exports.momoAddRouter = router;
// Define a route for mobile money top-up
router.post('/api/payment-gateway/momo/top-up', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract necessary data from the request body
    const { phoneNumber, amount, currency, message, payeeNote } = req.body;
    console.log(req.body);
    // Verify the phone number and determine the mobile money provider
    let provider;
    if (phoneNumber.startsWith('23767') ||
        phoneNumber.startsWith('23768') ||
        phoneNumber.startsWith('237650') ||
        phoneNumber.startsWith('237651') ||
        phoneNumber.startsWith('237652') ||
        phoneNumber.startsWith('237653') ||
        phoneNumber.startsWith('237654')) {
        provider = 'MTN';
    }
    else if (phoneNumber.startsWith('23769') ||
        phoneNumber.startsWith('237655') ||
        phoneNumber.startsWith('237656') ||
        phoneNumber.startsWith('237657') ||
        phoneNumber.startsWith('237658') ||
        phoneNumber.startsWith('237659')) {
        provider = 'Orange';
    }
    else {
        return res.json({ success: false, message: 'Invalid phone number' });
    }
    // Perform the mobile money top-up logic based on the provider
    if (provider === 'MTN') {
        try {
            // Validate the phone number or perform any necessary checks
            // Connect to the MTN mobile money service or use an API client library
            // Perform the top-up request to the MTN mobile money service
            const referenceId = yield mtn_momo_1.mtnMomoService.requestToPay(amount, phoneNumber, currency, message, payeeNote);
            // Check the response from the MTN mobile money service
            if (referenceId) {
                // Top-up was successful
                console.log('Successful');
                // Perform any additional post-processing or logging
                // Return a success response
                return res.json({ success: true, message: `Mobile money top-up successful with referenceId ${referenceId}` });
            }
            else {
                // Top-up failed
                // Perform any necessary error handling or logging
                // Return an error response
                return res.status(500).json({ success: false, message: 'Error processing mobile money top-up' });
            }
        }
        catch (error) {
            // Error occurred during the top-up process
            // Perform any necessary error handling or logging
            // Return an error response
            return res.status(500).json({ success: false, message: 'Error processing mobile money top-up' });
        }
    }
    else if (provider === 'Orange') {
        // Process the top-up using Orange mobile money service
        // Your logic for processing the top-up using the MTN mobile money service goes here
        try {
            // Validate the phone number or perform any necessary checks
            // Connect to the MTN mobile money service or use an API client library
            // Perform the top-up request to the MTN mobile money service
            /*  const topUpResponse = await OrangeMomoService.topUp(phoneNumber,amount)
             
             // Check the response from the MTN mobile money service
             if (topUpResponse.success) {
               // Top-up was successful
               
               // Perform any additional post-processing or logging
               
               // Return a success response
               res.json({ success: true, message: 'Mobile money top-up successful' });
             } else {
               // Top-up failed
               
               // Perform any necessary error handling or logging
               
               // Return an error response
               res.status(500).json({ success: false, message: 'Error processing mobile money top-up' });
             } */
        }
        catch (error) {
            // Error occurred during the top-up process
            // Perform any necessary error handling or logging
            // Return an error response
            res.status(500).json({ success: false, message: 'Error processing mobile money top-up' });
        }
    }
    else {
        return res.json({ success: false, message: 'Invalid mobile money provider' });
    }
}));
