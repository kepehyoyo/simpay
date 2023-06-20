
import { Transaction, TransactionDoc,TransactionType,TransactionStatus } from "../models/transaction";
import mongoose from "mongoose";


export interface TransactionQuery {
 
  sourceWalletId: string | null;
  destinationWalletId: string | null;
  status: TransactionStatus | null;
  type: TransactionType | null;
  fromDate: Date | null;
  toDate: Date | null;
  page: number;
  limit: number;
}

  
  export class TransactionRepository {
    private transactions: TransactionDoc[];
  
    constructor() {
      this.transactions = [];
    }
    
  
  async find(query: TransactionQuery, page: number, limit: number): Promise<{ transactions: TransactionDoc[]; count: number }> {
    // Create the Mongoose query object
    const mongooseQuery = Transaction.find(query);

    // Add pagination options to the query
    mongooseQuery.skip((page - 1) * limit).limit(limit);

    // Execute the query
    const transactions = await mongooseQuery.exec();

    // Get the total count of matching documents
    const count = await Transaction.countDocuments(query);

    // Map the documents to the Transaction model
    const mappedTransactions = transactions.map((doc) => doc.toObject() as TransactionDoc);

    return { transactions: mappedTransactions, count };
  }

    async addTransaction(transaction: TransactionDoc): Promise<void> {
      this.transactions.push(transaction);
    }
  }
  
  
  