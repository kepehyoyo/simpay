import { Transaction, TransactionDoc,TransactionStatus,TransactionType } from "../models/transaction";
import { WalletService} from "./wallet-service";
import { TransactionRepository,TransactionQuery } from "./transaction-repository";

//import axios from 'axios';

//import { Kafka, Producer } from "kafkajs";



export class TransactionService { 
  /* private kafka: Kafka;
  private producer: Producer; */
  private AUTH_MICROSERVICE_BASE_URL = 'http://auth-service.example.com';
  constructor() { 
    // Initialize Kafka client and producer
    /* this.kafka = new Kafka({
      clientId: "transaction-service",
      brokers: ["localhost:9092"],
    });
    this.producer = this.kafka.producer();
    this.producer.connect(); */
  }

/* 
    static async initiateTransaction(paymentInfo: any): Promise<any> {
      // Create a Kafka producer instance
    
      try {
        // Connect to the Kafka cluster
        await producer.connect();
  
        // Publish a "transaction-initiated" event to Kafka with the payment information
        await producer.send({
          topic: 'transaction-initiated',
          messages: [{ value: JSON.stringify(paymentInfo) }],
        });
  
        // Return a success response
        return { paymentInfo };
      } catch (error) {
        // Return an error response
        throw new Error(`Failed to initiate payment: ${error.message}`);
      } finally {
        // Disconnect from the Kafka cluster
        await producer.disconnect();
      }
    } */
  
  
    static async   findTransactionById(transactionId:string):Promise<TransactionDoc> {
      try{
        // Find transactionin the database by Id
          const transaction =  await Transaction.findOne({transactionId});
  
          // If the transaction is not found, return a 404 error
          if(!transaction){
            throw new Error ('Transaction not found');
          }
          return  transaction
      } catch(error){
        // If there's an error updating the transaction, return a 500 error
          console.error(error);
          throw new Error('Error finding transaction')
  
      }
  }
  
  

  static async createTransaction(transaction: TransactionDoc): Promise<TransactionDoc> {

    
    try {
      // Send transaction message to Kafka topic
      const message = {
        transaction_id: transaction.transactionId,
        source_wallet_id: transaction.sourceWalletId,
        destination_wallet_id: transaction.destinationWalletId,
        transaction_type: transaction.transactionType,
        transaction_amount: transaction.transactionAmount,
        transaction_currency: transaction.transactionCurrency,
        transaction_fee: transaction.transactionFee,
        transaction_status: transaction.transactionStatus,
        transaction_date: transaction.transactionDate,
        transaction_description: transaction.transactionDescription,
        metadata: transaction.metadata,
      };

       // Check if source wallet has sufficient balance
      
       const sourceWallet = await WalletService.getWallet(transaction.sourceWalletId);
       if (sourceWallet.balance < transaction.transactionAmount) {
           throw new Error(" Insufficient balance ");
       }
 
      // Update source wallet balance
     const updatedSourceWallet = await WalletService.debitWalletBalance(
        transaction.sourceWalletId,
        (transaction.transactionAmount + transaction.transactionFee)
      );

      // Update destination wallet balance
      const destinationWallet = await WalletService.getWallet( transaction.destinationWalletId);
      const updatedDestinationWallet = await WalletService.creditWalletBalance(
                                        transaction.destinationWalletId,transaction.transactionAmount);
                          

    /*   await this.producer.send({
        topic: "transaction",
        messages: [{ value: JSON.stringify(message) }],
      });
 */
      // Return created transaction
      return transaction;
    } catch (err) {
      console.error(err);
      throw new Error("Error creating transaction");
    }
  }
  static async  updateTransactionStatus(transactionId:string, status:TransactionStatus,completionTime:Date):Promise<TransactionDoc> {
    try {
      const updatedTransaction = await Transaction.findOneAndUpdate(
        { transactionId },
        { transactionStatus:status,transactionDate:completionTime },
        { new: true } // return the updated document
      );
  
      console.log(`Transaction ${transactionId} status updated to ${status}`);
      return updatedTransaction!;
    } catch (err) {
      console.error(`Failed to update transaction ${transactionId} status:`, err);
      throw err;
    }
  }
  
/*  
  async addTransaction(transaction: TransactionDoc): Promise<void> {
    if (!transaction.sourceWalletId || !transaction.destinationWalletId || !transaction.transactionAmount) {
      throw new Error('sourceWalletId, destinationWalletId, and amount are required fields');
    }

    if (transaction.transactionAmount <= 0) {
      throw new Error('amount must be a positive number');
    }

    await this.transactionRepository.addTransaction(transaction);
  }
 */


