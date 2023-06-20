
import { AccountType,VerificationLevel,TransactionLimit } from "../models/trasanctionLimit";
export class TransactionLimitService {
    static async getDailyLimit(accountType: AccountType, verificationLevel: VerificationLevel): Promise<number> {
      const transactionLimitDoc = await TransactionLimit.findOne({ accountType, verificationLevel }).exec();
      return transactionLimitDoc?.dailyLimit ?? 0;
    }
  
    static async getWeeklyLimit(accountType: AccountType, verificationLevel: VerificationLevel): Promise<number> {
      const transactionLimitDoc = await TransactionLimit.findOne({ accountType, verificationLevel }).exec();
      return transactionLimitDoc?.weeklyLimit ?? 0;
    }
  
    static async getMonthlyLimit(accountType: AccountType, verificationLevel: VerificationLevel): Promise<number> {
      const transactionLimitDoc = await TransactionLimit.findOne({ accountType, verificationLevel }).exec();
      return transactionLimitDoc?.monthlyLimit ?? 0;
    }
  }