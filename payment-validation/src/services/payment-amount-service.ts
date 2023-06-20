import { PaymentAmount, PaymentAmountDoc } from "../models/payment-amount";

export class PaymentAmountService{
    
    static async   getDailyPaymentAmount(walletId: string, currentDate: Date): Promise<number> {
    // Query the database to get the sum of payments made by the user on the current Day
    const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() );
    console.log(`start day is ${startOfDay}`);
    const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
    console.log(`endDay i is ${endOfDay}`);
    const dailyPayments = await PaymentAmount.find({
      walletId: walletId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });
    


    const dailyAmount = dailyPayments.reduce((acc, payment) => acc + payment.amount, 0);
    console.log(`daily amount stands at ${dailyAmount}`)
    return dailyAmount
  }
  
  static async  getWeeklyPaymentAmount(walletId: string, currentDate: Date): Promise<number> {
    const startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
    const endOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 6);
  
    const weeklyPayments = await PaymentAmount.find({
      walletId: walletId,
      date: {
        $gte: startOfWeek,
        $lte: endOfWeek,
      },
    });
  
    const weeklyAmount = weeklyPayments.reduce((acc, payment) => acc + payment.amount, 0);
    console.log(`weekly amount stands at ${weeklyAmount}`)
    return weeklyAmount;
  }
  
  
    static async   getMonthlyPaymentAmount(walletId: string, currentDate: Date): Promise<number> {
    // Calculate the start and end dates of the current month
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  // Query the database to get the sum of payments made by the user in the current month
  const payments: PaymentAmountDoc[] = await PaymentAmount.find({ walletId, createdAt: { $gte: startDate, $lte: endDate } }).select('amount');
  const monthlyAmount = payments.reduce((total, payment) => total + payment.amount, 0);
  console.log(`monthly amount stands at ${monthlyAmount}`)
  return monthlyAmount;
  }


  static async newPaymentAmount(
    walletId: string,
    date: Date,
    amount: number
  ): Promise<PaymentAmountDoc> {
    // Create a new PaymentAmount document
    console.log(`I am saving trasaction on date ${date}`)
    const paymentAmount =  PaymentAmount.build({ walletId, date, amount });

    // Save the new document to the database
    await paymentAmount.save();

    return paymentAmount;
  }

}