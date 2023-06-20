// Import required modules and dependencies
import { validateRequest } from "@cygnetops/common-v2";
import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { Transaction,TransactionType,TransactionStatus } from "../models/transaction";
import { TransactionService} from  "../service/transaction-service" 
import { v4 as uuidv4 } from 'uuid';
import { WalletService } from "../service/wallet-service";

import { KafkaProducer } from "../events/kafka-producer"; 
import { InitiatePaymentEvent } from "../events/transaction-events";
import { InitiatePaymentPublisher } from "../events/publishers/transaction-publisher";
 
 

// Define router
const router = Router();

// Create transaction API endpoint
router.post(
  "/api/transactions/payment-initiated",
  [
    // Validate request body
    body("sourceWalletId")
      .isString()
      .notEmpty()
      .withMessage("Source wallet ID is required"),
    body("destinationWalletId")
      .isString()
      .notEmpty()
      .withMessage("Destination wallet ID is required"),
    body("amount")
      .isFloat()
      .notEmpty()
      .withMessage("Amount is required and must be numeric"),
    body("type")
    .isIn(['transfer'])
  ],validateRequest,
  async (req: Request, res: Response) => { 
         
    try {
     
      // Get transaction details from request body
      const {sourceWalletId,destinationWalletId,amount} = req.body;
      console.log(`sourcewalledId = ${sourceWalletId} , destinationId =${destinationWalletId} and amount= ${amount}`)
   
      console.log("what is happening")
      // Create transaction object
      
       const sourceWallet = await  WalletService.getWallet(sourceWalletId);
       const destinationWallet = await WalletService.getWallet(destinationWalletId)
       console.log(`this is first source wallet balance = ${sourceWallet.balance} and destination wallet balance = ${destinationWallet.balance} `)
       if(!sourceWallet){
        console.log("Source Wallet does not exist")
      }

     if(!destinationWallet){
      console.log("Destination Wallet does not exist")
     }
      const transactionId = uuidv4();
      const transaction =  Transaction.build({
            transactionId,
            sourceWalletId,
            destinationWalletId,
            transactionType:TransactionType.TRANSFER,
            transactionAmount:amount,
            transactionCurrency: "XAF",
            transactionFee: 2,
            transactionStatus: TransactionStatus.PENDING, 
            transactionDescription: "Transfering money",
    });
    console.log(`this is first build transaction ${transaction}`)
        
      // Save transaction
     
      const createdTransaction = await TransactionService.createTransaction(transaction );
      try {
        await createdTransaction.save();
        console.log(`this is transaction ${createdTransaction}`)
        
    // Create a new state machine instance with the initial state
     // const  transactionStateMachine = createTransactionStateMachine(transactionId)
       
      
      
      // Publish IntiatePayment  event to Kafka topic 
        const kafkaProducer = new KafkaProducer(); 
        const initiatePaymentEvent = new InitiatePaymentEvent({transaction});
        const initiatePaymentPublisher = new InitiatePaymentPublisher(kafkaProducer);
        await initiatePaymentPublisher.publish(initiatePaymentEvent); 

      } catch (err) {
        console.error("Error creating transaction:", err);
        res.status(500).json({ message: "Server save and publish error" });
      }
      // Return response with transaction and updated wallet details
      console.log(createdTransaction)
      return res.status(201).json({
        transaction: createdTransaction,
            //  source_wallet: updatedSourceWallet,
            //   destination_wallet: updatedDestinationWallet,
      });
    } catch (err) {
     // console.error(err.message);
      return res.status(500).json({ errors: [{ msg: "Server error" }] });
    }
  }
);
// Export router
export { router as createTransactionRouter};
