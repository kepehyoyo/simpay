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
exports.mtnMomoService = void 0;
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
class MtnMomoService {
    constructor() {
        // Simulated list of valid MTN phone numbers
        this.validMtnPhoneNumbers = ['237670000001', '237670000002', '237670000003'];
        this.apiUrl = 'https://sandbox.momodeveloper.mtn.com';
        this.collectionSubscriptionKey = '682fecb0bddf4118a522802893f812ea';
        this.apiUser = "f6e253ec-e616-4fc1-8ed1-51d457d8e28f";
        this.apiKey = "e9f0ff0b207d4bd2a8a9894acbc472f1";
        this.targetEnvironment = 'sandbox';
        this.simpayPhoneNumber = '237675695571';
    }
    // Simulated top-up function for MTN mobile money service
    topUp(phoneNumber, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if the phone number is a valid MTN number
            if (!this.isValidMtnNumber(phoneNumber)) {
                return { success: false };
            }
            // Simulate processing the top-up request
            console.log(`Processing MTN mobile money top-up for phone number: ${phoneNumber}, amount: ${amount}`);
            // Simulate a successful top-up
            return { success: true };
        });
    }
    //******************* Collection Api functions ***********************//
    generateAccessToken() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authHeader = `Basic ${Buffer.from(`${this.apiUser}:${this.apiKey}`).toString('base64')}`;
                // console.log("generating access token");  
                const response = yield axios_1.default.post(`${this.apiUrl}/collection/token/`, {}, {
                    headers: {
                        'Authorization': authHeader,
                        'Ocp-Apim-Subscription-Key': this.collectionSubscriptionKey
                    }
                });
                if (response.status === 200) {
                    return response.data.access_token;
                }
                else {
                    throw new Error('Failed to generate access token');
                }
            }
            catch (error) {
                throw new Error(`Error generating access token: ${error}`);
            }
        });
    }
    // Function to make a request to pay
    requestToPay(amount, phoneNumber, currency, 
    //   payeePartyId: string, //
    payerMessage, payeeNote) {
        return __awaiter(this, void 0, void 0, function* () {
            const referenceId = this.generateReferenceId();
            try {
                const accessToken = yield this.generateAccessToken();
                const response = yield axios_1.default.post(`${this.apiUrl}/collection/v1_0/requesttopay`, {
                    amount,
                    currency,
                    externalId: '123456',
                    payer: {
                        partyIdType: 'MSISDN',
                        partyId: phoneNumber // Replace with the payer's phone number
                    },
                    /*     payee: {
                          partyIdType: 'MSISDN',
                          partyId: payeePartyId
                        }, */
                    payerMessage,
                    payeeNote
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                        'X-Reference-Id': referenceId,
                        'X-Target-Environment': this.targetEnvironment,
                        'Ocp-Apim-Subscription-Key': this.collectionSubscriptionKey // Add the Ocp-Apim-Subscription-Key header with your subscription key      
                    }
                });
                if (response.status === 202) {
                    console.log(`Top-up request successful for transaction with referenceId ${referenceId}`);
                    return referenceId;
                }
                else {
                    console.log(`Top-up request failed for transaction with referenceId ${referenceId}`);
                    throw new Error('Failed to make a request to pay');
                }
            }
            catch (error) {
                throw new Error(`Error making a request to pay: ${error}`);
            }
        });
    }
    // Function to get the account balance
    getAccountBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accessToken = yield this.generateAccessToken();
                const response = yield axios_1.default.get(`${this.apiUrl}/collection/v1_0/account/balance`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Ocp-Apim-Subscription-Key': this.collectionSubscriptionKey
                    }
                });
                if (response.status === 200) {
                    return parseFloat(response.data.availableBalance);
                }
                else {
                    throw new Error('Failed to get account balance');
                }
            }
            catch (error) {
                throw new Error(`Error getting account balance: ${error}`);
            }
        });
    }
    // Function to get the account balance in a specific currency
    getAccountBalanceInCurrency(currency) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accessToken = yield this.generateAccessToken();
                const response = yield axios_1.default.get(`${this.apiUrl}/collection/v1_0/account/balance/${currency}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'X-Target-Environment': this.targetEnvironment,
                        'Ocp-Apim-Subscription-Key': this.collectionSubscriptionKey
                    }
                });
                if (response.status === 200) {
                    return parseFloat(response.data.availableBalance);
                }
                else {
                    throw new Error('Failed to get account balance in currency');
                }
            }
            catch (error) {
                throw new Error(`Error getting account balance in currency: ${error}`);
            }
        });
    }
    // Function to get basic user info
    getBasicUserInfo(accountHolderMSISDN) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accessToken = yield this.generateAccessToken();
                const response = yield axios_1.default.get(`${this.apiUrl}/collection/v1_0/accountholder/msisdn/${accountHolderMSISDN}/basicuserinfo`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'X-Target-Environment': this.targetEnvironment,
                        'Ocp-Apim-Subscription-Key': this.collectionSubscriptionKey
                    }
                });
                if (response.status === 200) {
                    return response.data;
                }
                else {
                    throw new Error('Failed to get basic user info');
                }
            }
            catch (error) {
                throw new Error(`Error getting basic user info: ${error}`);
            }
        });
    }
    // Function to get user info with consent
    getUserInfoWithConsent() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accessToken = yield this.generateAccessToken();
                const response = yield axios_1.default.get(`${this.apiUrl}/collection/oauth2/v1_0/userinfo`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'X-Target-Environment': this.targetEnvironment,
                        'Ocp-Apim-Subscription-Key': this.collectionSubscriptionKey
                    }
                });
                if (response.status === 200) {
                    return response.data;
                }
                else {
                    throw new Error('Failed to get user info with consent');
                }
            }
            catch (error) {
                throw new Error(`Error getting user info with consent: ${error}`);
            }
        });
    }
    // Function to get the status of a request to pay transaction
    getRequestToPayTransactionStatus(referenceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accessToken = yield this.generateAccessToken();
                const response = yield axios_1.default.get(`${this.apiUrl}/collection/v1_0/requesttopay/${referenceId}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Ocp-Apim-Subscription-Key': this.collectionSubscriptionKey
                    }
                });
                if (response.status === 200) {
                    return response.data.status;
                }
                else {
                    throw new Error('Failed to get request to pay transaction status');
                }
            }
            catch (error) {
                throw new Error(`Error getting request to pay transaction status: ${error}`);
            }
        });
    }
    // Function to get the status of a request to withdraw transaction
    getRequestToWithdrawTransactionStatus(referenceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accessToken = yield this.generateAccessToken();
                const response = yield axios_1.default.get(`${this.apiUrl}/collection/v1_0/requesttowithdraw/${referenceId}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Ocp-Apim-Subscription-Key': this.collectionSubscriptionKey,
                        'X-Target-Environment': this.targetEnvironment
                    }
                });
                if (response.status === 200) {
                    return response.data.status;
                }
                else {
                    throw new Error('Failed to get request to withdraw transaction status');
                }
            }
            catch (error) {
                throw new Error(`Error getting request to withdraw transaction status: ${error}`);
            }
        });
    }
    // Function to make a request to withdraw
    requestToWithdraw(amount, payeePartyId, payeeNote, payerMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            const referenceId = this.generateReferenceId();
            try {
                const accessToken = yield this.generateAccessToken();
                const response = yield axios_1.default.post(`${this.apiUrl}/collection/v2_0/requesttowithdraw`, {
                    amount,
                    currency: 'XAF',
                    externalId: (0, uuid_1.v4)(),
                    payer: {
                        partyIdType: 'MSISDN',
                        partyId: this.simpayPhoneNumber // Replace with the payer's phone number
                    },
                    payeeNote,
                    payerMessage,
                    payee: {
                        partyIdType: 'MSISDN',
                        partyId: payeePartyId
                    }
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                        'X-Reference-Id': referenceId,
                        'X-Target-Environment': this.targetEnvironment,
                        'Ocp-Apim-Subscription-Key': this.collectionSubscriptionKey
                    }
                });
                if (response.status === 202) {
                    return response.data.referenceId;
                }
                else {
                    throw new Error('Failed to make a request to withdraw');
                }
            }
            catch (error) {
                throw new Error(`Error making a request to withdraw: ${error}`);
            }
        });
    }
    // Function to validate the status of an account holder
    validateAccountHolderStatus(partyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accessToken = yield this.generateAccessToken();
                const response = yield axios_1.default.get(`${this.apiUrl}/collection/v1_0/accountholder/${partyId}/active`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                if (response.status === 200) {
                    return response.data.status;
                }
                else {
                    throw new Error('Failed to validate account holder status');
                }
            }
            catch (error) {
                throw new Error(`Error validating account holder status: ${error}`);
            }
        });
    }
    //****************** Sandbox functions for creation of Api User and Api Key */
    // Function to generate a unique reference ID
    generateReferenceId() {
        // Implement your own logic to generate a unique reference ID
        const referenceId = (0, uuid_1.v4)();
        // You can use a UUID library or any other method of your choice
        // Return a string representing the reference ID
        return referenceId;
    }
    // Function to create an API user
    createApiUser() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const referenceId = (0, uuid_1.v4)(); // generate a UUID
                const response = yield axios_1.default.post(`${this.apiUrl}/v1_0/apiuser`, { providerCallbackHost: 'string' }, // Replace 'string' with the actual provider callback host value
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Reference-Id': referenceId,
                        'Ocp-Apim-Subscription-Key': this.collectionSubscriptionKey
                    }
                });
                if (response.status === 201) {
                    return response.data.apiUserID;
                }
                else {
                    throw new Error('Failed to create API user');
                }
            }
            catch (error) {
                throw new Error(`Error creating API user: ${error}`);
            }
        });
    }
    // Function to create an API key for an API user
    createApiKey(apiUserID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.post(`${this.apiUrl}/v1_0/apiuser/${apiUserID}/apikey`, {}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Ocp-Apim-Subscription-Key': this.collectionSubscriptionKey
                    }
                });
                if (response.status === 201) {
                    return response.data.apiKey;
                }
                else {
                    throw new Error('Failed to create API key');
                }
            }
            catch (error) {
                throw new Error(`Error creating API key: ${error}`);
            }
        });
    }
    // Function to get an API user by ID
    getApiUser(apiUserID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accessToken = yield this.generateAccessToken();
                const response = yield axios_1.default.get(`${this.apiUrl}/v1_0/apiuser/${apiUserID}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                if (response.status === 200) {
                    return response.data;
                }
                else {
                    throw new Error('Failed to get API user');
                }
            }
            catch (error) {
                throw new Error(`Error getting API user: ${error}`);
            }
        });
    }
    // Check if the phone number is a valid MTN number
    isValidMtnNumber(phoneNumber) {
        // Perform any necessary validation logic, e.g., check phone number format, prefix, etc.
        // Simulate checking if the phone number is in the list of valid MTN numbers
        return this.validMtnPhoneNumbers.includes(phoneNumber);
    }
}
// Create an instance of the MTN mobile money service
exports.mtnMomoService = new MtnMomoService();
