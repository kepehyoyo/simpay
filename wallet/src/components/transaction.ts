import { v4 as uuidv4 } from 'uuid';
import { Wallet, WalletDoc } from '../models/wallet';
import { Transaction as TransactionModel,TransactionDoc,TransactionType ,TransactionStatus} from '../models/transaction';

export class Transaction {
  private readonly wallet: WalletDoc;

  constructor(wallet: WalletDoc) {
    this.wallet = wallet;
  }

    async createTransaction(
        amount: number,
        type: TransactionType,
        transactionStatus:TransactionStatus,
        description?: string
    ): Promise<TransactionDoc> {
        // Create a new transaction object
        const transaction_id = uuidv4();
        const transaction = TransactionModel.build({
            transaction_id,
            wallet_id: this.wallet.walletId,
            type,
            transactionStatus,
            amount,
            description, 
        });

    // Update wallet balance and save transaction
    if (type === TransactionType.CREDIT && transactionStatus===TransactionStatus.SUCCESSFUL) {
      this.wallet.balance += amount;
    } else {
      this.wallet.balance -= amount;
    }
    this.wallet.updated_at = new Date();
    await Promise.all([this.wallet.save(), transaction.save()]);

    return transaction;
  }
}