  public static async findTransactionsbyId(query: TransactionQuery): Promise<{ transactions: TransactionDoc[]; count: number }> {
    try {
      // Use the query object to build a MongoDB query
      const mongoQuery: any = {};
      if (query.sourceWalletId || query.destinationWalletId) {
        mongoQuery.$or = [];
        if (query.sourceWalletId) {
          mongoQuery.$or.push({ sourceWalletId: query.sourceWalletId });
        }
        if (query.destinationWalletId) {
          mongoQuery.$or.push({ destinationWalletId: query.destinationWalletId });
        }
      }
      if (query.status) {
        mongoQuery.status = query.status;
      }
      if (query.type) {
        mongoQuery.type = query.type;
      }
      if (query.fromDate || query.toDate) {
        mongoQuery.createdAt = {};
        if (query.fromDate) {
          mongoQuery.createdAt.$gte = query.fromDate;
        }
        if (query.toDate) {
          mongoQuery.createdAt.$lte = query.toDate;
        }
      }

      // Use the query object to build a Mongoose query
      const mongooseQuery = Transaction.find(mongoQuery)
        .sort({ createdAt: -1 })
        .skip((query.page - 1) * query.limit)
        .limit(query.limit);

      // Execute the Mongoose query
      const [transactions, count] = await Promise.all([mongooseQuery, Transaction.countDocuments(mongoQuery)]);

      return { transactions, count };
    } catch (error) {
      console.error('Error in TransactionService.findTransactions', error);
      throw error;
    }
  }
static async  findTransactions(query: TransactionQuery): Promise<{ transactions: TransactionDoc[]; count: number }> {
  const { sourceWalletId, destinationWalletId, status, type, fromDate, toDate, page, limit } = query;

  // Build query object based on input params
  const q: any = {};

  if (sourceWalletId) {
    q.sourceWalletId = sourceWalletId;
  }

  if (destinationWalletId) {
    q.destinationWalletId = destinationWalletId;
  }

  if (status) {
    q.status = status;
  }

  if (type) {
    q.type = type;
  }

  if (fromDate || toDate) {
    q.transaction_date = {};

    if (fromDate) {
      q.transaction_date.$gte = fromDate;
    }

    if (toDate) {
      q.transaction_date.$lte = toDate;
    }
  }

  // Call repository to retrieve transactions
  const transactionRepository = new TransactionRepository();
  const {transactions, count} = await transactionRepository.find(q, page, limit) ;
  
  return { transactions, count };
}




}

export async function getPendingTransactions(): Promise<TransactionDoc[]> {
  try {
  // Find all pending transactions in the database
  const transactions = await Transaction.find({ status: 'pending' });
  
    // Return the transactions in the response
    return transactions
  } catch (error) {
    // If there's an error retrieving the transactions, return a 500 error
    console.error(error);
    throw new Error('Error retrieving transactions');
  }
  }
  

 export async function approveTransaction(transactionId:string): Promise<TransactionDoc> {
 
  
  try {
    // Find the transaction in the database by ID
    const transaction = await Transaction.findById(transactionId);
  
    // If the transaction is not found, return a 404 error
    if (!transaction) {
      throw new Error('Transaction not found' );
    }
  
    // If the transaction is not pending, return a 400 error
    if (transaction.transactionStatus !== TransactionStatus.PENDING) {
      throw new Error('Transaction is not pending' );
    }
  
    // Update the transaction status to approved in the database
    transaction.transactionStatus = TransactionStatus.APPROVED;
    await transaction.save();
  
    // Return the updated transaction in the response
    return transaction;
  } catch (error) {
    // If there's an error updating the transaction, return a 500 error
    console.error(error);
    throw new Error('Error updating transaction' );
  }
  }
  
  export  async function rejectTransaction(transactionId:string): Promise<TransactionDoc> {
 
  try {
    // Find the transaction in the database by ID
    const transaction = await Transaction.findOne({transactionId});
  
    // If the transaction is not found, return a 404 error
    if (!transaction) {
      throw new Error( 'Transaction not found');
    }
  
    // If the transaction is not pending, return a 400 error
    if (transaction.transactionStatus !== TransactionStatus.PENDING) {
      throw new Error('Transaction is not pending');
    }
  
    // Update the transaction status to rejected in the database
    transaction.transactionStatus = TransactionStatus.REJECTED;
    await transaction.save();
  /* 
    // Update the sender and recipient wallets' balances in the database
    const senderWallet = await Wallet.findById(transaction.senderWalletId);
    const recipientWallet = await Wallet.findById(transaction.recipientWalletId);
    senderWallet.balance += transaction.amount;
    recipientWallet.balance -= transaction.amount;
    await Promise.all([senderWallet.save(), recipientWallet.save()]);
  */
    // Return the updated transactio n in the response
    return transaction;
  } catch (error) {
    // If there's an error updating the transaction, return a 500 error
    console.error(error);
    throw new Error('Error updating transaction' );
  }
  





  
}