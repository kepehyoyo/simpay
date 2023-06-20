"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.merchantLevel02Limit = exports.merchantLevel01Limit = exports.customerLevel02Limit = exports.customerLevel01Limit = void 0;
const trasanctionLimit_1 = require("../models/trasanctionLimit");
// Instantiate transaction limit model for a customer account with standard verification
exports.customerLevel01Limit = trasanctionLimit_1.TransactionLimit.build({
    accountType: trasanctionLimit_1.AccountType.CUSTOMER,
    verificationLevel: trasanctionLimit_1.VerificationLevel.LEVEL_1,
    dailyLimit: 100,
    weeklyLimit: 500,
    monthlyLimit: 2000 // set monthly limit to 20000
});
// Instantiate transaction limit model for a customer account with premium verification
exports.customerLevel02Limit = trasanctionLimit_1.TransactionLimit.build({
    accountType: trasanctionLimit_1.AccountType.CUSTOMER,
    verificationLevel: trasanctionLimit_1.VerificationLevel.LEVEL_2,
    dailyLimit: 5000,
    weeklyLimit: 25000,
    monthlyLimit: 100000 // set monthly limit to 100000
});
// Instantiate transaction limit model for a merchant account with standard verification
exports.merchantLevel01Limit = trasanctionLimit_1.TransactionLimit.build({
    accountType: trasanctionLimit_1.AccountType.MERCHANT,
    verificationLevel: trasanctionLimit_1.VerificationLevel.LEVEL_1,
    dailyLimit: 10000,
    weeklyLimit: 50000,
    monthlyLimit: 200000 // set monthly limit to 200000
});
// Instantiate transaction limit model for a merchant account with premium verification
exports.merchantLevel02Limit = trasanctionLimit_1.TransactionLimit.build({
    accountType: trasanctionLimit_1.AccountType.MERCHANT,
    verificationLevel: trasanctionLimit_1.VerificationLevel.LEVEL_2,
    dailyLimit: 50000,
    weeklyLimit: 250000,
    monthlyLimit: 1000000 // set monthly limit to 1000000
});
/* // Save all transaction limit instances to the database
customerLevel01Limit.save();
customerLevel02Limit.save();
merchantLevel01Limit.save();
merchantLevel02Limit.save();
 */ 
