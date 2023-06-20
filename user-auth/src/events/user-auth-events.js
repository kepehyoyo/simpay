"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserEvent = void 0;
const subjects_1 = require("./subjects");
//import { Transaction } from "../models/transaction";
class CreateUserEvent {
    constructor(data) {
        this.subject = subjects_1.Subjects.USER_CREATED;
        this.data = data;
    }
}
exports.CreateUserEvent = CreateUserEvent;
/* export class ConfirmPaymentEvent {
    subject: Subjects.PAYMENT_CONFIRMED = Subjects.PAYMENT_CONFIRMED;
    data: {
      transactionId: string;
    };
  
    constructor(data: { transactionId: string }) {
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
  export class InitiateTransferEvent {
        subject: Subjects.TRANSFER_INITIATED = Subjects.TRANSFER_INITIATED;
        data: {
          transactionId: string;
        };
      
        constructor(data: { transactionId: string }) {
          this.data = data;
        }
  }
export class ConfirmTransferEvent {
          subject: Subjects.TRANSFER_CONFIRMED = Subjects.TRANSFER_CONFIRMED;
          data: {
            transactionId: string;
          };
        
          constructor(data: { transactionId: string }) {
            this.data = data;
          }
  }
 export class FailTransferEvent {
            subject: Subjects.TRANSFER_FAILED = Subjects.TRANSFER_FAILED;
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
    transactionId: string;
 };

constructor(data: { transactionId: string }) {
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

 */ 
