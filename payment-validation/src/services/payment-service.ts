 import { AccountType } from "../models/trasanctionLimit";
import { PaymentAmountService } from "./payment-amount-service";
import { TransactionLimitService } from "./transaction-limit-service";
import { UserService } from "./user-service";
import { WalletService } from "./wallet-service";


export class PaymentService{
static async  checkPaymentAmount(walletId: string, paymentAmount: number, accountType: AccountType, verificationLevel: number): Promise<boolean> {
      //  const transactionLimitModel = new TransactionLimitModel();
        const dailyLimit = await TransactionLimitService.getDailyLimit(accountType, verificationLevel);
        const weeklyLimit = await TransactionLimitService.getWeeklyLimit(accountType, verificationLevel);
        const monthlyLimit = await TransactionLimitService.getMonthlyLimit(accountType, verificationLevel);
        
        // Check if payment amount is within the allowed limits
        const currentDate = new Date();
      
        const dailyAmount = await PaymentAmountService.getDailyPaymentAmount(walletId, currentDate);
        const weeklyAmount = await PaymentAmountService.getWeeklyPaymentAmount(walletId, currentDate);
        const monthlyAmount = await PaymentAmountService.getMonthlyPaymentAmount(walletId, currentDate);
       console.log(`you have so far used ${dailyAmount} from your daily limit of ${dailyLimit}`)


        if (paymentAmount <= 0) {
          console.log(`Payment amount ${paymentAmount} is not a positive value.`);
          return false;
        } else if (dailyAmount + paymentAmount > dailyLimit) {
          console.log(`Daily payment limit exceeded for user ${walletId}.`);
          return false;
        } else if (weeklyAmount + paymentAmount > weeklyLimit) {
          console.log(`Weekly payment limit exceeded for user ${walletId}.`);
          return false;
        } else if (monthlyAmount + paymentAmount > monthlyLimit) {
          console.log(`Monthly payment limit exceeded for user ${walletId}.`);
          return false;
        } else {
          return true;
        }
      
    return true;
  }
  
  //import { PaymentRecipientModel } from './paymentRecipientModel';

  static async   checkPaymentRecipient(recipientWalletId: string): Promise<boolean> {
    
    const recipientWallet = await WalletService.getWallet(recipientWalletId);
  
    if (!recipientWallet) {
      console.log(`Recipient wallet ${recipientWalletId} not found.`);
      return false;
    } else if (!recipientWallet.verificationLevel) {
      console.log(`Recipient ${recipientWalletId} is not verified.`);
      return false;
    } else {
      return true;
    }
  }
  
  static async   checkPaymentMethod(paymentMethod: string): Promise<boolean> {
    // Perform payment method validation checks, e.g., check if payment method is supported and not expired
    // Return true if payment method is valid, false otherwise
    return true;
  }
}