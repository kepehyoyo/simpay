import { AccountType, VerificationLevel } from "../models/trasanctionLimit";
import { ComplainceService } from "./compliance";
import { FraudService } from "./fraud-detection";
import { PaymentService } from "./payment-service";
import { UserAuthService } from "./user-authorisation";

export class ValidationService { 
    static  async  validatePayment(sourceWalletId: string, paymentAmount: number,accountType:AccountType,verificationLevel:VerificationLevel, recipientWalletId: string, paymentMethod: string): Promise<boolean> {
        // Check if user is authorized to make payments
        const isUserAuthorized = await UserAuthService.checkUserAuthorization(sourceWalletId)
        if (!isUserAuthorized) {
          console.log(`User ${sourceWalletId} is not authorized to make payments.`);
          return false;
        }
      
        // Check if payment amount is valid
        const isValidAmount = await PaymentService.checkPaymentAmount(sourceWalletId,paymentAmount,accountType,verificationLevel)
        if (!isValidAmount) {
          console.log(`Invalid payment amount: ${paymentAmount}.`);
          return false;
        }
      
        // Check if payment recipient is valid
        const isValidRecipient = await PaymentService.checkPaymentRecipient(recipientWalletId);
        if (!isValidRecipient) {
          console.log(`Invalid payment recipient: ${recipientWalletId}.`);
          return false;
        }
      
        // Check if payment method is valid
        const isValidMethod = await PaymentService.checkPaymentMethod(paymentMethod);
        if (!isValidMethod) {
          console.log(`Invalid payment method: ${paymentMethod}.`);
          return false;
        }
        
          // Perform fraud detection checks
         const isFraudulent = await FraudService.checkForFraud(paymentAmount, recipientWalletId, paymentMethod);
      if (isFraudulent) {
        console.log(`Fraudulent payment detected: amount=${paymentAmount}, recipient=${recipientWalletId}, method=${paymentMethod}.`);
        return false;
      }

           // Perform compliance checks
          const isComplaint = await ComplainceService.checkCompliance(sourceWalletId)
           if (!isComplaint) {
             console.log(` Payment is non-Complain for: userId=${sourceWalletId}.`);
             return false;
           }
        // Payment is valid if all checks pass
        return true;
      }
      
}