import { Wallet, WalletDoc } from "../models/wallet";
import { BadRequestError } from "@cygnetops/common-v2";
import { AccountType, VerificationLevel } from "../models/trasanctionLimit";

  export class WalletService {
 
   static async createWallet(walletId: string,balance:number,currency:string ,accountType:AccountType,verificationLevel:VerificationLevel):Promise<WalletDoc>{

    try {
      // Create a new wallet in the database
      const existingWallet = await Wallet.findOne({walletId})

            if(existingWallet){
              throw new BadRequestError('wallet already exist')
            }

      const newWallet = Wallet.build({walletId, balance,currency,accountType,verificationLevel});
      await newWallet.save();
      console.log(JSON.stringify(newWallet));
     
      return newWallet;
    } catch (error) {
      console.error(error); 
      throw new Error('Error creating wallet')
    } 
  }



  static async  getWallet(walletId: string): Promise<WalletDoc> {
    const wallet = await Wallet.findOne({walletId});
    if (!wallet) {
      throw new Error(`Wallet with ID ${walletId} not found`);
    }
    return wallet;
  }

  /* static async  creditWalletBalance(walletId: string, amount: number): Promise<WalletDoc> {
    const wallet = await WalletService.getWallet(walletId);
    wallet.balance += amount;
    wallet.save();
    console.log(wallet.balance);
    return wallet;
  }

  static async debitWalletBalance(walletId: string, amount: number): Promise<WalletDoc> {
    const wallet = await WalletService.getWallet(walletId);
    wallet.balance -= amount;
    wallet.save();

    console.log(wallet.balance);
    return wallet;
  }
 */
  /* static async  getTransactionsByWalletId(walletId:string): Promise<TransactionDoc[]> {

  try {
    // Find all transactions for the wallet in the database
    const transactions = await Transaction.find({ $or: [{ senderWalletId: walletId }, { recipientWalletId: walletId }] });

    // Return the transactions in the response
    console.log(transactions);
    return transactions;
  } catch (error) {
    // If there's an error retrieving the transactions, return a 500 error
    console.error(error);
    throw new Error('Error retrieving transactions');
  }
} */

}