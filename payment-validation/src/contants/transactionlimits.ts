import { AccountType, TransactionLimit, VerificationLevel } from "../models/trasanctionLimit";
 

// Instantiate transaction limit model for a customer account with standard verification
export const customerLevel01Limit =  TransactionLimit.build({
  accountType: AccountType.CUSTOMER,
  verificationLevel: VerificationLevel.LEVEL_1,
  dailyLimit: 100, // set daily limit to 1000
  weeklyLimit: 500, // set weekly limit to 5000
  monthlyLimit: 2000 // set monthly limit to 20000
});

// Instantiate transaction limit model for a customer account with premium verification
export const customerLevel02Limit = TransactionLimit.build({
  accountType: AccountType.CUSTOMER,
  verificationLevel: VerificationLevel.LEVEL_2,
  dailyLimit: 5000, // set daily limit to 5000
  weeklyLimit: 25000, // set weekly limit to 25000
  monthlyLimit: 100000 // set monthly limit to 100000
});

// Instantiate transaction limit model for a merchant account with standard verification
export const merchantLevel01Limit = TransactionLimit.build({
  accountType: AccountType.MERCHANT,
  verificationLevel: VerificationLevel.LEVEL_1,
  dailyLimit: 10000, // set daily limit to 10000
  weeklyLimit: 50000, // set weekly limit to 50000
  monthlyLimit: 200000 // set monthly limit to 200000
});

// Instantiate transaction limit model for a merchant account with premium verification
export const merchantLevel02Limit = TransactionLimit.build({
  accountType: AccountType.MERCHANT,
  verificationLevel: VerificationLevel.LEVEL_2,
  dailyLimit: 50000, // set daily limit to 50000
  weeklyLimit: 250000, // set weekly limit to 250000
  monthlyLimit: 1000000 // set monthly limit to 1000000
});

/* // Save all transaction limit instances to the database
customerLevel01Limit.save();
customerLevel02Limit.save();
merchantLevel01Limit.save();
merchantLevel02Limit.save();
 */