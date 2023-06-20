import { Subjects } from "./subjects";
 

export class PaymentValidationEvent {
  subject: Subjects.PAYMENT_VALIDATION = Subjects.PAYMENT_VALIDATION;
  data: {
    transactionId: string;
    status: string
  };

  constructor(data: { transactionId: string, status:string}) {
    this.data = data;
  }
} 
