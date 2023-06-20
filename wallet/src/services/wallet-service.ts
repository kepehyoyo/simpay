import { CreateWalletEvent } from "../events/create-wallet-event";
import { KafkaProducer } from "../events/kafka-producer";
import { CreateWalletPublisher } from "../events/publishers/wallet-created-publisher";
import { TransactionType ,Transaction,TransactionDoc} from "../models/transaction";
import { Wallet, WalletDoc } from "../models/wallet";
import { BadRequestError } from "@cygnetops/common-v2";
import { v4 as uuidv4 } from 'uuid';

/* export class WalletService {
} */
  export async function createWalletwithId(walletId: string, userId:string, balance:number,currency:string):Promise<WalletDoc>{

    try {
      // Create a new wallet in the database
      const existingWallet = await Wallet.findOne({walletId})

            if(existingWallet){
              throw new BadRequestError('wallet already exist')
            }
         const  balance = 1000;
      const newWallet = Wallet.build({ walletId, userId,balance,currency});
      await newWallet.save();
      console.log(JSON.stringify(newWallet));
     
      return newWallet;
    } catch (error) {
      console.error(error); 
      throw new Error('Error creating wallet')
    } 
  }

  // new wallet should have a zero balance 
  
  export async function createWallet(userId:string ,currency:string):Promise<WalletDoc>{
    const walletId:string = uuidv4(); 
    try {
      // Create a new wallet in the database
      const existingWallet = await Wallet.findOne({walletId})

            if(existingWallet){
              throw new BadRequestError('wallet already exist')
            }
     const  balance = 1000;
      const newWallet = Wallet.build({ walletId, userId,balance,currency});
      await newWallet.save();
      console.log(JSON.stringify(newWallet));
     
          // Publish walletCreated event to Kafka topic 
          const kafkaProducer = new KafkaProducer(); 
          const createWalletEvent = new CreateWalletEvent({walletId,balance,currency});
          const createWalletPublisher = new CreateWalletPublisher(kafkaProducer);
          await createWalletPublisher.publish(createWalletEvent); 


      return newWallet;
    } catch (error) {
      console.error(error); 
      throw new Error('Error creating wallet')
    } 
  }


  export async function getWallet(walletId: string): Promise<WalletDoc> {
    const wallet = await Wallet.findOne({walletId});
    if (!wallet) {
      throw new Error(`Wallet with ID ${walletId} not found`);
    }
    return wallet;
  }

  export async function creditWalletBalance(walletId: string, amount: number): Promise<WalletDoc> {
    const wallet = await getWallet(walletId);
    wallet.balance += amount;
    wallet.save();
    console.log(wallet.balance);
    return wallet;
  }

  export async function debitWalletBalance(walletId: string, amount: number): Promise<WalletDoc> {
    const wallet = await getWallet(walletId);
    wallet.balance -= amount;
    wallet.save();

    console.log(wallet.balance);
    return wallet;
  }

export async function getTransactionsByWalletId(walletId:string): Promise<TransactionDoc[]> {

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
}
