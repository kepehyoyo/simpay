import { Subjects } from "./subjects";

export class CreateWalletEvent {
  subject: Subjects.WalletCreated = Subjects.WalletCreated;
  data: {
    walletId: string;
    balance: number;
    currency:string;
  };

  constructor(data: { walletId: string,balance:number,currency:string }) {
    this.data = data;
  }
}

export class FundsAvailableEvent {
  subject: Subjects.FundsAvailable = Subjects.FundsAvailable;
  data: {   
    transactionId: string;
    status: string;
    balance: number;
     
  };

  constructor(data: { transactionId: string, status:string,balance:number}) {
    this.data = data;
  }
}
