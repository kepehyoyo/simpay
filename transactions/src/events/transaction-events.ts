import { Subjects } from "./subjects";
import { Transaction, TransactionDoc } from "../models/transaction";

export class InitiatePaymentEvent {
  subject: Subjects.PAYMENT_INITIATED = Subjects.PAYMENT_INITIATED;
  data: {
    transaction: TransactionDoc;
  };

  constructor(data: { transaction: TransactionDoc}) {
    this.data = data;
  }
}
export class ConfirmPaymentEvent {
    subject: Subjects.PAYMENT_CONFIRMED = Subjects.PAYMENT_CONFIRMED;
    data: {
      transaction: TransactionDoc;
    };
  
    constructor(data: { transaction: TransactionDoc }) {
      this.data = data;
    }
}

export class ConfirmFundsevent {
  subject: Subjects.CONFIRM_FUNDS = Subjects.CONFIRM_FUNDS;
  data: {
    transaction: TransactionDoc;
  };

  constructor(data: { transaction: TransactionDoc }) {
    this.data = data;
  }
}




 export class FailPaymentEvent {
      subject: Subjects.PAYMENT_FAILED = Subjects.PAYMENT_FAILED;
      data: {
        transactionId: string;
      };
    
      constructor(data: { transactionId: string }) {
        this.data = data;
      }
  } 
 export class InitiateRefundEvent {
             subject: Subjects.REFUND_INITIATED = Subjects.REFUND_INITIATED;
             data: {
               transactionId: string;
             };
            
             constructor(data: { transactionId: string }) {
               this.data = data
            }
   }
   export class ConfirmRefundEvent {
    subject: Subjects.REFUND_CONFIRMED = Subjects.REFUND_CONFIRMED;
    data: {
      transactionId: string;
    };
  
    constructor(data: { transactionId: string }) {
      this.data = data;
    }
}
export class FailRefundEvent {
  subject: Subjects.REFUND_FAILED = Subjects.REFUND_FAILED;
  data: {
    transactionId: string;
 };

constructor(data: { transactionId: string }) {      
        this.data = data;
   }
}


export class CreateTransactionEvent {
  subject: Subjects.TRANSACTION_CREATED = Subjects.TRANSACTION_CREATED;
  data: {
    transaction: TransactionDoc;
 };

constructor(data: { transaction: TransactionDoc }) {      
        this.data = data;
   }
}

export class UpdateTransactionEvent {
  subject: Subjects.TRANSACTION_UPDATED = Subjects.TRANSACTION_UPDATED;
  data: {
    transactionId: string;
 };

constructor(data: { transactionId: string }) {      
        this.data = data;
   }
}

